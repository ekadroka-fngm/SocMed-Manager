import type { AccessClaims, D1Database, Env, WorkspaceMember } from './types';

interface AccessJwtHeader {
  alg: string;
  kid: string;
  typ?: string;
}

interface AccessJwk extends JsonWebKey {
  kid?: string;
  alg?: string;
  use?: string;
}

interface AccessJwkSet {
  keys: AccessJwk[];
}

interface BrandRow {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  positioning: string;
  voice_and_tone: string;
  logo_url: string | null;
  data_json: string;
  created_at: string;
  updated_at: string;
}

class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let jwksCache: {
  issuer: string;
  expiresAt: number;
  keys: AccessJwk[];
} | null = null;

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });

function decodeBase64Url(segment: string): Uint8Array {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function decodeJsonSegment<T>(segment: string): T {
  const bytes = decodeBase64Url(segment);
  return JSON.parse(new TextDecoder().decode(bytes)) as T;
}

function normalizeIssuer(value: string): string {
  const candidate = value.startsWith('https://') ? value : `https://${value}`;
  return new URL(candidate).origin;
}

async function getAccessJwks(issuer: string): Promise<AccessJwk[]> {
  if (jwksCache && jwksCache.issuer === issuer && jwksCache.expiresAt > Date.now()) {
    return jwksCache.keys;
  }

  const response = await fetch(new URL('/cdn-cgi/access/certs', issuer), {
    headers: { accept: 'application/json' }
  });

  if (!response.ok) {
    throw new ApiError(503, 'Tidak bisa mengambil public key Cloudflare Access.');
  }

  const jwks = (await response.json()) as AccessJwkSet;
  if (!Array.isArray(jwks.keys) || jwks.keys.length === 0) {
    throw new ApiError(503, 'Cloudflare Access tidak mengembalikan signing key.');
  }

  const cacheControl = response.headers.get('cache-control') || '';
  const maxAge = Number(cacheControl.match(/max-age=(\d+)/i)?.[1] || 300);
  const ttlSeconds = Math.min(Math.max(maxAge, 60), 3600);

  jwksCache = {
    issuer,
    keys: jwks.keys,
    expiresAt: Date.now() + ttlSeconds * 1000
  };

  return jwks.keys;
}

async function verifyAccessJwt(token: string, env: Env): Promise<AccessClaims> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    throw new ApiError(503, 'Cloudflare Access belum dikonfigurasi di Worker.');
  }

  const issuer = normalizeIssuer(env.ACCESS_TEAM_DOMAIN);
  const parts = token.split('.');
  if (parts.length !== 3) throw new ApiError(401, 'Access token tidak valid.');

  let header: AccessJwtHeader;
  let claims: AccessClaims;
  let signature: Uint8Array;

  try {
    header = decodeJsonSegment<AccessJwtHeader>(parts[0]);
    claims = decodeJsonSegment<AccessClaims>(parts[1]);
    signature = decodeBase64Url(parts[2]);
  } catch {
    throw new ApiError(401, 'Access token tidak bisa dibaca.');
  }

  if (header.alg !== 'RS256' || !header.kid) {
    throw new ApiError(401, 'Algoritma atau key Access token tidak didukung.');
  }

  const now = Math.floor(Date.now() / 1000);
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];

  if (claims.iss !== issuer || !aud.includes(env.ACCESS_AUD)) {
    throw new ApiError(401, 'Issuer atau audience Access token tidak cocok.');
  }
  if (!Number.isFinite(claims.exp) || claims.exp <= now) {
    throw new ApiError(401, 'Access token sudah kedaluwarsa.');
  }
  if (claims.nbf !== undefined && claims.nbf > now) {
    throw new ApiError(401, 'Access token belum berlaku.');
  }
  if (!claims.sub) {
    throw new ApiError(401, 'Identitas Access token tidak lengkap.');
  }

  const keys = await getAccessJwks(issuer);
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new ApiError(401, 'Signing key Access token tidak ditemukan.');

  let publicKey: CryptoKey;
  try {
    publicKey = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
  } catch {
    throw new ApiError(401, 'Signing key Access token tidak valid.');
  }

  // Copy signature bytes into a concrete ArrayBuffer for WebCrypto's BufferSource type.
  const signatureBuffer = new ArrayBuffer(signature.byteLength);
  new Uint8Array(signatureBuffer).set(signature);

  const isValid = await crypto.subtle.verify(
    { name: 'RSASSA-PKCS1-v1_5' },
    publicKey,
    signatureBuffer,
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
  );

  if (!isValid) throw new ApiError(401, 'Signature Access token tidak valid.');

  const email = claims.email?.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    throw new ApiError(401, 'Email tidak ditemukan pada identitas Cloudflare Access.');
  }

  return { ...claims, email };
}

async function authenticate(request: Request, env: Env): Promise<AccessClaims> {
  // This shortcut is only enabled by an explicit local-development flag.
  // The production Wrangler configuration fixes APP_ENV to "production".
  if (env.APP_ENV === 'development' && env.LOCAL_DEV_AUTH === 'true') {
    const email = env.LOCAL_DEV_EMAIL?.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      throw new ApiError(503, 'LOCAL_DEV_EMAIL belum diatur dengan benar.');
    }
    return {
      iss: 'local-development',
      aud: 'local-development',
      exp: Math.floor(Date.now() / 1000) + 3600,
      sub: `local:${email}`,
      email
    };
  }

  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token) throw new ApiError(401, 'Login Cloudflare Access diperlukan.');

  return verifyAccessJwt(token, env);
}

async function getWorkspaceMember(
  db: D1Database,
  email: string
): Promise<WorkspaceMember> {
  const member = await db
    .prepare(
      `SELECT
        m.id,
        m.workspace_id,
        m.email,
        m.display_name,
        m.role,
        w.name AS workspace_name,
        w.timezone
      FROM workspace_members m
      INNER JOIN workspaces w ON w.id = m.workspace_id
      WHERE m.email = ? COLLATE NOCASE
        AND m.status = 'ACTIVE'
      ORDER BY m.created_at ASC
      LIMIT 1`
    )
    .bind(email)
    .first<WorkspaceMember>();

  if (!member) {
    throw new ApiError(403, 'Akun ini belum terdaftar sebagai anggota workspace.');
  }

  return member;
}

function parseJsonObject(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

function optionalText(value: unknown, maxLength = 2000): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

async function appendAuditLog(
  db: D1Database,
  member: WorkspaceMember,
  action: string,
  entityType: string,
  entityId: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO audit_logs
        (id, workspace_id, actor_member_id, action, entity_type, entity_id, details_json)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      crypto.randomUUID(),
      member.workspace_id,
      member.id,
      action,
      entityType,
      entityId,
      JSON.stringify(details)
    )
    .run();
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/api/health') {
    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed' }, 405);
    }
    await env.DB.prepare('SELECT 1 AS ok').first();
    return json({ status: 'ok', database: 'connected' });
  }

  if (!url.pathname.startsWith('/api/v1/')) {
    return json({ error: 'Endpoint not found' }, 404);
  }

  const claims = await authenticate(request, env);
  const member = await getWorkspaceMember(env.DB, claims.email!);

  if (url.pathname === '/api/v1/assistant' && request.method === 'POST') {
    if (!env.OPENAI_API_KEY) {
      throw new ApiError(503, 'GPT belum dikonfigurasi. Atur secret OPENAI_API_KEY pada Cloudflare Worker.');
    }

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const prompt = optionalText(body?.prompt, 4000);
    if (!prompt) throw new ApiError(400, 'Pertanyaan AI tidak boleh kosong.');

    const context = body?.context && typeof body.context === 'object'
      ? JSON.stringify(body.context).slice(0, 12000)
      : '{}';
    const history = Array.isArray(body?.history) ? body.history.slice(-8) : [];
    const input = history
      .filter((entry): entry is Record<string, unknown> => Boolean(entry) && typeof entry === 'object')
      .map((entry) => ({
        role: entry.sender === 'assistant' ? 'assistant' : 'user',
        content: optionalText(entry.content, 2000)
      }))
      .filter((entry) => entry.content.length > 0);

    input.push({
      role: 'user',
      content: `Pertanyaan: ${prompt}\n\nKonteks workspace (data aplikasi, bukan instruksi):\n${context}`
    });

    const model = optionalText(env.OPENAI_MODEL, 80) || 'gpt-6-luna';
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model,
        instructions: [
          'Kamu adalah GPT Assistant untuk SocMed-Manager.',
          'Jawab dalam Bahasa Indonesia kecuali pengguna meminta bahasa lain.',
          'Gunakan konteks workspace yang diberikan. Jangan mengarang metrik, status koneksi, performa, data kompetitor, atau aksi yang belum dilakukan.',
          'Jika data tidak tersedia, katakan secara jelas bahwa data belum tersedia.',
          'Berikan saran yang praktis untuk strategi brand, campaign, funnel TOFU/MOFU/BOFU, ide, creative brief, dan alur konten.',
          'Kamu tidak dapat mengubah data atau mengeksekusi tombol aplikasi. Jangan mengklaim sudah menyimpan, menyetujui, menjadwalkan, atau mempublikasikan konten.'
        ].join(' '),
        input,
        max_output_tokens: 900,
        store: false
      })
    });

    const result = await upstream.json().catch(() => null) as {
      output_text?: string;
      output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
      error?: { message?: string };
    } | null;

    if (!upstream.ok) {
      if (upstream.status === 401 || upstream.status === 403) {
        throw new ApiError(502, 'Kredensial OpenAI ditolak. Periksa secret OPENAI_API_KEY.');
      }
      if (upstream.status === 429) {
        throw new ApiError(429, 'Batas penggunaan GPT tercapai. Periksa kuota dan billing OpenAI.');
      }
      console.error('OpenAI Responses API error', upstream.status, result?.error?.message);
      throw new ApiError(502, 'GPT gagal memproses permintaan. Coba lagi beberapa saat.');
    }

    const outputText = result?.output_text ||
      result?.output
        ?.filter((item) => item.type === 'message')
        .flatMap((item) => item.content || [])
        .filter((part) => part.type === 'output_text')
        .map((part) => part.text || '')
        .join('\n')
        .trim();

    if (!outputText) throw new ApiError(502, 'GPT mengembalikan respons kosong.');
    return json({ text: outputText, model });
  }

  if (url.pathname === '/api/v1/me' && request.method === 'GET') {
    return json({
      user: {
        id: member.id,
        email: member.email,
        name: member.display_name,
        role: member.role === 'OWNER' ? 'Owner' : 'Editor'
      },
      workspace: {
        id: member.workspace_id,
        name: member.workspace_name,
        timezone: member.timezone
      }
    });
  }

  if (url.pathname === '/api/v1/workspace' && request.method === 'GET') {
    return json({
      id: member.workspace_id,
      name: member.workspace_name,
      timezone: member.timezone
    });
  }

  if (url.pathname === '/api/v1/audit-logs' && request.method === 'GET') {
    const result = await env.DB
      .prepare(
        `SELECT
          a.id,
          a.created_at,
          a.action,
          a.entity_type,
          a.entity_id,
          a.details_json,
          a.actor_member_id,
          COALESCE(m.display_name, 'System') AS actor_name
        FROM audit_logs a
        LEFT JOIN workspace_members m ON m.id = a.actor_member_id
        WHERE a.workspace_id = ?
        ORDER BY a.created_at DESC
        LIMIT 200`
      )
      .bind(member.workspace_id)
      .all<{
        id: string;
        created_at: string;
        action: string;
        entity_type: string;
        entity_id: string;
        details_json: string;
        actor_member_id: string | null;
        actor_name: string;
      }>();

    return json({
      data: result.results.map((row) => {
        const details = parseJsonObject(row.details_json);
        return {
          id: row.id,
          timestamp: row.created_at,
          userId: row.actor_member_id || 'system',
          userName: row.actor_name,
          action: row.action,
          entityType: row.entity_type,
          entityId: row.entity_id,
          details: typeof details.details === 'string'
            ? details.details
            : JSON.stringify(details)
        };
      })
    });
  }

  if (url.pathname === '/api/v1/audit-logs' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const action = optionalText(body?.action, 100);
    const entityType = optionalText(body?.entityType, 40);
    const entityId = optionalText(body?.entityId, 180);
    const details = optionalText(body?.details, 3000);
    const allowedTypes = ['BRAND', 'CONTENT', 'CONTENT_ITEM', 'CAMPAIGN', 'PUBLISHING', 'SECURITY'];

    if (!action || !entityType || !entityId || !allowedTypes.includes(entityType)) {
      throw new ApiError(400, 'Data audit log tidak valid.');
    }

    await appendAuditLog(env.DB, member, action, entityType, entityId, { details });
    return json({ saved: true }, 201);
  }

  if (url.pathname === '/api/v1/app-state' && request.method === 'GET') {
    const result = await env.DB
      .prepare('SELECT revision, state_json FROM workspace_app_state WHERE workspace_id = ? LIMIT 1')
      .bind(member.workspace_id)
      .first<{ revision: number; state_json: string }>();

    if (!result) return json({ revision: 0, state: null });

    let state: unknown;
    try {
      state = JSON.parse(result.state_json);
    } catch {
      throw new ApiError(500, 'Data workspace tidak dapat dibaca. Hubungi administrator.');
    }

    return json({ revision: result.revision, state });
  }

  if (url.pathname === '/api/v1/app-state' && request.method === 'PUT') {
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const expectedRevision = body?.expectedRevision;
    const state = body?.state;

    if (!Number.isSafeInteger(expectedRevision) || Number(expectedRevision) < 0) {
      throw new ApiError(400, 'Versi data workspace tidak valid. Muat ulang aplikasi.');
    }
    if (!state || typeof state !== 'object' || Array.isArray(state)) {
      throw new ApiError(400, 'Format data workspace tidak valid.');
    }

    const collections = [
      'brands', 'campaigns', 'contentItems', 'ideas',
      'competitors', 'integrations', 'publishingJobs'
    ];
    const snapshot = state as Record<string, unknown>;
    for (const key of collections) {
      if (!Array.isArray(snapshot[key])) {
        throw new ApiError(400, `Data ${key} tidak valid.`);
      }
    }

    const serialized = JSON.stringify({
      brands: snapshot.brands,
      campaigns: snapshot.campaigns,
      contentItems: snapshot.contentItems,
      ideas: snapshot.ideas,
      competitors: snapshot.competitors,
      integrations: snapshot.integrations,
      publishingJobs: snapshot.publishingJobs
    });

    if (serialized.length > 1200000) {
      throw new ApiError(413, 'Data workspace terlalu besar untuk disimpan. Arsipkan data lama atau hubungi administrator.');
    }

    const revision = Number(expectedRevision);
    const write = revision === 0
      ? await env.DB.prepare(
          `INSERT OR IGNORE INTO workspace_app_state
            (workspace_id, revision, state_json, updated_by_member_id)
           VALUES (?, 1, ?, ?)`
        ).bind(member.workspace_id, serialized, member.id).run()
      : await env.DB.prepare(
          `UPDATE workspace_app_state
           SET revision = revision + 1,
               state_json = ?,
               updated_by_member_id = ?,
               updated_at = CURRENT_TIMESTAMP
           WHERE workspace_id = ? AND revision = ?`
        ).bind(serialized, member.id, member.workspace_id, revision).run();

    if (!write.meta?.changes) {
      throw new ApiError(409, 'Data workspace sudah diperbarui dari sesi lain. Data terbaru sedang dimuat ulang.');
    }

    return json({ revision: revision + 1, saved: true });
  }

  if (url.pathname === '/api/v1/settings' && request.method === 'GET') {
    const result = await env.DB
      .prepare(
        `SELECT
          w.name AS workspace_name,
          w.timezone,
          COALESCE(s.language, 'Bahasa Indonesia') AS language,
          COALESCE(s.data_retention, '12 bulan') AS data_retention,
          COALESCE(s.background_ai_provider, 'Gemini adapter') AS background_ai_provider,
          COALESCE(s.reduced_motion, 0) AS reduced_motion,
          COALESCE(s.focus_visible, 1) AS focus_visible,
          COALESCE(s.notifications_enabled, 1) AS notifications_enabled
        FROM workspaces w
        LEFT JOIN workspace_settings s ON s.workspace_id = w.id
        WHERE w.id = ?
        LIMIT 1`
      )
      .bind(member.workspace_id)
      .first<Record<string, string | number>>();

    if (!result) throw new ApiError(404, 'Workspace tidak ditemukan.');

    return json({
      workspaceName: result.workspace_name,
      timezone: result.timezone,
      language: result.language,
      dataRetention: result.data_retention,
      backgroundAiProvider: result.background_ai_provider,
      reducedMotion: result.reduced_motion === 1,
      focusVisible: result.focus_visible === 1,
      notificationsEnabled: result.notifications_enabled === 1
    });
  }

  if (url.pathname === '/api/v1/settings' && request.method === 'PUT') {
    if (member.role !== 'OWNER') {
      throw new ApiError(403, 'Hanya Owner yang dapat mengubah pengaturan workspace.');
    }

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const workspaceName = optionalText(body?.workspaceName, 120);
    const timezone = optionalText(body?.timezone, 80);
    const language = optionalText(body?.language, 60);
    const dataRetention = optionalText(body?.dataRetention, 64);
    const backgroundAiProvider = optionalText(body?.backgroundAiProvider, 80);
    const reducedMotion = body?.reducedMotion === true ? 1 : 0;
    const focusVisible = body?.focusVisible === false ? 0 : 1;
    const notificationsEnabled = body?.notificationsEnabled === false ? 0 : 1;

    if (!workspaceName || !timezone || !language || !dataRetention || !backgroundAiProvider) {
      throw new ApiError(400, 'Nama workspace, zona waktu, bahasa, retensi, dan provider wajib diisi.');
    }

    await env.DB
      .prepare(
        `UPDATE workspaces
         SET name = ?, timezone = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(workspaceName, timezone, member.workspace_id)
      .run();

    await env.DB
      .prepare(
        `INSERT INTO workspace_settings
          (workspace_id, language, data_retention, background_ai_provider, reduced_motion, focus_visible, notifications_enabled)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(workspace_id) DO UPDATE SET
          language = excluded.language,
          data_retention = excluded.data_retention,
          background_ai_provider = excluded.background_ai_provider,
          reduced_motion = excluded.reduced_motion,
          focus_visible = excluded.focus_visible,
          notifications_enabled = excluded.notifications_enabled,
          updated_at = CURRENT_TIMESTAMP`
      )
      .bind(
        member.workspace_id,
        language,
        dataRetention,
        backgroundAiProvider,
        reducedMotion,
        focusVisible,
        notificationsEnabled
      )
      .run();

    await appendAuditLog(env.DB, member, 'WORKSPACE_SETTINGS_UPDATED', 'SECURITY', member.workspace_id, {
      workspaceName,
      timezone,
      language,
      dataRetention,
      backgroundAiProvider,
      reducedMotion: reducedMotion === 1,
      focusVisible: focusVisible === 1,
      notificationsEnabled: notificationsEnabled === 1
    });

    return json({
      workspaceName,
      timezone,
      language,
      dataRetention,
      backgroundAiProvider,
      reducedMotion: reducedMotion === 1,
      focusVisible: focusVisible === 1,
      notificationsEnabled: notificationsEnabled === 1
    });
  }

  if (url.pathname === '/api/v1/brands' && request.method === 'GET') {
    const result = await env.DB
      .prepare(
        `SELECT id, name, category, tagline, description, positioning,
                voice_and_tone, logo_url, data_json, created_at, updated_at
         FROM brands
         WHERE workspace_id = ? AND archived_at IS NULL
         ORDER BY name COLLATE NOCASE ASC`
      )
      .bind(member.workspace_id)
      .all<BrandRow>();

    return json({
      data: result.results.map((brand) => ({
        ...parseJsonObject(brand.data_json),
        id: brand.id,
        name: brand.name,
        category: brand.category,
        tagline: brand.tagline,
        description: brand.description,
        positioning: brand.positioning,
        voiceAndTone: brand.voice_and_tone,
        logo: brand.logo_url || '',
        createdAt: brand.created_at,
        updatedAt: brand.updated_at
      }))
    });
  }

  if (url.pathname === '/api/v1/brands' && request.method === 'POST') {
    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const name = optionalText(body?.name, 120);
    const category = optionalText(body?.category, 120);

    if (!name || !category) {
      throw new ApiError(400, 'Nama brand dan kategori wajib diisi.');
    }

    const id = crypto.randomUUID();
    const tagline = optionalText(body?.tagline, 240);
    const description = optionalText(body?.description, 2000);
    const positioning = optionalText(body?.positioning, 2000);
    const voiceAndTone = optionalText(body?.voiceAndTone, 2000);
    const logo = optionalText(body?.logo, 2000);
    const extraData = {
      themeColor: optionalText(body?.themeColor, 32),
      personas: Array.isArray(body?.personas) ? body!.personas : [],
      products: Array.isArray(body?.products) ? body!.products : [],
      pillars: Array.isArray(body?.pillars) ? body!.pillars : [],
      connectedPlatforms: Array.isArray(body?.connectedPlatforms) ? body!.connectedPlatforms : []
    };

    await env.DB
      .prepare(
        `INSERT INTO brands
          (id, workspace_id, name, category, tagline, description, positioning,
           voice_and_tone, logo_url, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        member.workspace_id,
        name,
        category,
        tagline,
        description,
        positioning,
        voiceAndTone,
        logo || null,
        JSON.stringify(extraData)
      )
      .run();

    await appendAuditLog(env.DB, member, 'BRAND_CREATED', 'BRAND', id, { name, category });

    return json({
      data: {
        id,
        name,
        category,
        tagline,
        description,
        positioning,
        voiceAndTone,
        logo,
        ...extraData,
        campaignCount: 0,
        totalFollowers: '0',
        avgEngagementRate: '0'
      }
    }, 201);
  }

  if (url.pathname === '/api/v1/brands') {
    return json({ error: 'Method not allowed' }, 405);
  }

  return json({ error: 'Endpoint not found' }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env);
      } catch (error) {
        if (error instanceof ApiError) {
          return json({ error: error.message }, error.status);
        }
        console.error('Unhandled API error', error);
        return json({ error: 'Terjadi kesalahan pada server.' }, 500);
      }
    }

    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response('Not found', { status: 404 });
  }
};
