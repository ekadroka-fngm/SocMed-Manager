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
