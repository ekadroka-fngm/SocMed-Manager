import { Brand, Campaign, ContentItem, Competitor, IdeaItem, SocialIntegration, AuditLogItem, User, Workspace } from '../types';

export const CURRENT_WORKSPACE: Workspace = {
  id: 'ws_nusantara_01',
  name: 'Nusantara Studio',
  plan: 'Private · 2 members',
  createdAt: '2025-03-14T08:00:00Z',
  users: [
    {
      id: 'usr_ayu',
      name: 'Ayu Prameswari',
      email: 'ayu@nusantara.studio',
      role: 'Owner',
      avatar: 'AP'
    },
    {
      id: 'usr_bagas',
      name: 'Bagas Wirawan',
      email: 'bagas@nusantara.studio',
      role: 'Editor',
      avatar: 'BW'
    }
  ]
};

export const INITIAL_BRANDS: Brand[] = [
  {
    id: 'brd_arunika',
    name: 'Arunika Coffee',
    category: 'F&B · specialty coffee',
    tagline: 'Kopi specialty single origin dari dataran tinggi Gayo dan Kintamani, disangrai mingguan di Yogyakarta.',
    description: 'Kopi specialty single origin dari dataran tinggi Gayo dan Kintamani, disangrai mingguan di Yogyakarta.',
    logo: 'A',
    positioning: 'Rumah kopi yang jujur soal asal-usul: setiap kemasan bisa dilacak sampai nama petani.',
    voiceAndTone: 'Hangat, Terukur, Tanpa hiperbola, Sedikit teknis',
    campaignCount: 3,
    totalFollowers: '24,8 rb',
    avgEngagementRate: '4,7%',
    connectedPlatforms: ['instagram', 'tiktok', 'youtube', 'facebook'],
    personas: [
      {
        id: 'per_rani',
        name: 'Rani, 28 (Persona Utama)',
        ageRange: '25–35',
        role: 'UX writer · Yogyakarta · urban, menyeduh di rumah',
        corePainPoints: [
          'Bingung membedakan profil sangrai',
          'Sering kecewa hasil seduh',
          'Sulit menemukan kopi jujur tanpa campuran robusta'
        ],
        desires: [
          'Konten edukasi singkat + bukti asal-usul petani',
          'Resep seduh V60 yang mudah ditiru',
          'Transparansi harga per cangkir'
        ],
        preferredPlatforms: ['instagram', 'tiktok', 'youtube']
      }
    ],
    products: [
      {
        id: 'prd_gayo_200g',
        name: 'Single Origin Gayo 200g',
        category: 'Whole Bean',
        priceRange: 'Rp 95.000',
        usp: 'Traceability penuh ke Pak Salim + sangrai mingguan',
        keyBenefits: ['Notes peach & black tea', 'Clean cup finish', 'Petik merah 100%']
      },
      {
        id: 'prd_bundling_2x200g',
        name: 'Bundling 2x200g (Gayo + Kintamani)',
        category: 'Bundle',
        priceRange: 'Rp 175.000',
        usp: 'Eksperimen dua profil sangrai dalam satu paket',
        keyBenefits: ['Hemat 15%', 'Termasuk kartu panduan rasio seduh']
      }
    ],
    pillars: [
      { id: 'pil_edukasi', name: 'Edukasi seduh', description: 'Panduan seduh V60, Aeropress, dan rasio air.', targetPercentage: 32, color: '#5268D8' },
      { id: 'pil_petani', name: 'Cerita petani', description: 'Dokumentasi kebun Pak Salim, panen gayo, dan proses natural.', targetPercentage: 26, color: '#21A68A' },
      { id: 'pil_produk', name: 'Produk & promo', description: 'Bundling bulanan, transparansi biaya per cangkir.', targetPercentage: 24, color: '#E4A44A' },
      { id: 'pil_bts', name: 'Behind the scenes', description: 'Proses roasting mingguan, cupping session, dan uji rasa.', targetPercentage: 18, color: '#DC6470' }
    ]
  },
  {
    id: 'brd_selaras',
    name: 'Selaras Skincare',
    category: 'Beauty · skincare lokal',
    tagline: 'Formulasi botanikal lokal untuk perbaikan skin barrier iklim tropis.',
    description: 'Skincare bersih berbahan aktif lokal ramah iklim tropis.',
    logo: 'S',
    positioning: 'Skincare klinis berbasis kekayaan tanaman obat Nusantara.',
    voiceAndTone: 'Menenangkan, Ilmiah, Bersih, Empatis',
    campaignCount: 2,
    totalFollowers: '18,2 rb',
    avgEngagementRate: '3,8%',
    connectedPlatforms: ['instagram', 'tiktok'],
    personas: [
      {
        id: 'per_selaras',
        name: 'Dinda, 26',
        ageRange: '22-32',
        role: 'Marketing Associate',
        corePainPoints: ['Skin barrier rusak karena polusi', 'Kusam akibat cuaca panas'],
        desires: ['Serum ringan tidak lengket', 'Bahan bersertifikat BPOM'],
        preferredPlatforms: ['instagram', 'tiktok']
      }
    ],
    products: [
      {
        id: 'prd_selaras_serum',
        name: 'Centella Barrier Drops',
        category: 'Serum',
        priceRange: 'Rp 129.000',
        usp: 'Ekstrak pegagan organik Jawa Tengah',
        keyBenefits: ['Menenangkan kemerahan', 'Hydration lock 48 jam']
      }
    ],
    pillars: [
      { id: 'pil_selaras_1', name: 'Edukasi Bahan', description: 'Mengenal pegagan dan niacinamide.', targetPercentage: 40, color: '#5268D8' },
      { id: 'pil_selaras_2', name: 'Rutinitas Pagi', description: 'Urutan pemakaian tanpa rasa lengket.', targetPercentage: 35, color: '#21A68A' },
      { id: 'pil_selaras_3', name: 'Testimoni', description: 'Bukti 30 hari pemulihan barrier.', targetPercentage: 25, color: '#E4A44A' }
    ]
  },
  {
    id: 'brd_nusa_run',
    name: 'Nusa Run Club',
    category: 'Sport · komunitas lari',
    tagline: 'Komunitas lari inklusif dengan program latihan terstruktur.',
    description: 'Wadah pelari rekreasi urban di kota-kota besar.',
    logo: 'N',
    positioning: 'Lari untuk kesehatan mental dan persahabatan, bukan hanya pace.',
    voiceAndTone: 'Energik, Menyemangati, Membumi',
    campaignCount: 1,
    totalFollowers: '9,6 rb',
    avgEngagementRate: '5,6%',
    connectedPlatforms: ['instagram', 'tiktok'],
    personas: [
      {
        id: 'per_nusa_run',
        name: 'Bimo, 31',
        ageRange: '25-38',
        role: 'Software Engineer',
        corePainPoints: ['Konsistensi latihan', 'Takut mulai karena pace lambat'],
        desires: ['Grup lari akhir pekan ramah pemula', 'Tips hidrasi & rute'],
        preferredPlatforms: ['instagram', 'tiktok']
      }
    ],
    products: [
      {
        id: 'prd_jersey',
        name: 'Nusa Breathable Singlet',
        category: 'Apparel',
        priceRange: 'Rp 189.000',
        usp: 'Mesh ultralight cepat kering',
        keyBenefits: ['Bebas lecet', 'Visibilitas malam hari']
      }
    ],
    pillars: [
      { id: 'pil_nusa_1', name: 'Rute & Jadwal', description: 'Lokasi Sunday morning run.', targetPercentage: 40, color: '#5268D8' },
      { id: 'pil_nusa_2', name: 'Tips Pemula', description: 'Pemanasan dan memilih sepatu.', targetPercentage: 35, color: '#21A68A' },
      { id: 'pil_nusa_3', name: 'Cerita Anggota', description: 'Perjalanan 5K pertama.', targetPercentage: 25, color: '#E4A44A' }
    ]
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_panen_gayo',
    brandId: 'brd_arunika',
    name: 'Panen Raya Gayo',
    slug: 'panen-raya-gayo',
    status: 'ACTIVE',
    startDate: '2025-09-01',
    endDate: '2025-10-31',
    objective: 'Awareness → Conversion; menaikkan pembelian ulang pelanggan lama.',
    targetAudience: 'Rani, 28 · pembeli terakhir 60 hari terakhir.',
    keyMessage: 'Panen baru, rasa yang sama jujurnya.',
    primaryFunnelFocus: 'TOFU',
    targetFunnelBreakdown: { TOFU: 50, MOFU: 30, BOFU: 20 },
    funnelDistribution: { TOFU: 50, MOFU: 30, BOFU: 20 },
    assignedProductIds: ['prd_gayo_200g', 'prd_bundling_2x200g'],
    assignedPillarIds: ['pil_petani', 'pil_edukasi', 'pil_produk'],
    contentCount: 18,
    publishedCount: 14,
    metrics: {
      reach: '412 rb',
      engagementRate: '5,1%',
      conversions: 840,
      totalViews: '280 rb'
    }
  },
  {
    id: 'cmp_bundling_okt',
    brandId: 'brd_arunika',
    name: 'Bundling Oktober',
    slug: 'bundling-oktober',
    status: 'ACTIVE',
    startDate: '2025-10-10',
    endDate: '2025-11-05',
    objective: 'Conversion; dorong volume pesanan paket hemat 2x200g.',
    targetAudience: 'Rani, 28 · peminum harian.',
    keyMessage: 'Dua karakter rasa, satu harga bersahabat.',
    primaryFunnelFocus: 'BOFU',
    targetFunnelBreakdown: { TOFU: 40, MOFU: 25, BOFU: 35 },
    funnelDistribution: { TOFU: 40, MOFU: 25, BOFU: 35 },
    assignedProductIds: ['prd_bundling_2x200g'],
    assignedPillarIds: ['pil_produk', 'pil_edukasi'],
    contentCount: 9,
    publishedCount: 2,
    metrics: {
      reach: '94 rb',
      engagementRate: '4,4%',
      conversions: 160,
      totalViews: '62 rb'
    }
  },
  {
    id: 'cmp_ngopi_rumah',
    brandId: 'brd_arunika',
    name: 'Ngopi di Rumah',
    slug: 'ngopi-di-rumah',
    status: 'ACTIVE',
    startDate: '2025-09-15',
    endDate: '2025-10-15',
    objective: 'Consideration; panduan seduh rumahan tanpa alat mahal.',
    targetAudience: 'Rani, 28 · penikmat manual brew pemula.',
    keyMessage: 'Kopi enak tidak harus rumit.',
    primaryFunnelFocus: 'MOFU',
    targetFunnelBreakdown: { TOFU: 45, MOFU: 35, BOFU: 20 },
    funnelDistribution: { TOFU: 45, MOFU: 35, BOFU: 20 },
    assignedProductIds: ['prd_gayo_200g'],
    assignedPillarIds: ['pil_edukasi', 'pil_bts'],
    contentCount: 12,
    publishedCount: 7,
    metrics: {
      reach: '210 rb',
      engagementRate: '4,2%',
      conversions: 320,
      totalViews: '155 rb'
    }
  }
];

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'cnt_panen_gayo_1',
    brandId: 'brd_arunika',
    campaignId: 'cmp_panen_gayo',
    contentPillarId: 'pil_petani',
    title: 'Cerita panen Gayo 2025',
    objective: 'Membangun koneksi emosional dengan transparansi rantai pasok kebun Pak Salim.',
    targetAudience: 'Rani, 28 · urban coffee lover',
    funnelStage: 'MOFU',
    format: 'instagram_reel',
    mainMessage: 'Biji kopi yang kamu nikmati dipetik langsung 12 jam sebelumnya dengan seleksi petik merah ketat.',
    creativeAngle: 'Behind the scenes perjalanan kebun ke cangkir',
    hook: '"Kamu tahu nggak, biji ini dipetik 12 jam sebelum sampai cangkirmu?"',
    visualDirection: 'Visual close-up cherry kopi basah di pohon, transisi cepat ke proses pulping dan sangrai di Yogyakarta.',
    cta: 'Komentari GAYO untuk resep seduh hari ini.',
    caption: 'Dari kebun Pak Salim jam 5 pagi, sampai cangkirmu 12 jam kemudian. Panen tahun ini lebih kecil, tapi rasanya lebih bersih. Simpan postingan ini untuk tips seduh berikutnya.\n\n#arunikacoffee #singleinorigin #gayo #kopiindonesia',
    hashtags: ['#arunikacoffee', '#singleinorigin', '#gayo', '#kopiindonesia'],
    references: ['https://instagram.com/p/sample1'],
    storytelling: {
      hook: 'Pertanyaan asal-usul biji, visual close-up cherry (0:00).',
      problem: 'Kopi enak sering tidak jelas dari mana asalnya (0:03).',
      agitation: 'Salah beli = mahal tapi rasa tidak sesuai harapan (0:12).',
      solution: 'Panen Gayo, dipanggang mingguan, ada nama petani (0:22).',
      cta: 'Komentari GAYO untuk resep seduh hari ini (0:36).'
    },
    status: 'IN_REVIEW',
    currentVersion: 3,
    versions: [
      {
        versionNumber: 3,
        modifiedAt: '2025-10-02T10:12:00Z',
        modifiedBy: 'Ayu Prameswari',
        changeNote: 'Penyesuaian teks overlay detik 6 dan hook caption'
      },
      {
        versionNumber: 2,
        modifiedAt: '2025-09-30T16:40:00Z',
        modifiedBy: 'Bagas Wirawan',
        changeNote: 'Approval v2 sebelumnya'
      },
      {
        versionNumber: 1,
        modifiedAt: '2025-09-28T09:05:00Z',
        modifiedBy: 'Ayu Prameswari',
        changeNote: 'Draft awal brief'
      }
    ],
    revisions: [],
    createdAt: '2025-09-28T09:00:00Z',
    updatedAt: '2025-10-02T10:12:00Z'
  },
  {
    id: 'cnt_promo_bundling',
    brandId: 'brd_arunika',
    campaignId: 'cmp_bundling_okt',
    contentPillarId: 'pil_produk',
    title: 'Promo bundling Oktober',
    objective: 'Mendorong konversi paket hemat dua single origin.',
    targetAudience: 'Rani, 28 · penikmat seduh rumahan',
    funnelStage: 'BOFU',
    format: 'instagram_carousel',
    mainMessage: 'Paket hemat 2x200g Gayo & Kintamani siap kirim hari ini.',
    creativeAngle: 'Perbandingan rasa side-by-side',
    hook: 'Satu paket, dua petualangan rasa: mana karakter yang cocok untuk pagimu?',
    visualDirection: 'Slide 1 cover split screen, slide 2 profil rasa Gayo, slide 3 Kintamani, slide 4 harga hemat.',
    cta: 'Klik link di bio sebelum stok sangrai habis.',
    caption: 'Beli satuan 95rb, beli bundling cuma 175rb hemat 15rb. Sangrai baru setiap Senin.\n\n#arunikacoffee #bundlingkopi #promooktober',
    hashtags: ['#arunikacoffee', '#bundlingkopi', '#promooktober'],
    references: [],
    status: 'IN_REVIEW',
    currentVersion: 2,
    versions: [
      { versionNumber: 2, modifiedAt: '2025-10-01T14:00:00Z', modifiedBy: 'Bagas Wirawan', changeNote: 'Revisi harga bundling' },
      { versionNumber: 1, modifiedAt: '2025-09-29T10:00:00Z', modifiedBy: 'Ayu Prameswari', changeNote: 'Inisiasi draft' }
    ],
    revisions: [],
    createdAt: '2025-09-29T10:00:00Z',
    updatedAt: '2025-10-01T14:00:00Z'
  },
  {
    id: 'cnt_seduh_shorts',
    brandId: 'brd_arunika',
    campaignId: 'cmp_ngopi_rumah',
    contentPillarId: 'pil_edukasi',
    title: 'Perbandingan metode seduh',
    objective: 'Edukasi cara seduh V60 vs French Press.',
    targetAudience: 'Pemula seduh rumahan',
    funnelStage: 'TOFU',
    format: 'youtube_shorts',
    mainMessage: 'Alat berbeda menghasilkan profil rasa berbeda dari biji yang sama.',
    creativeAngle: 'Side-by-side blind test',
    hook: 'Biji kopi yang sama, rasa 180 derajat berbeda cuma karena saringan?',
    visualDirection: 'Kamera statis top-down menunjukkan pour over vs immersion.',
    cta: 'Tulis metode favoritmu di kolom komentar!',
    caption: 'Tonton sampai habis untuk tahu alasan French Press lebih pekat dibanding V60.\n\n#v60 #frenchpress #seduhkopi',
    hashtags: ['#v60', '#frenchpress', '#seduhkopi'],
    references: [],
    status: 'IN_REVIEW',
    currentVersion: 1,
    versions: [
      { versionNumber: 1, modifiedAt: '2025-10-02T05:00:00Z', modifiedBy: 'Ayu Prameswari', changeNote: 'Draft pertama' }
    ],
    revisions: [],
    createdAt: '2025-10-02T05:00:00Z',
    updatedAt: '2025-10-02T05:00:00Z'
  },
  {
    id: 'cnt_ramadhan_blend',
    brandId: 'brd_arunika',
    campaignId: 'cmp_panen_gayo',
    contentPillarId: 'pil_petani',
    title: 'Ramadhan blend: cerita petani',
    objective: 'Storytelling nilai sosial pembelian kopi Arunika.',
    targetAudience: 'Komunitas kopi sadar asal-usul',
    funnelStage: 'TOFU',
    format: 'instagram_reel',
    mainMessage: 'Setiap kilogram membantu koperasi tani di Takengon.',
    creativeAngle: 'Human interest documentary',
    hook: 'Ini Pak Salim, sosok di balik aroma karamel yang kamu seduh tadi pagi.',
    visualDirection: 'Suasana fajar di Aceh Tengah, senyum petani, proses sortir buah.',
    cta: 'Dukung petani binaan kami di link bio.',
    caption: 'Panen jujur, harga adil untuk petani. Terima kasih sudah menyeduh dengan sadar.\n\n#ceritapetani #petanikopi #arunikacoffee',
    hashtags: ['#ceritapetani', '#petanikopi', '#arunikacoffee'],
    references: [],
    status: 'SCHEDULED',
    scheduledFor: '2025-10-02T18:30:00Z',
    approvedBy: 'Bagas Wirawan',
    approvedAt: '2025-10-01T16:00:00Z',
    currentVersion: 3,
    versions: [
      { versionNumber: 3, modifiedAt: '2025-10-01T15:30:00Z', modifiedBy: 'Bagas Wirawan', changeNote: 'Approval resmi' }
    ],
    revisions: [],
    createdAt: '2025-09-25T10:00:00Z',
    updatedAt: '2025-10-01T16:00:00Z'
  },
  {
    id: 'cnt_behind_roast',
    brandId: 'brd_arunika',
    campaignId: 'cmp_ngopi_rumah',
    contentPillarId: 'pil_bts',
    title: 'Behind the roast',
    objective: 'Menunjukkan kontrol kualitas sangrai mingguan.',
    targetAudience: 'Home brewer antusias',
    funnelStage: 'MOFU',
    format: 'instagram_story',
    mainMessage: 'Roasting curve kami catat digital agar setiap batch konsisten.',
    creativeAngle: 'Sensorik & data grafik suhu',
    hook: 'First crack jam 08:30 pagi ini!',
    visualDirection: 'Video mesin sangrai putar, sampler sendok kopi panas, grafik Artisan.',
    cta: 'Swipe up untuk order batch fresh hari ini.',
    caption: 'Fresh roast batch 28 September siap kirim jam 13:00 WIB.',
    hashtags: ['#roastingkopi #freshroast'],
    references: [],
    status: 'PUBLISHED',
    publishedUrl: 'https://instagram.com/stories/arunika.coffee/sample',
    currentVersion: 3,
    versions: [
      { versionNumber: 3, modifiedAt: '2025-10-02T08:50:00Z', modifiedBy: 'Ayu Prameswari', changeNote: 'Rilis story' }
    ],
    revisions: [],
    createdAt: '2025-10-02T08:00:00Z',
    updatedAt: '2025-10-02T09:00:00Z'
  },
  {
    id: 'cnt_cold_brew',
    brandId: 'brd_arunika',
    campaignId: 'cmp_ngopi_rumah',
    contentPillarId: 'pil_edukasi',
    title: 'Cold brew shift malam',
    objective: 'Resep cold brew mudah disimpan di kulkas 1 minggu.',
    targetAudience: 'Pekerja WFH malam',
    funnelStage: 'MOFU',
    format: 'tiktok_video',
    mainMessage: 'Rasio 1:10, simpan kulkas 16 jam, siap diminum kapan saja.',
    creativeAngle: 'ASMR pouring & es batu',
    hook: 'Stop beli kopi susu kaleng kalau kamu bisa bikin stok ini untuk 5 hari.',
    visualDirection: 'Kamera close-up saat kopi pekat mengucur ke atas es batu bulat.',
    cta: 'Bookmark video ini agar tidak lupa takarannya.',
    caption: 'Resep rahasia cold brew minim asam lambung. Bahan cuma bubuk kasar dan air dingin.\n\n#coldbrew #reseprumahan #kopitiktok',
    hashtags: ['#coldbrew', '#reseprumahan', '#kopitiktok'],
    references: [],
    status: 'SCHEDULED',
    scheduledFor: '2025-10-02T20:00:00Z',
    approvedBy: 'Ayu Prameswari',
    approvedAt: '2025-10-01T11:00:00Z',
    currentVersion: 2,
    versions: [
      { versionNumber: 2, modifiedAt: '2025-10-01T10:00:00Z', modifiedBy: 'Ayu Prameswari', changeNote: 'Approval jadwal' }
    ],
    revisions: [],
    createdAt: '2025-09-30T10:00:00Z',
    updatedAt: '2025-10-01T11:00:00Z'
  },
  {
    id: 'cnt_seduh_mesin',
    brandId: 'brd_arunika',
    campaignId: 'cmp_ngopi_rumah',
    contentPillarId: 'pil_edukasi',
    title: '3 cara seduh tanpa mesin',
    objective: 'Menurunkan barrier pemula untuk menikmati specialty.',
    targetAudience: 'Penikmat kopi kasual',
    funnelStage: 'TOFU',
    format: 'youtube_shorts',
    mainMessage: 'Cukup cangkir, air panas, dan saringan kain warung.',
    creativeAngle: 'Hacks seduh hemat',
    hook: 'Jangan beli mesin mahal sebelum kamu coba trik seduh 5 ribuan ini!',
    visualDirection: 'Demonstrasi cepat 3 teknik seduh sederhana.',
    cta: 'Subscribe untuk tips kopi harian.',
    caption: 'Seduh specialty kopi enak tanpa alat barista.\n\n#seduhmanual #kopiindonesia',
    hashtags: ['#seduhmanual', '#kopiindonesia'],
    references: [],
    status: 'PUBLISHED',
    publishedUrl: 'https://youtube.com/shorts/sample_seduh',
    currentVersion: 2,
    versions: [
      { versionNumber: 2, modifiedAt: '2025-10-02T12:00:00Z', modifiedBy: 'Bagas Wirawan', changeNote: 'Rilis tayang' }
    ],
    revisions: [],
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-02T12:15:00Z'
  },
  {
    id: 'cnt_kuis_kopi',
    brandId: 'brd_arunika',
    campaignId: 'cmp_panen_gayo',
    contentPillarId: 'pil_edukasi',
    title: 'Kuis biji kopi',
    objective: 'Interaktivitas kuis story Instagram.',
    targetAudience: 'Followers IG',
    funnelStage: 'TOFU',
    format: 'instagram_story',
    mainMessage: 'Tebak asal daerah dari visual bentuk biji sangrai.',
    creativeAngle: 'Interactive quiz sticker',
    hook: 'Bisa bedakan Gayo vs Kintamani cuma dari bijinya?',
    visualDirection: 'Stiker polling IG story interaktif.',
    cta: 'Vote pilihanmu sekarang!',
    caption: 'Kuis tebak biji kopi mingguan.',
    hashtags: ['#kuiskopi'],
    references: [],
    status: 'FAILED',
    currentVersion: 1,
    versions: [
      { versionNumber: 1, modifiedAt: '2025-10-01T09:30:00Z', modifiedBy: 'Ayu Prameswari', changeNote: 'Inisiasi' }
    ],
    revisions: [],
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-10-01T09:40:00Z'
  }
];

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: 'ide_1',
    brandId: 'brd_arunika',
    campaignId: 'cmp_ngopi_rumah',
    title: 'Seri uji seduh: V60 vs Aeropress',
    hypothesis: 'Bandingkan dua metode dengan biji yang sama, tutup dengan rekomendasi profil sangrai untuk pemula.',
    funnelStage: 'MOFU',
    format: 'instagram_carousel',
    creativeAngle: 'Eksperimen terkontrol',
    targetAudience: 'Rani, 28 · persona utama',
    contentPillarId: 'pil_edukasi',
    status: 'NEW',
    createdAt: '2025-10-02T08:00:00Z'
  },
  {
    id: 'ide_2',
    brandId: 'brd_arunika',
    campaignId: 'cmp_panen_gayo',
    title: 'Dari kebun ke cangkir: 12 jam panen Gayo',
    hypothesis: 'Dokumentasi satu hari panen bersama Pak Salim, dari petik selektif sampai proses natural.',
    funnelStage: 'TOFU',
    format: 'instagram_reel',
    creativeAngle: 'Behind the scenes',
    targetAudience: 'Rani, 28 · urban coffee lover',
    contentPillarId: 'pil_petani',
    status: 'SAVED',
    createdAt: '2025-10-02T07:30:00Z'
  },
  {
    id: 'ide_3',
    brandId: 'brd_arunika',
    campaignId: 'cmp_bundling_okt',
    title: 'Berapa biaya satu cangkir specialty?',
    hypothesis: 'Rinci biaya biji, susu, dan waktu seduh agar harga terasa masuk akal.',
    funnelStage: 'BOFU',
    format: 'instagram_reel',
    creativeAngle: 'Transparansi harga',
    targetAudience: 'Rani, 28 · peminum harian',
    contentPillarId: 'pil_produk',
    status: 'NEW',
    createdAt: '2025-10-02T07:00:00Z'
  },
  {
    id: 'ide_4',
    brandId: 'brd_arunika',
    campaignId: 'cmp_ngopi_rumah',
    title: 'Kesalahan menyimpan biji kopi',
    hypothesis: 'Mitos vs fakta penyimpanan: kulkas, freezer, dan wadah kedap udara.',
    funnelStage: 'TOFU',
    format: 'instagram_carousel',
    creativeAngle: 'Mitos vs fakta',
    targetAudience: 'Rani, 28 · home brewer',
    contentPillarId: 'pil_edukasi',
    status: 'SAVED',
    createdAt: '2025-10-02T06:30:00Z'
  }
];

export const INITIAL_COMPETITORS: Competitor[] = [
  {
    id: 'cmp_tuku',
    brandId: 'brd_arunika',
    name: 'Rumah Kopi Tuku',
    handle: '@rumahkopituku',
    platform: 'instagram',
    profileUrl: 'https://instagram.com/rumahkopituku',
    postFrequency: '12 post/mgg',
    dominantThemes: ['Edukasi + promo', 'Komunitas tetangga'],
    whitespaceOpportunity: 'Narasi "ngopi murah" konsisten. Hook 3 detik pertama selalu pertanyaan harga. Celah Arunika: kedalaman edukasi single origin & transparansi petani.',
    status: 'ACTIVE',
    lastObservedAt: '2025-09-28',
    snapshots: [
      {
        id: 'snp_tuku_1',
        snapshotDate: '2025-09-28',
        postSnippet: 'Narasi "ngopi murah" konsisten. Hook 3 detik pertama selalu pertanyaan harga.',
        observedThemes: ['Edukasi + promo', 'Harga bersahabat'],
        sourceUrl: 'https://instagram.com/rumahkopituku',
        verifiedPublic: true
      },
      {
        id: 'snp_tuku_2',
        snapshotDate: '2025-09-21',
        postSnippet: 'Mulai eksperimen carousel edukasi; engagement naik dari 1,8% ke 2,6%.',
        observedThemes: ['Carousel edukasi'],
        sourceUrl: 'https://instagram.com/rumahkopituku',
        verifiedPublic: true
      }
    ]
  },
  {
    id: 'cmp_kenangan',
    brandId: 'brd_arunika',
    name: 'Kopi Kenangan Rumah',
    handle: '@kenanganrumah',
    platform: 'instagram',
    profileUrl: 'https://instagram.com/kenanganrumah',
    postFrequency: '18 post/mgg',
    dominantThemes: ['Promo + humor', 'Produk RTD'],
    whitespaceOpportunity: 'Konten berfokus humor kasir dan diskon kilat. Tidak menyentuh asal-usul kebun.',
    status: 'ACTIVE',
    lastObservedAt: '2025-09-28',
    snapshots: [
      {
        id: 'snp_kenangan_1',
        snapshotDate: '2025-09-28',
        postSnippet: 'Konten meme promo gajian dan botolan literan.',
        observedThemes: ['Promo gajian', 'Meme'],
        sourceUrl: 'https://instagram.com/kenanganrumah',
        verifiedPublic: true
      }
    ]
  },
  {
    id: 'cmp_selaras_nat',
    brandId: 'brd_arunika',
    name: 'Selaras Naturals',
    handle: '@selarasnaturals',
    platform: 'instagram',
    profileUrl: 'https://instagram.com/selarasnaturals',
    postFrequency: '9 post/mgg',
    dominantThemes: ['Edukasi bahan', 'Estetika botani'],
    whitespaceOpportunity: 'Benchmark visual palet earthy yang konsisten dan minimalis.',
    status: 'ACTIVE',
    lastObservedAt: '2025-09-28',
    snapshots: [
      {
        id: 'snp_selaras_1',
        snapshotDate: '2025-09-28',
        postSnippet: 'Carousel mikro tentang ekstraksi bahan alami.',
        observedThemes: ['Edukasi bahan'],
        sourceUrl: 'https://instagram.com/selarasnaturals',
        verifiedPublic: true
      }
    ]
  },
  {
    id: 'cmp_titik_kumpul',
    brandId: 'brd_arunika',
    name: 'Titik Kumpul Coffee',
    handle: '@titikkumpul',
    platform: 'instagram',
    profileUrl: 'https://instagram.com/titikkumpul',
    postFrequency: '6 post/mgg',
    dominantThemes: ['Komunitas', 'Event live music'],
    whitespaceOpportunity: 'Fokus pada fisik kedai, bukan penjualan biji ke luar kota.',
    status: 'NEEDS_REFRESH',
    lastObservedAt: '2025-09-21',
    snapshots: [
      {
        id: 'snp_titik_1',
        snapshotDate: '2025-09-21',
        postSnippet: 'Poster live akustik Sabtu malam dan jadwal nobar.',
        observedThemes: ['Event offline'],
        sourceUrl: 'https://instagram.com/titikkumpul',
        verifiedPublic: true
      }
    ]
  },
  {
    id: 'cmp_barista_lokal',
    brandId: 'brd_arunika',
    name: 'Barista Lokal ID',
    handle: '@baristalokal',
    platform: 'tiktok',
    profileUrl: 'https://tiktok.com/@baristalokal',
    postFrequency: '21 post/mgg',
    dominantThemes: ['Tutorial', 'Uji rasa'],
    whitespaceOpportunity: 'Kreator independen dengan engagement tinggi pada konten hacks pour over.',
    status: 'ACTIVE',
    lastObservedAt: '2025-09-14',
    snapshots: [
      {
        id: 'snp_barista_1',
        snapshotDate: '2025-09-14',
        postSnippet: 'Video TikTok 30 detik cara tuang air spiral.',
        observedThemes: ['Tutorial'],
        sourceUrl: 'https://tiktok.com/@baristalokal',
        verifiedPublic: true
      }
    ]
  }
];

export const INITIAL_INTEGRATIONS: SocialIntegration[] = [
  {
    platform: 'instagram',
    accountHandle: '@arunika.coffee',
    status: 'CONNECTED',
    scopes: ['instagram_content_publish', 'instagram_manage_insights', 'pages_show_list', 'business_management'],
    tokenExpiresAt: '52 j',
    lastSyncedAt: '09:12 WIB',
    errorRatePercent: 0,
    supportedFormats: ['instagram_reel', 'instagram_carousel', 'instagram_story'],
    rateLimitQuotaPerHour: 200,
    rateLimitRemaining: 58
  },
  {
    platform: 'facebook',
    accountHandle: 'Arunika Coffee Page',
    status: 'CONNECTED',
    scopes: ['pages_manage_posts', 'pages_read_engagement'],
    tokenExpiresAt: '52 j',
    lastSyncedAt: '09:12 WIB',
    errorRatePercent: 0,
    supportedFormats: ['facebook_post', 'facebook_reel'],
    rateLimitQuotaPerHour: 200,
    rateLimitRemaining: 180
  },
  {
    platform: 'tiktok',
    accountHandle: '@arunikacoffee',
    status: 'CONNECTED',
    scopes: ['video.publish', 'user.info.stats'],
    tokenExpiresAt: '48 j',
    lastSyncedAt: '09:05 WIB',
    errorRatePercent: 0.2,
    supportedFormats: ['tiktok_video'],
    rateLimitQuotaPerHour: 100,
    rateLimitRemaining: 84
  },
  {
    platform: 'youtube',
    accountHandle: 'Arunika Coffee',
    status: 'TOKEN_EXPIRING_SOON',
    scopes: ['youtube.upload', 'youtube.readonly'],
    tokenExpiresAt: '3 j',
    lastSyncedAt: '08:45 WIB',
    errorRatePercent: 0,
    supportedFormats: ['youtube_shorts', 'youtube_longform'],
    rateLimitQuotaPerHour: 50,
    rateLimitRemaining: 42
  },
  {
    platform: 'pinterest',
    accountHandle: 'belum terhubung',
    status: 'DISCONNECTED',
    scopes: [],
    tokenExpiresAt: '-',
    lastSyncedAt: '-',
    errorRatePercent: 0,
    supportedFormats: ['pinterest_pin'],
    rateLimitQuotaPerHour: 100,
    rateLimitRemaining: 100
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log_1',
    timestamp: '2025-10-02T09:12:00Z',
    userId: 'usr_ayu',
    userName: 'Ayu Prameswari',
    action: 'PUBLISHING_QUEUE_ENTRY',
    entityType: 'PUBLISHING',
    entityId: 'pb_7f3a',
    details: 'Masuk queue: Cerita panen Gayo 2025 (approval v3 valid · capability IG Reel ok)'
  },
  {
    id: 'log_2',
    timestamp: '2025-10-02T09:12:00Z',
    userId: 'system',
    userName: 'System Worker',
    action: 'IDEMPOTENCY_KEY_CREATED',
    entityType: 'PUBLISHING',
    entityId: 'pb_7f3a',
    details: 'Idempotency key dibuat: c_9f2b.. disimpan untuk mencegah duplikasi pengiriman'
  },
  {
    id: 'log_3',
    timestamp: '2025-10-02T08:58:00Z',
    userId: 'usr_bagas',
    userName: 'Bagas Wirawan',
    action: 'CONTENT_APPROVED',
    entityType: 'CONTENT_ITEM',
    entityId: 'cnt_panen_gayo_1',
    details: 'Disetujui Bagas: Cerita panen Gayo 2025 versi 3'
  },
  {
    id: 'log_4',
    timestamp: '2025-10-02T08:40:00Z',
    userId: 'usr_ayu',
    userName: 'Ayu Prameswari',
    action: 'CONTENT_SUBMITTED_FOR_REVIEW',
    entityType: 'CONTENT_ITEM',
    entityId: 'cnt_panen_gayo_1',
    details: 'Diajukan review: Cerita panen Gayo 2025 (perubahan teks hook & caption)'
  }
];
