# Cloudflare foundation setup

SocMed-Manager sekarang memakai satu Worker untuk API dan static assets, dengan D1 sebagai database. Frontend Vite tetap dipertahankan; migrasi framework tidak dilakukan di tahap ini.

## Local development

Requirements:
- Node.js 22 LTS/current
- npm
- Dependencies project terpasang

Run:

```bash
npm ci
npm run dev
```

Perintah `npm run dev` akan:
1. Membuat `.dev.vars` dari `.dev.vars.example` jika file lokal belum ada.
2. Menjalankan D1 migrations pada database lokal.
3. Mengisi dua akun lokal: `owner@local.test` dan `editor@local.test`.
4. Build frontend agar Worker dapat menemukan folder `dist`.
5. Menjalankan Vite di port 3000 dan Worker di port 8787.

Buka `http://localhost:3000`.

Vite meneruskan request `/api/*` ke Worker. Identity bypass hanya tersedia saat `APP_ENV=development` dan `LOCAL_DEV_AUTH=true`; jangan pernah mengaktifkan flag ini pada deployment.

Endpoint untuk pengecekan:
- `GET /api/health`
- `GET /api/v1/me`
- `GET /api/v1/workspace`
- `GET /api/v1/brands`

Untuk menguji sebagai editor, ubah `LOCAL_DEV_EMAIL=editor@local.test` di file `.dev.vars`, lalu restart Worker.

## Buat database Cloudflare D1

Buat database:

```bash
npx wrangler d1 create socmed-manager-db
```

Perintah tersebut mengembalikan `database_id`. Ganti nilai placeholder `database_id` pada `wrangler.jsonc` dengan ID tersebut.

Jalankan schema ke database remote:

```bash
npm run db:migrate:remote
```

Siapkan dua akun workspace remote:

1. Salin `scripts/bootstrap-workspace.sql.example` menjadi file SQL baru.
2. Ganti kedua alamat email contoh dengan email yang akan dipakai oleh dua anggota workspace.
3. Jalankan file SQL tersebut:

```bash
npx wrangler d1 execute socmed-manager-db --remote --file=./scripts/bootstrap-workspace.sql
```

Jangan commit file bootstrap yang berisi email pribadi ke repository publik.

## Cloudflare Access

Buat aplikasi **Self-hosted** di Cloudflare Zero Trust > Access > Applications.

- Terapkan policy Allow yang hanya mengizinkan dua alamat email workspace.
- Gunakan domain yang sama dengan Worker yang di-deploy.
- Copy Team domain dan Application Audience (AUD) dari konfigurasi Access.

Simpan konfigurasi pada Worker:

```bash
npx wrangler secret put ACCESS_TEAM_DOMAIN
npx wrangler secret put ACCESS_AUD
```

Masukkan Team domain dalam bentuk `https://<team-name>.cloudflareaccess.com` dan AUD dari aplikasi Access. Worker memverifikasi signature RS256, issuer, audience, masa berlaku token, lalu memeriksa email terhadap `workspace_members` di D1. Header JWT saja tidak dipercaya tanpa verifikasi signature.

Pastikan Access application dan policy sudah aktif sebelum membuka endpoint API remote.

## Deploy

Setelah database ID, schema, workspace members, dan Access siap:

```bash
npm run deploy
```

Worker akan men-deploy API dan isi folder `dist` dalam satu deployment.

## API yang tersedia pada fondasi awal

| Method | Endpoint | Kegunaan |
|---|---|---|
| GET | `/api/health` | Memastikan Worker dan D1 merespons |
| GET | `/api/v1/me` | Identitas dan role anggota yang login |
| GET | `/api/v1/workspace` | Workspace aktif |
| GET | `/api/v1/brands` | Membaca brand dalam workspace |
| POST | `/api/v1/brands` | Membuat brand dan audit log |

Semua endpoint `/api/v1/*` membutuhkan identitas yang lolos Cloudflare Access dan anggota workspace aktif. Data selalu dibatasi dengan `workspace_id`.

## Batas implementasi saat ini

- API dan schema D1 sudah disiapkan, tetapi halaman frontend masih menggunakan AppContext/mock data. Integrasi halaman ke endpoint akan dilakukan bertahap.
- OAuth media sosial, penyimpanan token terenkripsi, publishing jobs, dan background queues belum aktif.
- Placeholder D1 ID harus diganti sebelum remote migrations/deploy.
- `package-lock.json` sudah di-commit. Gunakan `npm ci` agar versi dependency lokal sama dengan CI.
