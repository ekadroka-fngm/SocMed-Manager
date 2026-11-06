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

Vite meneruskan request `/api/*` ke Worker. Identity bypass hanya tersedia saat `APP_ENV=development` dan `LOCAL_DEV_AUTH=true`; jangan pernah mengaktifkan flag ini pada deployment. Data workspace pertama kali mengisi D1 dari starter dataset, lalu setiap perubahan disimpan sebagai snapshot berversi. Audit log disimpan terpisah agar tidak dapat diedit sebagai bagian snapshot.

Endpoint untuk pengecekan:
- `GET /api/health`
- `GET /api/v1/me`
- `GET /api/v1/workspace`
- `GET /api/v1/brands`
- `GET /api/v1/app-state` dan `PUT /api/v1/app-state`
- `GET /api/v1/audit-logs` dan `POST /api/v1/audit-logs`
- `GET /api/v1/settings` dan `PUT /api/v1/settings`
- `POST /api/v1/assistant`

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

## GPT Assistant

Tambahkan API key sebagai Worker secret. Jangan menaruh key di frontend, file `.env` yang di-commit, maupun `wrangler.jsonc`:

```bash
npx wrangler secret put OPENAI_API_KEY
```

Opsional: atur variable Worker `OPENAI_MODEL` untuk memilih model GPT. Default saat ini `gpt-6-luna`; key dan seluruh request ke OpenAI diproses melalui Worker.

## Deploy

Setelah database ID, schema, workspace members, dan Access siap:

```bash
npm run deploy
```

Worker akan men-deploy API dan isi folder `dist` dalam satu deployment.

## API yang tersedia

| Method | Endpoint | Kegunaan |
|---|---|---|
| GET | `/api/health` | Memastikan Worker dan D1 merespons |
| GET | `/api/v1/me` | Identitas dan role anggota yang login |
| GET | `/api/v1/workspace` | Workspace aktif |
| GET | `/api/v1/brands` | Membaca brand dalam workspace |
| POST | `/api/v1/brands` | Membuat brand dan audit log |
| GET/PUT | `/api/v1/app-state` | Membaca dan menyimpan snapshot data workspace dengan revision check |
| GET/POST | `/api/v1/audit-logs` | Membaca dan menambah audit event di server |
| GET/PUT | `/api/v1/settings` | Membaca dan menyimpan preferensi workspace |
| POST | `/api/v1/assistant` | Mengirim prompt ke GPT melalui OpenAI Responses API |

Semua endpoint `/api/v1/*` membutuhkan identitas yang lolos Cloudflare Access dan anggota workspace aktif. Data selalu dibatasi dengan `workspace_id`.

## Batas implementasi saat ini

- Data workspace utama dan audit log sudah tersimpan di D1. Snapshot workspace menggunakan satu record JSON berversi, bukan tabel CRUD terpisah per entitas; konflik revisi memuat ulang data server.
- OAuth media sosial, penyimpanan token terenkripsi, background publishing worker, dan antrean publikasi terjadwal belum aktif. Status QUEUED hanya berarti job tersimpan di D1.
- Analytics platform dan automatic competitor monitoring belum aktif.
- Upload logo permanen ke Cloudflare R2 belum aktif.
- Placeholder D1 ID harus diganti sebelum remote migrations/deploy.
- `package-lock.json` sudah di-commit. Gunakan `npm ci` agar versi dependency lokal sama dengan CI.
