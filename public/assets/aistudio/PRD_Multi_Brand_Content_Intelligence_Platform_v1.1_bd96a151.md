# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Multi-Brand Content Intelligence Platform

### Private Creative Intelligence & Campaign Management Workspace

**Versi:** 1.1\
**Status:** Baseline spesifikasi produk\
**Platform:** Responsive Web Application\
**Deployment:** Cloudflare Ecosystem\
**Pengguna:** Tepat dua pengguna terotorisasi\
**Dokumen terkait:** UI/UX Specification v1.0, Technical Blueprint v1.1

------------------------------------------------------------------------

# 1. Ringkasan Produk

## 1.1 Visi Produk

Membangun platform web terintegrasi yang membantu pemilik bisnis
mengelola banyak brand melalui satu workspace. Platform mencakup riset,
analisis, strategi campaign, pengembangan ide, produksi konten,
kalender, publishing, dan evaluasi performa.

Produk ini bukan sekadar content planner atau scheduler. Platform
berfungsi sebagai **Multi-Brand Content Intelligence Platform** yang
menghubungkan data, insight, strategi, kreativitas, eksekusi, dan
pembelajaran dalam satu siklus.

## 1.2 Prinsip Inti

**DATA → INSIGHT → STRATEGY → CREATIVITY → EXECUTION → ANALYSIS →
INNOVATION**

Setiap modul harus saling terhubung dan menggunakan konteks brand,
campaign, konten, serta data yang relevan.

## 1.3 Tujuan Produk

1.  Mengelola beberapa brand dari satu workspace.
2.  Memahami performa konten milik sendiri.
3.  Melakukan riset kompetitor berdasarkan informasi publik dan data
    manual.
4.  Mengidentifikasi content gap dan peluang.
5.  Mengembangkan ide serta pendekatan kreatif.
6.  Menyusun strategi campaign dan distribusi funnel.
7.  Menghasilkan brief, script, caption, CTA, dan visual direction.
8.  Mengelola kalender dan jadwal konten.
9.  Menghubungkan akun media sosial.
10. Menjalankan publishing otomatis setelah approval.
11. Mengukur hasil dan menghasilkan rekomendasi optimasi.

## 1.4 Target Pengguna

Platform digunakan oleh tepat dua orang yang telah diotorisasi dalam
satu private workspace. Sistem bukan SaaS publik dan tidak memerlukan
billing, public registration, invitation system, atau multi-tenant
onboarding untuk pelanggan eksternal.

------------------------------------------------------------------------

# 2. Ruang Lingkup Produk

## 2.1 Modul Utama

  -----------------------------------------------------------------------
  Modul                               Fungsi
  ----------------------------------- -----------------------------------
  Overview                            Ringkasan kondisi workspace dan
                                      brand

  Brand Management                    Mengelola identitas, audience,
                                      produk, dan aset brand

  Intelligence                        Analisis konten, insight, content
                                      gap, dan peluang

  Competitor Intelligence             Riset kompetitor berbasis data
                                      publik/manual

  Idea Lab                            Pengembangan ide dan creative angle

  Campaign Management                 Strategi campaign, objective,
                                      funnel, dan timeline

  Creative Studio                     Produksi brief, script, caption,
                                      CTA, dan materi kreatif

  Content Calendar                    Perencanaan dan penjadwalan konten

  Analytics                           Analisis performa brand, konten,
                                      platform, dan campaign

  Publishing                          Approval, scheduling, publishing,
                                      dan logs

  Integrations                        Koneksi platform media sosial dan
                                      layanan eksternal

  Settings                            Konfigurasi workspace, pengguna,
                                      AI, keamanan, dan tampilan
  -----------------------------------------------------------------------

## 2.2 Platform Media Sosial

Integrasi yang direncanakan:

-   Facebook
-   Instagram
-   TikTok
-   YouTube
-   Pinterest

Dukungan format, analytics, publishing, permission, dan kuota mengikuti
kemampuan API resmi masing-masing platform. Aplikasi tidak boleh
menjanjikan kemampuan yang tidak tersedia melalui API.

## 2.3 Di Luar Ruang Lingkup

-   Native Android/iOS application.
-   Public SaaS signup.
-   Subscription dan billing untuk pelanggan eksternal.
-   Autonomous publishing tanpa approval pengguna.
-   Pengambilan data privat kompetitor.
-   Klaim metrik kompetitor yang tidak didukung sumber publik.
-   Microservices sebagai arsitektur awal.

------------------------------------------------------------------------

# 3. Pengguna, Workspace, dan Hak Akses

## 3.1 Workspace

-   Satu private workspace.
-   Mendukung banyak brand.
-   Memiliki tepat dua pengguna terotorisasi.
-   Data seluruh modul dimiliki atau terhubung dengan workspace.
-   Tidak ada public registration.

## 3.2 Authentication

Baseline autentikasi menggunakan Cloudflare Access dengan email
allowlist untuk dua pengguna.

Alur umum:

1.  Pengguna membuka aplikasi.
2.  Cloudflare Access memverifikasi identitas.
3.  Email atau identitas diverifikasi melalui Access JWT.
4.  Backend Worker memvalidasi JWT.
5.  Backend memeriksa keanggotaan dan status pengguna di D1.
6.  Pengguna yang sah masuk ke workspace.

Cloudflare Access menjadi gerbang autentikasi. Aplikasi tetap melakukan
authorization internal pada setiap request yang mengakses data.

## 3.3 Authorization

-   Semua endpoint privat wajib memeriksa identitas.
-   Semua operasi data wajib memeriksa workspace membership.
-   Jangan mempercayai header identitas yang tidak diverifikasi.
-   Aksi penting harus dicatat dalam audit log.
-   Pengguna yang tidak terdaftar atau dinonaktifkan tidak boleh
    mengakses data.

------------------------------------------------------------------------

# 4. Functional Requirements

## 4.1 Overview Dashboard

### Tujuan

Memberikan gambaran cepat mengenai kondisi seluruh workspace dan brand.

### Fitur

-   Ringkasan performa seluruh brand.
-   Filter brand dan periode.
-   Active campaigns.
-   Upcoming content.
-   Pending approvals.
-   Publishing activity.
-   Ringkasan analytics.
-   AI insights dan rekomendasi.
-   Navigasi cepat ke modul terkait.

### KPI yang dapat ditampilkan

-   Published content.
-   Reach.
-   Impressions.
-   Views.
-   Engagement.
-   Follower growth.
-   Active campaigns.

Metrik hanya ditampilkan jika sumber data tersedia. Data yang tidak
tersedia tidak boleh ditampilkan sebagai nol tanpa penjelasan.

### Acceptance Criteria

-   Pengguna dapat memfilter berdasarkan brand dan periode.
-   Data mengikuti filter aktif.
-   Pengguna dapat membuka detail dari setiap ringkasan.
-   Loading, empty, dan error states tersedia.
-   Periode dan sumber data terlihat.

## 4.2 Brand Management

### Informasi Brand

-   Nama dan deskripsi.
-   Logo.
-   Brand positioning.
-   Brand voice dan tone.
-   Target audience.
-   Customer persona.
-   Produk atau layanan.
-   Unique selling proposition.
-   Content pillars.
-   Brand assets.
-   Social accounts.
-   Competitor references.

### Fitur

-   Membuat brand.
-   Mengedit brand.
-   Mengarsipkan brand.
-   Berpindah brand.
-   Mengelola identitas dan aset.
-   Mengelola audience/persona.
-   Mengelola produk dan layanan.
-   Mengelola content pillars.
-   Menghubungkan akun media sosial.

### Acceptance Criteria

-   Pengguna dapat membuat, mengubah, dan mengarsipkan brand.
-   Campaign dan konten dapat dihubungkan dengan brand.
-   Perpindahan brand memperbarui konteks halaman dan AI Assistant.
-   Perubahan konteks tidak boleh menghapus data yang sedang diedit
    tanpa konfirmasi.

## 4.3 Intelligence Engine

### Tujuan

Mengubah data menjadi insight dan peluang strategis.

### Sumber Data

-   Data akun media sosial milik sendiri yang terhubung.
-   Data konten internal.
-   Data kompetitor yang dimasukkan secara manual.
-   Informasi publik yang dikumpulkan secara sah.
-   Referensi yang diberikan pengguna.

### Fitur

-   Analisis performa konten.
-   Analisis performa berdasarkan format.
-   Analisis performa berdasarkan platform.
-   Analisis content pillar.
-   Identifikasi konten terbaik dan terlemah.
-   Analisis tren historis.
-   Content gap analysis.
-   Opportunity discovery.
-   Rekomendasi topik dan creative angle.

### Acceptance Criteria

-   Setiap analisis menampilkan periode dan sumber data.
-   Rekomendasi memiliki alasan yang dapat ditelusuri.
-   Data yang tidak tersedia tidak boleh direkayasa.
-   Perbedaan metrik antarplatform harus dijelaskan bila definisinya
    berbeda.

## 4.4 Competitor Intelligence

### Tujuan

Membantu pengguna memahami strategi konten kompetitor dari data publik
dan observasi manual.

### Fitur

-   Menambahkan kompetitor secara manual.
-   Memasukkan URL profil atau konten publik.
-   Menambahkan informasi dan observasi manual.
-   Menyimpan snapshot riset.
-   Mengelompokkan kompetitor.
-   Menganalisis tema dan pola konten publik.
-   Mengidentifikasi peluang diferensiasi.
-   Membandingkan strategi konten.

### Data Kompetitor

-   Nama.
-   URL.
-   Platform.
-   Kategori.
-   Deskripsi.
-   Catatan manual.
-   Referensi konten.
-   Tanggal riset terakhir.
-   Riwayat snapshot.

### Batasan

-   Tidak mengakses insight privat kompetitor.
-   Tidak mengklaim mengetahui reach, retention, atau conversion privat.
-   Metrik hanya boleh ditampilkan jika tersedia dari sumber publik yang
    valid.
-   Setiap snapshot mencatat sumber dan waktu pengambilan data.

## 4.5 Idea Lab

### Tujuan

Menjadi pusat ideasi dan pengembangan konsep konten.

### Fitur

-   Generate ide berdasarkan brand.
-   Generate ide berdasarkan content pillar.
-   Generate ide berdasarkan audience.
-   Generate ide berdasarkan masalah konsumen.
-   Generate ide berdasarkan tren atau referensi.
-   Generate ide berdasarkan content gap.
-   Mengembangkan beberapa creative angle.
-   Menyimpan dan mengelompokkan ide.
-   Mengubah ide menjadi content item atau campaign content.

### Input Ide

-   Topic.
-   Target audience.
-   Audience problem.
-   Objective.
-   Funnel stage.
-   Content pillar.
-   Format.
-   Tone.
-   Reference.

### Data Ide

-   Title.
-   Description.
-   Audience.
-   Objective.
-   Funnel stage.
-   Content pillar.
-   Creative angle.
-   Format.
-   Reference.
-   Status.

### Acceptance Criteria

-   Ide dapat disimpan, diedit, diduplikasi, dan diarsipkan.
-   Ide dapat dihubungkan ke campaign.
-   Ide dapat dikonversi menjadi konten.
-   Hasil AI dapat diedit pengguna.

## 4.6 Campaign Management

### Tujuan

Mengelola strategi campaign dari perencanaan sampai evaluasi.

### Fitur

-   Membuat campaign.
-   Menentukan objective.
-   Menentukan target audience.
-   Menentukan periode.
-   Menentukan produk atau layanan.
-   Menentukan key message.
-   Menentukan content pillars.
-   Menentukan funnel distribution.
-   Menghubungkan ide dan konten.
-   Memantau progres.
-   Melihat performa campaign.

### Funnel

  -----------------------------------------------------------------------
  Stage                   Tujuan                  Contoh pendekatan
  ----------------------- ----------------------- -----------------------
  TOFU                    Awareness               Edukasi, hiburan,
                                                  masalah relatable

  MOFU                    Consideration           Penjelasan mendalam,
                                                  perbandingan, solusi,
                                                  studi kasus

  BOFU                    Conversion              Demo produk, testimoni,
                                                  penawaran, CTA
  -----------------------------------------------------------------------

Komposisi funnel dapat disesuaikan pada setiap campaign. Tidak ada
persentase distribusi yang dikunci secara global.

### Acceptance Criteria

-   Campaign dapat dibuat dan diedit.
-   Campaign memiliki brand dan periode.
-   Konten dapat dihubungkan dengan campaign.
-   Distribusi funnel dapat diubah.
-   Progres campaign dihitung berdasarkan status konten.
-   Campaign dapat dianalisis setelah data performa tersedia.

## 4.7 Creative Studio

### Tujuan

Menjadi ruang produksi materi kreatif dari ide sampai siap direview.

### Fitur

-   Creative brief generator.
-   Hook generator.
-   Script generator.
-   Caption generator.
-   CTA generator.
-   Storytelling development.
-   Visual direction.
-   Content adaptation per platform.
-   Version management.
-   Preview berdasarkan format.

### Struktur Creative Brief

1.  Content title.
2.  Objective.
3.  Target audience.
4.  Funnel stage.
5.  Content pillar.
6.  Format.
7.  Main message.
8.  Creative angle.
9.  Hook.
10. Script atau copy.
11. Visual direction.
12. CTA.
13. Caption.
14. Hashtags.
15. References.

### Contoh Alur Video

Hook → Problem → Agitation → Solution → CTA.

### Platform Preview

-   Instagram Reel.
-   Instagram Carousel.
-   Instagram Story.
-   TikTok Video.
-   YouTube Video.
-   YouTube Shorts.
-   Pinterest Pin.
-   Facebook Post.

Preview merupakan representasi desain dan tidak menjamin dukungan
publishing pada setiap platform.

### Version Management

-   Save version.
-   Compare versions.
-   Restore version.
-   Track edits.

### Acceptance Criteria

-   Semua materi dapat diedit.
-   Hasil AI tidak otomatis dianggap final.
-   Perubahan tersimpan sebagai versi.
-   Konten yang berubah setelah approval harus kembali melalui approval.

## 4.8 Content Calendar

### Views

-   Monthly.
-   Weekly.
-   List.
-   Timeline.

### Filters

-   Brand.
-   Campaign.
-   Platform.
-   Funnel.
-   Status.
-   Content format.

### Fitur

-   Menampilkan jadwal konten.
-   Drag and drop.
-   Reschedule.
-   Membuka content detail.
-   Duplicate.
-   Cancel schedule.
-   Melihat approval dan publishing status.

### Content Status

-   IDEA
-   BRIEF
-   IN_PRODUCTION
-   IN_REVIEW
-   CHANGES_REQUESTED
-   APPROVED
-   SCHEDULED
-   QUEUED
-   PUBLISHING
-   PUBLISHED
-   FAILED
-   CANCELLED
-   ARCHIVED

Status operasional dapat dipisahkan dari status produksi agar alur tidak
ambigu. Konten yang belum approved tidak boleh masuk antrean publishing
aktif.

## 4.9 Analytics

### Fitur

-   Performance overview.
-   Reach dan impressions jika tersedia.
-   Views.
-   Engagement.
-   Follower growth.
-   Content performance.
-   Platform comparison.
-   Campaign performance.
-   Funnel performance.
-   Historical comparison.
-   AI recommendations.

### Filters

-   Date range.
-   Brand.
-   Platform.
-   Campaign.
-   Content format.

### Acceptance Criteria

-   Metrik menampilkan sumber dan periode.
-   Data yang tidak tersedia diberi keterangan.
-   Perbedaan definisi metrik platform tidak boleh disamakan tanpa
    normalisasi yang jelas.
-   Pengguna dapat membuka detail konten atau campaign dari grafik dan
    tabel.

## 4.10 Publishing

### Fitur

-   Menghubungkan akun media sosial.
-   Memilih platform.
-   Menentukan format.
-   Menentukan waktu publikasi.
-   Review konten.
-   Approval workflow.
-   Scheduling.
-   Automatic publishing setelah approval.
-   Publishing logs.
-   Retry.
-   Cancel schedule.
-   Error notifications.

### Approval Rules

1.  Setiap konten wajib memperoleh approval eksplisit.
2.  Approval menyimpan approver dan timestamp.
3.  Setelah approval, job publikasi dapat dibuat.
4.  Jika waktu publikasi belum tiba, job menunggu jadwal.
5.  Pada waktu yang ditentukan, sistem menjalankan publishing otomatis.
6.  Konten yang diedit setelah approval harus disetujui ulang.
7.  Worker memeriksa status approval terbaru sebelum mengirim.
8.  Job memiliki idempotency key.
9.  Retry harus mencegah duplikasi publikasi.
10. Kegagalan permanen dicatat dan diberitahukan kepada pengguna.
11. Pembatalan harus mencegah job yang belum dieksekusi.
12. Jika platform tidak mendukung idempotency, sistem harus memeriksa
    hasil request sebelumnya sebelum mengulang.

### Status Publishing

-   APPROVED
-   SCHEDULED
-   QUEUED
-   PUBLISHING
-   PUBLISHED
-   FAILED
-   CANCELLED

### Batasan

Publishing mengikuti izin, kuota, jenis akun, format, dan kemampuan API
resmi masing-masing platform.

## 4.11 Integrations

### Platform

-   Facebook.
-   Instagram.
-   TikTok.
-   YouTube.
-   Pinterest.

### Fitur

-   Connect.
-   Disconnect.
-   Reauthorize.
-   Sync now.
-   Account information.
-   Token refresh.
-   Publishing capability.
-   Analytics capability.
-   Integration status.

### Capability Matrix

Setiap akun/platform perlu menyimpan kemampuan aktual: - Publish
supported. - Analytics supported. - Supported media formats. - Required
permissions. - Token refresh support. - API restrictions. - Quota
information bila tersedia.

## 4.12 Settings

Sections: - Workspace. - Users and Access. - AI Providers. - Social
Integrations. - Notifications. - Appearance. - Security. - Audit Logs.

------------------------------------------------------------------------

# 5. AI Requirements

## 5.1 AI Assistant

AI Assistant wajib menggunakan GPT.

### Kemampuan

-   Memahami halaman aktif.
-   Mengenali brand aktif.
-   Mengenali campaign atau konten yang dipilih.
-   Mengakses data workspace yang relevan dan diizinkan.
-   Memberikan rekomendasi.
-   Membantu analisis dan pengembangan strategi.
-   Mendukung permintaan lintas brand bila diminta pengguna.

### Context Payload

-   User ID.
-   Workspace ID.
-   Current page.
-   Active brand.
-   Selected campaign.
-   Selected content.
-   Relevant D1 records.
-   Conversation history yang diperlukan.

### Business Rules

-   Semua request GPT melalui backend.
-   API key tidak boleh berada di frontend.
-   Konteks dibatasi berdasarkan hak akses dan relevansi.
-   Assistant tidak boleh menganggap output AI sebagai approval.
-   Percakapan dapat disimpan berdasarkan pengguna dan workspace.
-   Pengguna dapat memulai percakapan baru atau melanjutkan percakapan
    sebelumnya.

## 5.2 Background AI Generation

Background generation boleh menggunakan provider selain GPT.

Contoh: - Idea generation. - Script generation. - Caption generation. -
Creative direction. - Research analysis. - Classification.

### Provider Abstraction

Gunakan adapter agar provider dapat diganti tanpa mengubah modul utama.

### Job Lifecycle

-   REQUESTED
-   QUEUED
-   PROCESSING
-   COMPLETED
-   FAILED
-   CANCELLED

### Persyaratan

-   Provider API keys disimpan di Worker Secrets.
-   Output divalidasi sebelum disimpan.
-   Job memiliki status dan error log.
-   Kegagalan provider tidak boleh menghilangkan request.
-   Pengguna dapat retry atau mengedit hasil.
-   Output selalu terkait dengan workspace dan brand yang benar.

------------------------------------------------------------------------

# 6. UI/UX Requirements

## 6.1 Design Vision

Karakter visual: - Swiss-inspired editorial design. - Modern
productivity SaaS. - Minimalist dashboard. - Data-driven creative
workspace. - Subtle futuristic interaction.

Prinsip: 1. Clarity First. 2. Functional Minimalism. 3. Visual
Hierarchy. 4. Contextual Interaction. 5. Consistency. 6. Progressive
Disclosure. 7. Responsive by Design.

## 6.2 Design System

### Light Palette

  Token     Hex       Penggunaan
  --------- --------- ----------------
  Canvas    #F7F7F4   Background
  Surface   #FFFFFF   Card dan panel
  Ink       #17191F   Teks utama
  Muted     #68717E   Teks sekunder
  Primary   #5268D8   Aksi utama
  Success   #21A68A   Status sukses
  Warning   #E4A44A   Peringatan
  Danger    #DC6470   Error
  Border    #E7E9ED   Pembatas

### Dark Palette

  Token      Hex       Penggunaan
  ---------- --------- --------------------
  Canvas     #111318   Background
  Surface    #1B1E25   Panel
  Elevated   #292E38   Dropdown dan modal
  Ink        #E9EBF0   Teks utama
  Muted      #9BA3B2   Teks sekunder
  Primary    #8292F0   Aksi utama

### Typography

Maksimal tiga font: - Manrope: heading. - Inter: body dan UI. -
JetBrains Mono: angka, metadata, dan kode.

### Spacing

Gunakan 8-point spacing system: - 4 px micro. - 8 px compact. - 16 px
standard. - 24 px component. - 32 px section. - 48 px major section.

### Radius

-   Controls: 6--8 px.
-   Buttons: 8 px.
-   Cards: 12 px.
-   Dialogs: 16 px.
-   Floating surfaces: 16--20 px.

### Iconography

Gunakan satu keluarga ikon konsisten, misalnya Lucide.

## 6.3 Global Layout

### Desktop

-   Sidebar kiri fixed.
-   Expanded width: 240 px.
-   Collapsed width: 72 px.
-   Main content flexible.
-   Maximum content width: 1440 px.
-   Page padding: 32 px.
-   Section spacing: 24--32 px.

### Sidebar Navigation

Main: 1. Overview 2. Brands 3. Intelligence 4. Campaigns 5. Idea Lab 6.
Creative Studio 7. Content Calendar 8. Analytics

Management: 9. Publishing 10. Competitors 11. Integrations 12. Settings

Sidebar memiliki: - Product logo. - Workspace/brand selector. -
Navigation groups. - User profile. - Account settings. - Theme switcher.

### Brand Context

Brand selector bersifat global. Pergantian brand memperbarui modul
brand-specific dan konteks AI. Dashboard global tetap dapat menampilkan
seluruh brand.

## 6.4 Gooey Quick Access

Floating button di kanan bawah.

Actions: 1. AI Assistant. 2. New Idea. 3. New Campaign. 4. New Content.
5. Schedule. 6. Navigation.

Behavior: - Click to open. - Gooey morphing transition. - Items muncul
bertahap. - Click outside to close. - Escape to close. - Keyboard dan
touch accessible. - Tidak menutupi CTA penting. - Reduced-motion
fallback.

## 6.5 Floating AI Assistant

Panel mengambang yang dapat dibuka dari Quick Access.

### Panel

-   Header dengan assistant identity dan context indicator.
-   Conversation area.
-   Contextual suggestions.
-   Message input.
-   Send action.
-   Close action.

### Context

-   Current page.
-   Active brand.
-   Selected campaign.
-   Selected content.
-   Relevant workspace data.

Panel dapat dibuka di seluruh halaman tanpa kehilangan konteks
percakapan.

## 6.6 Responsive Design

### Desktop: 1280 px ke atas

-   Sidebar expanded.
-   Multi-column dashboard.
-   Full calendar.
-   Full Creative Studio workspace.

### Tablet: 768--1279 px

-   Sidebar dapat collapsed.
-   Grid dikurangi.
-   Panel sekunder dapat menjadi drawer.
-   Tabel dapat berubah menjadi list atau overflow terbatas.

### Mobile Web: di bawah 768 px

-   Sidebar menjadi navigation drawer.
-   Konten satu kolom.
-   Filter menggunakan bottom sheet.
-   Tabel menjadi compact list.
-   Editor menggunakan panel bergantian.
-   Floating elements mempertimbangkan safe area.
-   Tidak ada native React Native application.

## 6.7 Motion Design

  Interaction                  Durasi
  --------------------- -------------
  Hover                   120--180 ms
  Button feedback         120--160 ms
  Dropdown                180--240 ms
  Modal                   180--240 ms
  Page transition         220--300 ms
  Complex interaction     300--400 ms

Motion harus memberikan feedback, tidak menghambat tugas, dan
menghormati `prefers-reduced-motion`.

## 6.8 Global UI States

Setiap modul memiliki: - Loading. - Empty. - Error. - Success. -
Disabled. - Permission denied. - Connection error bila relevan.

Form harus memiliki label, validasi, dan error messaging yang jelas.

## 6.9 Accessibility

-   Keyboard navigation.
-   Visible focus states.
-   Semantic HTML.
-   Accessible labels.
-   Accessible dialogs.
-   Screen-reader-friendly controls.
-   WCAG AA contrast target.
-   Reduced motion support.
-   Touch target yang nyaman.

------------------------------------------------------------------------

# 7. Technical Architecture

## 7.1 Architecture Principle

Gunakan **modular monolith** dengan managed Cloudflare services. Hindari
microservices pada tahap awal.

## 7.2 Technology Baseline

  Layer                    Teknologi
  ------------------------ --------------------------
  Frontend                 React + TypeScript
  Framework                Next.js
  Styling                  Tailwind CSS
  UI components            shadcn/ui
  Animation                Motion for React
  Compute                  Cloudflare Workers
  Authentication gateway   Cloudflare Access
  Database                 Cloudflare D1
  Object storage           Cloudflare R2
  Background jobs          Cloudflare Queues
  Long-running workflows   Cloudflare Workflows
  Scheduling               Cron Triggers
  Secrets                  Worker Secrets
  Monitoring               Cloudflare Observability

## 7.3 Database

Cloudflare D1 menjadi database utama. D1 berbasis SQLite, sehingga
skema, query, tipe data, dan migration harus kompatibel dengan SQLite.

Ketentuan: - ID stabil, misalnya UUID disimpan sebagai TEXT. - Timestamp
menggunakan format ISO 8601. - Boolean disimpan sebagai INTEGER. - JSON
TEXT hanya untuk data fleksibel. - Foreign keys diaktifkan. - Indeks
dibuat untuk query yang sering digunakan. - Gunakan pagination. -
Gunakan migration versioning. - Uji backup dan pemulihan. - Pantau
ukuran dan performa database.

Data analitik harus dirancang dengan agregasi yang sesuai. File media
tidak disimpan di D1.

## 7.4 Object Storage

Cloudflare R2 menyimpan: - Gambar. - Video. - Dokumen. - Creative
assets. - Export. - Attachment.

Bucket privat menjadi default. Akses file dilakukan melalui Worker atau
URL bertanda tangan dengan masa berlaku terbatas.

## 7.5 Background Processing

Cloudflare Queues digunakan untuk: - Publishing jobs. - Analytics
synchronization. - AI generation. - Media processing. - Notification
jobs.

Cloudflare Workflows digunakan untuk proses multi-tahap yang membutuhkan
state, retry, dan kelanjutan setelah kegagalan.

Cron Triggers digunakan untuk: - Memeriksa jadwal. - Memicu sinkronisasi
berkala. - Menjalankan housekeeping. - Memeriksa job yang tertunda.

Jangan mengandalkan browser pengguna tetap terbuka untuk menjalankan
pekerjaan terjadwal.

## 7.6 Frontend Deployment Proof of Concept

Dua pendekatan wajib dievaluasi:

### Candidate A: Next.js + OpenNext

-   Next.js App Router.
-   OpenNext Cloudflare adapter.
-   Cloudflare Workers.
-   D1, R2, dan Queues bindings.

### Candidate B: Next.js + Vinext

-   Next.js-compatible application.
-   Vinext + Vite.
-   Cloudflare Workers.
-   D1, R2, dan Queues bindings.

### PoC Tests

-   Authentication melalui Access.
-   D1 CRUD.
-   R2 upload dan download.
-   Server-side rendering.
-   Route handlers dan API.
-   Streaming UI jika diperlukan.
-   GPT integration.
-   Background queues.
-   Responsive UI.
-   Motion dan Gooey Quick Access.
-   Build, preview, dan production deployment.

### Evaluation Weight

  Kriteria                   Bobot
  ------------------------ -------
  Kompatibilitas Next.js       25%
  Stabilitas deployment        20%
  Integrasi Cloudflare         20%
  Developer experience         15%
  Performance                  10%
  Maintenance                  10%

Pilih solusi dengan skor tertinggi yang memenuhi kebutuhan kritis. Jika
Vinext memiliki gap fitur penting, OpenNext menjadi fallback produksi.

------------------------------------------------------------------------

# 8. Database Domain Model

## 8.1 Entitas Utama

  Domain       Tabel
  ------------ ------------------------------------------------------------
  Workspace    workspaces, users, workspace_members
  Brand        brands, brand_identity, brand_assets
  Audience     audience_profiles, products, content_pillars
  Social       social_accounts, social_account_tokens
  Competitor   competitors, competitor_snapshots
  Campaign     campaigns, campaign_content_links
  Content      content_items, content_versions, content_platform_variants
  Storage      media_assets
  Analytics    analytics, campaign_metrics
  Approval     approvals
  Publishing   publishing_jobs, publishing_logs
  AI           ai_conversations, ai_messages, ai_generation_jobs
  System       audit_logs, integration_sync_logs

## 8.2 Relationship Rules

-   Satu workspace memiliki banyak brand.
-   Satu workspace memiliki dua anggota terotorisasi.
-   Satu brand memiliki banyak campaign.
-   Satu brand memiliki banyak content item.
-   Satu brand dapat memiliki beberapa social accounts.
-   Satu brand dapat melacak beberapa competitor.
-   Campaign dapat memiliki banyak content melalui
    campaign_content_links.
-   Content dapat memiliki banyak versions.
-   Content dapat memiliki platform variants.
-   Content dapat memiliki approval records.
-   Content dapat memiliki publishing jobs.
-   Publishing job memiliki publishing logs.
-   Semua data dapat ditelusuri ke workspace.

## 8.3 Data Integrity

-   Semua entitas bisnis harus memiliki relasi workspace langsung atau
    tidak langsung yang dapat diverifikasi.
-   Entitas spesifik brand harus memiliki brand_id.
-   Foreign keys harus digunakan.
-   Penghapusan data harus mempertimbangkan relasi dan audit history.
-   Perubahan status harus divalidasi di backend.

------------------------------------------------------------------------

# 9. API Specification --- Initial Contract

Endpoint awal:

  Modul             Endpoint
  ----------------- -------------------
  Workspace         /api/workspace
  Brands            /api/brands
  Intelligence      /api/intelligence
  Competitors       /api/competitors
  Campaigns         /api/campaigns
  Ideas             /api/ideas
  Creative Studio   /api/creative
  Content           /api/content
  Calendar          /api/calendar
  Analytics         /api/analytics
  Publishing        /api/publishing
  Integrations      /api/integrations
  AI Assistant      /api/ai/assistant
  AI Generation     /api/ai/generate

Detail HTTP method, request schema, response schema, dan error code
ditetapkan dalam API specification terpisah.

Semua endpoint wajib memiliki: - Identity verification. - Workspace
authorization. - Input validation. - Error handling. - Logging. - Rate
limiting sesuai kebutuhan. - Audit trail untuk aksi penting.

------------------------------------------------------------------------

# 10. Publishing Workflow Specification

## 10.1 Workflow

1.  Konten dibuat.
2.  Konten masuk review.
3.  Pengguna menyetujui atau meminta revisi.
4.  Setelah disetujui, sistem membuat approved publishing job.
5.  Jika jadwal belum tiba, job menunggu.
6.  Pada waktu yang ditentukan, job masuk queue.
7.  Worker memeriksa approval terbaru, schedule, dan platform
    capability.
8.  Worker mengirim konten melalui API resmi.
9.  Hasil dicatat.
10. Jika gagal, sistem menjalankan retry sesuai kebijakan.
11. Jika retry habis, job ditandai FAILED dan pengguna diberi
    notifikasi.

## 10.2 State Machine

-   DRAFT
-   IN_REVIEW
-   CHANGES_REQUESTED
-   APPROVED
-   SCHEDULED
-   QUEUED
-   PUBLISHING
-   PUBLISHED
-   FAILED
-   CANCELLED

## 10.3 Idempotency and Retry

-   Setiap job memiliki idempotency key.
-   Retry tidak boleh mengirim konten yang sama berulang kali.
-   Simpan external platform post ID jika tersedia.
-   Simpan request ID dan response metadata.
-   Jika hasil request tidak pasti, periksa status sebelumnya sebelum
    mengulang.
-   Gunakan exponential backoff dengan batas retry.
-   Kegagalan permanen masuk dead-letter handling atau status failed
    yang dapat ditindaklanjuti.

## 10.4 Approval Integrity

-   Approval merekam approver, timestamp, dan versi konten.
-   Setiap edit setelah approval membatalkan validitas approval
    sebelumnya.
-   Worker memeriksa versi yang disetujui sebelum publishing.
-   Tidak ada jalur publishing yang melewati approval gate.

------------------------------------------------------------------------

# 11. Social Integration Architecture

Setiap platform menggunakan adapter terpisah.

Platform: - Instagram: Meta / Instagram API. - Facebook: Meta Graph
API. - TikTok: TikTok Content Posting API. - YouTube: YouTube Data
API. - Pinterest: Pinterest API.

Setiap adapter menangani: - OAuth connection. - Token refresh. - Account
information. - Content publishing. - Publishing status. - Analytics
synchronization. - Error handling. - Rate limit handling.

Kemampuan setiap platform harus ditentukan melalui capability matrix.
Jangan mengasumsikan seluruh platform mendukung format dan operasi yang
sama.

OAuth tokens dienkripsi sebelum disimpan. API keys dan encryption keys
hanya berada di backend secrets.

------------------------------------------------------------------------

# 12. Security and Data Protection

  Area             Implementasi
  ---------------- -------------------------------------------------
  Login            Cloudflare Access
  Authorization    Workspace membership di D1
  API secrets      Worker Secrets
  OAuth tokens     Application-level authenticated encryption
  Media            Private R2 bucket
  File access      Worker-mediated access atau signed URL terbatas
  API protection   WAF dan rate limiting
  Audit            D1 audit logs
  Database         Migration, backup, dan restore testing
  Deployment       Preview dan production terpisah

Persyaratan: - Jangan menyimpan token OAuth plaintext. - Gunakan
authenticated encryption seperti AES-GCM. - Simpan encryption key di
Worker Secrets. - Rancang rotasi key. - Batasi akses file privat. -
Validasi seluruh request. - Jangan mengirim secret ke frontend. - Jangan
memasukkan data sensitif yang tidak diperlukan ke prompt AI.

------------------------------------------------------------------------

# 13. Non-Functional Requirements

  Area              Requirement
  ----------------- ---------------------------------------------------
  Performance       Navigasi dan interaksi responsif
  Reliability       Background job memiliki retry dan logging
  Security          API key dan OAuth token tidak terekspos
  Scalability       Arsitektur siap untuk penambahan brand
  Usability         Alur kerja sederhana dan konsisten
  Responsive        Optimal di desktop dan mobile web
  Maintainability   Modular dan terdokumentasi
  Data integrity    Relasi, approval, dan status konsisten
  Accessibility     Keyboard, focus, labels, contrast, reduced motion
  Observability     Error dan job failures dapat ditelusuri

------------------------------------------------------------------------

# 14. Business Rules

  -----------------------------------------------------------------------
  ID                                  Business Rule
  ----------------------------------- -----------------------------------
  BR-001                              Sistem hanya memiliki satu private
                                      workspace

  BR-002                              Tepat dua pengguna yang diotorisasi

  BR-003                              Workspace dapat mengelola banyak
                                      brand

  BR-004                              Data permanen disimpan di cloud

  BR-005                              File media disimpan di R2

  BR-006                              D1 menjadi sumber data utama

  BR-007                              AI Assistant hanya menggunakan GPT

  BR-008                              Background AI generation boleh
                                      memakai provider lain

  BR-009                              Semua konten wajib memperoleh
                                      approval sebelum publishing

  BR-010                              Publishing berjalan otomatis
                                      setelah approval dan sesuai jadwal

  BR-011                              Kompetitor dianalisis dari data
                                      publik atau data manual

  BR-012                              Integrasi mengikuti kapabilitas API
                                      resmi

  BR-013                              Perubahan penting memiliki audit
                                      log

  BR-014                              Konten yang berubah setelah
                                      approval harus disetujui ulang

  BR-015                              Setiap request privat harus
                                      melewati identity dan authorization
                                      checks

  BR-016                              Worker tidak boleh mengandalkan
                                      browser pengguna untuk scheduled
                                      jobs

  BR-017                              Kegagalan publishing harus dapat
                                      ditelusuri dan ditangani

  BR-018                              Output AI bukan pengganti keputusan
                                      atau approval pengguna
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 15. Development Roadmap

## Phase 0 --- Technical Foundation

-   Cloudflare account dan environment.
-   Cloudflare Access.
-   D1 database.
-   R2 storage.
-   Workers.
-   OpenNext vs Vinext PoC.
-   Design system.
-   CI/CD.
-   Monitoring.
-   Database migrations.

## Phase 1 --- Core Workspace

-   Workspace dan user management.
-   Brand management.
-   Dashboard.
-   Content management.
-   Media management.

## Phase 2 --- Intelligence and AI

-   GPT Assistant.
-   Background AI provider adapter.
-   Intelligence engine.
-   Competitor intelligence.
-   Idea Lab.

## Phase 3 --- Campaign and Creative

-   Campaign management.
-   Funnel strategy.
-   Creative Studio.
-   Content brief.
-   Content calendar.

## Phase 4 --- Integrations and Publishing

-   Social OAuth.
-   Platform capability matrix.
-   Approval workflow.
-   Publishing queue.
-   Automated publishing.
-   Publishing logs.

## Phase 5 --- Analytics and Optimization

-   Data synchronization.
-   Analytics dashboard.
-   Campaign reporting.
-   AI recommendations.
-   Optimization engine.

Seluruh modul harus memiliki kontrak data dan arsitektur yang
terintegrasi sejak awal, walaupun implementasinya bertahap.

------------------------------------------------------------------------

# 16. Definition of Done

Sebuah fitur dinyatakan selesai jika:

-   Alur utama berjalan tanpa error kritis.
-   Data tersimpan dan dibaca dari cloud.
-   Validasi input berjalan.
-   Business rules ditegakkan di backend.
-   Loading, empty, success, dan error states tersedia.
-   Hak akses diuji.
-   Desktop dan mobile web berfungsi.
-   Logging tersedia untuk operasi penting.
-   Dokumentasi teknis dan acceptance criteria terpenuhi.
-   Tidak ada secret yang terekspos.

------------------------------------------------------------------------

# 17. Production Readiness Checklist

## Infrastructure

-   [ ] Cloudflare environments dikonfigurasi.
-   [ ] Access allowlist hanya berisi dua pengguna.
-   [ ] D1 production database dibuat.
-   [ ] R2 private bucket dibuat.
-   [ ] Workers bindings dikonfigurasi.
-   [ ] Queues dan dead-letter handling dikonfigurasi.
-   [ ] Workflows dan Cron Triggers diuji.
-   [ ] Worker Secrets dikonfigurasi.
-   [ ] Preview dan production dipisahkan.

## Application

-   [ ] Login dan authorization berjalan.
-   [ ] Brand CRUD berjalan.
-   [ ] Campaign CRUD berjalan.
-   [ ] Content CRUD berjalan.
-   [ ] Media upload dan retrieval berjalan.
-   [ ] AI Assistant memahami konteks halaman.
-   [ ] Background AI jobs berjalan.
-   [ ] Calendar dan scheduling berjalan.
-   [ ] Approval gate tidak dapat dilewati.
-   [ ] Publishing otomatis berjalan setelah approval.
-   [ ] Retry dan duplicate prevention diuji.
-   [ ] Analytics menampilkan sumber dan periode.

## UX

-   [ ] Sidebar responsive.
-   [ ] Brand selector konsisten.
-   [ ] Gooey Quick Access berfungsi.
-   [ ] Floating AI Assistant berfungsi.
-   [ ] Semua halaman memiliki UI states.
-   [ ] Desktop dan mobile web diuji.
-   [ ] Keyboard dan reduced-motion support diuji.

## Operations

-   [ ] Backup dan restore diuji.
-   [ ] Error monitoring aktif.
-   [ ] Publishing logs dapat diperiksa.
-   [ ] Token refresh diuji.
-   [ ] API rate limit handling diuji.
-   [ ] Dokumentasi operasional tersedia.

------------------------------------------------------------------------

# 18. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                              Mitigasi
  ----------------------------------- -----------------------------------
  Vinext masih beta                   PoC dan fallback OpenNext

  D1 memiliki batas ukuran dan        Agregasi data, indeks, pagination,
  karakteristik SQLite                R2, monitoring

  API platform berubah                Adapter terpisah dan capability
                                      matrix

  OAuth token kedaluwarsa             Refresh token workflow

  Publishing ganda                    Idempotency dan status
                                      reconciliation

  Queue gagal                         Retry, dead-letter handling,
                                      monitoring

  AI provider gagal                   Retry dan provider fallback

  Approval tidak sinkron dengan       Version-bound approval dan
  konten                              pemeriksaan ulang

  Data membesar                       Retention policy dan agregasi
                                      analytics
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 19. Dokumen Turunan yang Dibutuhkan

PRD ini menjadi dokumen induk. Sebelum implementasi penuh, siapkan
dokumen berikut:

1.  **UI/UX Specification** --- detail halaman, komponen, interaksi,
    responsive layout, dan motion.
2.  **Database Schema Specification** --- kolom, tipe SQLite, relasi,
    indeks, constraints, dan migration.
3.  **API Specification** --- HTTP methods, request/response schemas,
    validation, dan error codes.
4.  **AI Context Specification** --- context retrieval, provider
    abstraction, prompt architecture, dan data boundaries.
5.  **Publishing Integration Specification** --- OAuth, capability
    matrix, approval, scheduling, retry, dan adapter per platform.
6.  **Deployment and CI/CD Specification** --- environments, secrets,
    build, testing, deployment, rollback, dan monitoring.

------------------------------------------------------------------------

# 20. Referensi Dokumentasi Teknis

-   Cloudflare Workers: https://developers.cloudflare.com/workers/
-   Cloudflare D1: https://developers.cloudflare.com/d1/
-   Cloudflare R2: https://developers.cloudflare.com/r2/
-   Cloudflare Access: https://developers.cloudflare.com/cloudflare-one/
-   Cloudflare Queues: https://developers.cloudflare.com/queues/
-   Cloudflare Workflows: https://developers.cloudflare.com/workflows/
-   Cloudflare Next.js:
    https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
-   Meta Instagram Platform:
    https://developers.facebook.com/docs/instagram-platform/
-   Meta Graph API: https://developers.facebook.com/docs/graph-api/
-   TikTok Developers: https://developers.tiktok.com/
-   YouTube Data API: https://developers.google.com/youtube/v3
-   YouTube Analytics API:
    https://developers.google.com/youtube/analytics
-   Pinterest API: https://developers.pinterest.com/docs/api/v5/

**Catatan:** Dokumentasi API platform dan Cloudflare dapat berubah.
Verifikasi kemampuan, permission, quota, batas produk, dan status
framework pada saat implementasi.

------------------------------------------------------------------------

# END OF PRD v1.1
