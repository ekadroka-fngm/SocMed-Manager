import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Edit2,
  Archive,
  ArrowRight,
  Upload,
  ChevronDown,
  X,
  Check,
  Sparkles,
  Layers
} from 'lucide-react';
import { Brand } from '../../types';

export const BrandsPage: React.FC = () => {
  const { brands, activeBrand, activeBrandId, switchBrand, createBrand, updateBrand, archiveBrand, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'identitas' | 'positioning' | 'suara' | 'pillars' | 'produk' | 'sosial'>('identitas');

  // Modals & dropdowns
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const assetInputRef = useRef<HTMLInputElement>(null);

  // Create brand form
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCategory, setNewBrandCategory] = useState('F&B / Specialty');
  const [newBrandDescription, setNewBrandDescription] = useState('');
  const [newBrandPositioning, setNewBrandPositioning] = useState('');
  const [newBrandColor, setNewBrandColor] = useState('#B85D2A');

  // Edit brand form
  const [editBrandName, setEditBrandName] = useState(activeBrand.name);
  const [editBrandCategory, setEditBrandCategory] = useState(activeBrand.category);
  const [editBrandDesc, setEditBrandDesc] = useState(activeBrand.description);

  const handleOpenCreateModal = () => {
    setNewBrandName('');
    setNewBrandCategory('F&B / Specialty');
    setNewBrandDescription('');
    setNewBrandPositioning('');
    setNewBrandColor('#B85D2A');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setEditBrandName(activeBrand.name);
    setEditBrandCategory(activeBrand.category);
    setEditBrandDesc(activeBrand.description);
    setIsEditModalOpen(true);
  };

  const handleSaveBrandEdits = () => {
    const name = editBrandName.trim();
    const category = editBrandCategory.trim();
    if (!name || !category) {
      showToast('Nama dan kategori brand wajib diisi.');
      return;
    }
    updateBrand(activeBrand.id, {
      name,
      category,
      description: editBrandDesc.trim()
    });
    setIsEditModalOpen(false);
    showToast('Perubahan brand diperbarui di sesi aplikasi ini.');
  };

  const handleArchiveActiveBrand = () => {
    if (!window.confirm(`Arsipkan brand "${activeBrand.name}"? Brand tidak akan tampil lagi di daftar aktif.`)) return;
    const archived = archiveBrand(activeBrand.id);
    if (archived) showToast('Brand berhasil diarsipkan dari daftar aktif.');
  };

  const handleAssetSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Pilih file gambar untuk logo brand.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Ukuran logo maksimal 5 MB.');
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updateBrand(activeBrand.id, { logo: previewUrl });
    showToast('Preview logo diperbarui. Upload permanen ke Cloudflare R2 belum diaktifkan.');
  };

  const handleCreateBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) {
      showToast('Nama brand harus diisi.');
      return;
    }

    createBrand({
      name: newBrandName.trim(),
      tagline: 'Kopi Specialty Indonesia',
      logo: newBrandName.charAt(0).toUpperCase(),
      category: newBrandCategory,
      themeColor: newBrandColor,
      description: newBrandDescription || 'Brand profil baru di workspace Kompas Intelligence.',
      positioning: newBrandPositioning || 'Solusi premium untuk pasar modern.',
      voiceAndTone: 'Hangat, terukur, dan otentik',
      pillars: [
        { id: 'pil_1', name: 'Edukasi & Nilai', description: 'Tips seduh dan edukasi', targetPercentage: 35, color: '#5268D8' },
        { id: 'pil_2', name: 'Kisah & Bukti', description: 'Cerita petani', targetPercentage: 30, color: '#21A68A' },
        { id: 'pil_3', name: 'Produk & Penawaran', description: 'Promo bundling', targetPercentage: 35, color: '#E4A44A' }
      ],
      personas: [
        {
          id: 'per_1',
          name: 'Audiens Utama',
          ageRange: '24-38',
          role: 'Profesional Urban',
          corePainPoints: ['Membutuhkan produk berkualitas teruji.'],
          desires: ['Mencari rekomendasi kredibel.'],
          preferredPlatforms: ['instagram', 'tiktok']
        }
      ],
      products: [],
      connectedPlatforms: ['instagram', 'tiktok']
    });

    setIsCreateModalOpen(false);
    showToast(`Brand "${newBrandName}" berhasil ditambahkan.`);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">
            Brand management
          </h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            {brands.length} brand aktif · konteks brand berlaku global untuk Intelligence, Studio, dan AI Assistant
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap relative">
          {/* Brand Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 shadow-2xs"
            >
              <span>{activeBrand.name}</span>
              <ChevronDown className="w-3 h-3 text-[#68717E]" />
            </button>

            {isBrandDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      switchBrand(b.id);
                      setIsBrandDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      b.id === activeBrandId ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] font-mono text-[#68717E]">{b.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Brand baru</span>
          </button>
        </div>
      </div>

      {/* 2. Top Brands Grid Matching Brands_82209652.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {brands.map(brand => {
          const isActive = brand.id === activeBrandId;
          return (
            <div
              key={brand.id}
              onClick={() => switchBrand(brand.id)}
              className={`p-4 rounded-[12px] bg-white dark:bg-[#1B1E25] border transition-all cursor-pointer shadow-2xs flex flex-col justify-between ${
                isActive
                  ? 'border-[#5268D8] ring-1 ring-[#5268D8]'
                  : 'border-[#E7E9ED] dark:border-[#292E38] hover:border-neutral-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-[7px] text-white flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: brand.themeColor || '#B85D2A' }}
                    >
                      {brand.logo.startsWith('blob:') ? <img src={brand.logo} alt={`${brand.name} logo`} className="w-full h-full object-cover rounded-[7px]" /> : brand.logo}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                        {brand.name}
                      </h3>
                      <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2]">
                        {brand.category}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252A38] dark:text-[#8292F0]">
                      ● AKTIF
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-[#E7E9ED]/60 dark:border-[#292E38]/60 text-left">
                  <div>
                    <span className="text-[9px] font-mono text-[#68717E] block">Followers</span>
                    <span className="text-xs font-bold font-mono text-[#17191F] dark:text-[#E9EBF0]">{brand.totalFollowers}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#68717E] block">Engagement</span>
                    <span className="text-xs font-bold font-mono text-[#17191F] dark:text-[#E9EBF0]">{brand.avgEngagementRate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#68717E] block">Campaign</span>
                    <span className="text-xs font-bold font-mono text-[#17191F] dark:text-[#E9EBF0]">{brand.campaignCount}</span>
                  </div>
                </div>

                {/* Mini Bar Sparkline */}
                <div className="flex items-end gap-1 h-4 pt-2">
                  <div className="flex-1 bg-[#C7D0FA] dark:bg-[#343C56] h-2 rounded-t-[2px]" />
                  <div className="flex-1 bg-[#C7D0FA] dark:bg-[#343C56] h-3 rounded-t-[2px]" />
                  <div className="flex-1 bg-[#C7D0FA] dark:bg-[#343C56] h-2 rounded-t-[2px]" />
                  <div className="flex-1 bg-[#5268D8] h-4 rounded-t-[2px]" />
                  <div className="flex-1 bg-[#5268D8] h-3.5 rounded-t-[2px]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#68717E] pt-3 mt-2 border-t border-[#E7E9ED]/60 dark:border-[#292E38]/60">
                <span>Diperbarui 2 Okt</span>
                <span className="text-[#5268D8] font-semibold flex items-center gap-0.5">
                  Buka →
                </span>
              </div>
            </div>
          );
        })}

        {/* Brand Baru Placeholder Card */}
        <div
          onClick={handleOpenCreateModal}
          className="p-4 rounded-[12px] bg-neutral-50/60 dark:bg-[#1B1E25]/40 border-2 border-dashed border-[#E7E9ED] dark:border-[#292E38] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#5268D8]/50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-[#20242D] text-[#68717E] flex items-center justify-center mb-1.5">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
            Brand baru
          </span>
          <span className="text-[10px] text-[#68717E] dark:text-[#9BA3B2]">
            Identitas, persona, pillar
          </span>
        </div>
      </div>

      {/* 3. Detail Dossier Section for Active Brand */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Dossier (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-[8px] text-white flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: activeBrand.themeColor || '#B85D2A' }}
              >
                {activeBrand.logo.startsWith('blob:') ? <img src={activeBrand.logo} alt={`${activeBrand.name} logo`} className="w-full h-full object-cover rounded-[8px]" /> : activeBrand.logo}
              </div>
              <div>
                <h2 className="text-base font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  {activeBrand.name}
                </h2>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  {activeBrand.category} · {activeBrand.connectedPlatforms.length} akun terhubung
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-[6px] border border-[#E7E9ED] dark:border-[#383F4C] hover:bg-neutral-50 text-[#17191F] dark:text-[#E9EBF0] cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={handleArchiveActiveBrand}
                className="px-3 py-1 text-xs font-medium rounded-[6px] text-[#DC6470] hover:bg-[#FEE2E2]/30 cursor-pointer"
              >
                Arsipkan
              </button>
            </div>
          </div>

          {/* Dossier Tabs */}
          <div className="flex items-center gap-1 border-b border-[#E7E9ED] dark:border-[#292E38] pb-2 text-xs font-medium flex-wrap">
            {[
              { id: 'identitas', label: 'Identitas' },
              { id: 'positioning', label: 'Positioning' },
              { id: 'suara', label: 'Suara & tone' },
              { id: 'pillars', label: 'Pillars' },
              { id: 'produk', label: 'Produk' },
              { id: 'sosial', label: 'Akun sosial' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded-[6px] transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-neutral-100 dark:bg-[#292E38] text-[#17191F] dark:text-[#E9EBF0] font-semibold'
                    : 'text-[#68717E] hover:text-[#17191F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dossier Content Based on Selected Tab */}
          {activeTab === 'identitas' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block mb-1">
                  DESKRIPSI
                </span>
                <p className="text-[#17191F] dark:text-[#E9EBF0] leading-relaxed">
                  {activeBrand.description}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block mb-1">
                  POSITIONING
                </span>
                <p className="text-[#17191F] dark:text-[#E9EBF0] leading-relaxed">
                  {activeBrand.positioning}
                </p>
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block mb-1">
                  UNIQUE SELLING PROPOSITION
                </span>
                <p className="text-[#17191F] dark:text-[#E9EBF0] leading-relaxed">
                  Traceability penuh + sangrai mingguan, tanpa campuran robusta.
                </p>
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block mb-1">
                  TARGET AUDIENS
                </span>
                <p className="text-[#17191F] dark:text-[#E9EBF0] leading-relaxed">
                  Profesional 25–40 tahun di kota besar, penggemar kopi rumahan dengan grinder manual.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'positioning' && (
            <div className="space-y-3 text-xs pt-1">
              <div className="p-3 bg-neutral-50 dark:bg-[#20242D] rounded-xl border border-[#E7E9ED] dark:border-[#2E3442] space-y-1">
                <span className="text-[9px] font-mono uppercase text-[#5268D8] font-bold">CORE VALUE PROPOSITION</span>
                <p className="text-sm font-semibold text-[#17191F] dark:text-[#E9EBF0]">{activeBrand.positioning}</p>
                <p className="text-[#68717E] dark:text-[#9BA3B2] text-xs">Membedakan diri dari kompetitor mass-market dengan transparansi asal kebun dan batch sangrai.</p>
              </div>
            </div>
          )}

          {activeTab === 'suara' && (
            <div className="space-y-3 text-xs pt-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] block">
                PANDUAN SUARA & NADA BICARA (TONE OF VOICE)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Hangat', 'Terukur', 'Otentik', 'Sedikit teknis'].map(tone => (
                  <div key={tone} className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] text-center">
                    <span className="font-semibold text-xs text-[#17191F] dark:text-[#E9EBF0]">{tone}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#68717E] pt-1">{activeBrand.voiceAndTone}</p>
            </div>
          )}

          {activeTab === 'pillars' && (
            <div className="space-y-2.5 text-xs pt-1">
              {activeBrand.pillars.map(pil => (
                <div key={pil.id} className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] flex items-center justify-between">
                  <span className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">{pil.name}</span>
                  <span className="font-mono text-[11px] font-bold text-[#5268D8]">{pil.targetPercentage}% target</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'produk' && (
            <div className="space-y-2 text-xs pt-1">
              {activeBrand.products && activeBrand.products.length > 0 ? (
                activeBrand.products.map(p => (
                  <div key={p.id} className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] flex justify-between">
                    <div>
                      <span className="font-semibold">{p.name}</span>
                      <p className="text-[10px] text-[#68717E]">{p.category} · {p.priceRange}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-neutral-50 dark:bg-[#20242D] rounded-xl text-xs text-[#68717E]">
                  Gayo Single Origin 200g, Bundling 2x200g, Drip Bag Filter Pack.
                </div>
              )}
            </div>
          )}

          {activeTab === 'sosial' && (
            <div className="space-y-2 text-xs pt-1">
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#20242D] border flex items-center justify-between">
                <span>Instagram: @{activeBrand.name.toLowerCase().replace(/\s+/g, '')}</span>
                <span className="text-[#1E8E3E] font-mono text-[10px] font-bold">● TERHUBUNG</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#20242D] border flex items-center justify-between">
                <span>TikTok: @{activeBrand.name.toLowerCase().replace(/\s+/g, '')}</span>
                <span className="text-[#1E8E3E] font-mono text-[10px] font-bold">● TERHUBUNG</span>
              </div>
            </div>
          )}

          {/* Voice & Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E7E9ED] dark:border-[#292E38]">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block mb-2">
                BRAND VOICE & TONE
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Hangat', 'Terukur', 'Tanpa hiperbola', 'Sedikit teknis'].map(tone => (
                  <span
                    key={tone}
                    className="px-2.5 py-1 rounded-[6px] bg-neutral-100 dark:bg-[#20242D] text-[11px] font-medium text-[#17191F] dark:text-[#E9EBF0]"
                  >
                    {tone}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block mb-2">
                BRAND ASSETS · 12 FILE
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[4px] bg-[#B85D2A]" />
                <div className="w-6 h-6 rounded-[4px] bg-[#222222]" />
                <div className="w-6 h-6 rounded-[4px] bg-[#EAD8C3]" />
                <button
                  type="button"
                  onClick={() => assetInputRef.current?.click()}
                  title="Pilih logo brand"
                  className="w-6 h-6 rounded-[4px] border border-dashed border-[#68717E] flex items-center justify-center text-[#68717E] cursor-pointer hover:border-black"
                >
                  <Upload className="w-3 h-3" />
                </button>
                <input
                  ref={assetInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAssetSelected}
                  className="hidden"
                  aria-label="Upload logo brand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Persona & Pillars (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Persona Utama Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <span className="text-xs font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Persona utama
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-[#20242D] text-[#68717E]">
                ● {activeBrand.personas[0]?.name || 'RANI, 28'}
              </span>
            </div>

            <p className="text-[11px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
              {activeBrand.personas[0]?.role || 'UX writer · urban, menyeduh di rumah'}
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[9px] font-mono text-[#68717E] block">Masalah</span>
                <p className="text-[#17191F] dark:text-[#E9EBF0]">{activeBrand.personas[0]?.corePainPoints?.[0] || 'Bingung membedakan profil sangrai; sering kecewa hasil seduh.'}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#68717E] block">Pemicu</span>
                <p className="text-[#17191F] dark:text-[#E9EBF0]">{activeBrand.personas[0]?.desires?.[0] || 'Konten edukasi singkat + bukti asal-usul petani.'}</p>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#68717E] block">Target Usia</span>
                <p className="text-[#17191F] dark:text-[#E9EBF0]">{activeBrand.personas[0]?.ageRange || '25–40 tahun'}</p>
              </div>
            </div>
          </div>

          {/* Content Pillars Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <span className="text-xs font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Content pillars
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('pillars')}
                className="text-xs text-[#5268D8] hover:underline font-semibold cursor-pointer"
              >
                Kelola
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Edukasi seduh', pct: 32, color: 'bg-[#5268D8]' },
                { name: 'Cerita petani', pct: 26, color: 'bg-[#21A68A]' },
                { name: 'Produk & promo', pct: 24, color: 'bg-[#E4A44A]' },
                { name: 'Behind the scenes', pct: 18, color: 'bg-[#DC6470]' }
              ].map(pil => (
                <div key={pil.name} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-[#17191F] dark:text-[#E9EBF0]">{pil.name}</span>
                    <span className="font-mono text-[#68717E]">{pil.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 dark:bg-[#20242D] rounded-full overflow-hidden">
                    <div className={`h-full ${pil.color} rounded-full`} style={{ width: `${pil.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Tambah Brand Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl max-w-md w-full p-5 border border-[#E7E9ED] dark:border-[#292E38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <h3 className="text-sm font-bold text-[#17191F] dark:text-[#E9EBF0]">
                Tambah Brand Baru ke Workspace
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-[#68717E] hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBrandSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  NAMA BRAND
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Kembara Roastery"
                  value={newBrandName}
                  onChange={e => setNewBrandName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  KATEGORI
                </label>
                <input
                  type="text"
                  placeholder="F&B / Sustainable Lifestyle"
                  value={newBrandCategory}
                  onChange={e => setNewBrandCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  DESKRIPSI & NILAI UNIK
                </label>
                <textarea
                  rows={2}
                  placeholder="Profil singkat brand..."
                  value={newBrandDescription}
                  onChange={e => setNewBrandDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  WARNA TEMA
                </label>
                <div className="flex items-center gap-2">
                  {['#B85D2A', '#1E8E3E', '#5268D8', '#D97706', '#17191F'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewBrandColor(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        newBrandColor === color ? 'scale-110 border-black dark:border-white ring-2 ring-[#5268D8]' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 border rounded-xl text-xs font-medium text-[#68717E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5268D8] text-white rounded-xl text-xs font-semibold"
                >
                  Simpan Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Brand */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl max-w-md w-full p-5 border border-[#E7E9ED] dark:border-[#292E38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <h3 className="text-sm font-bold text-[#17191F] dark:text-[#E9EBF0]">
                Edit Informasi Brand: {activeBrand.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded text-[#68717E] hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  NAMA BRAND
                </label>
                <input
                  type="text"
                  value={editBrandName}
                  onChange={e => setEditBrandName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  KATEGORI
                </label>
                <input
                  type="text"
                  value={editBrandCategory}
                  onChange={e => setEditBrandCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  DESKRIPSI
                </label>
                <textarea
                  rows={3}
                  value={editBrandDesc}
                  onChange={e => setEditBrandDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 border rounded-xl text-xs text-[#68717E]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveBrandEdits}
                  className="px-4 py-1.5 bg-[#5268D8] text-white rounded-xl text-xs font-semibold"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
