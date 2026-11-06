import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Calendar,
  Layers,
  X,
  Check,
  Sparkles
} from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const {
    campaigns,
    activeBrand,
    activeBrandId,
    switchBrand,
    brands,
    selectedCampaignId,
    setSelectedCampaignId,
    createCampaign,
    navigateTo,
    showToast
  } = useApp();

  const brandCampaigns = campaigns.filter(c => c.brandId === activeBrand.id);
  const activeCampaign = brandCampaigns.find(c => c.id === selectedCampaignId) || brandCampaigns[0];

  // Dropdowns and modals
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'DRAFT' | 'COMPLETED'>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFunnelModalOpen, setIsFunnelModalOpen] = useState(false);

  // Create Campaign Form
  const [newCampName, setNewCampName] = useState('');
  const [newCampObjective, setNewCampObjective] = useState('');
  const [newCampAudience, setNewCampAudience] = useState('');
  const [newCampKeyMessage, setNewCampKeyMessage] = useState('');
  const [newCampStartDate, setNewCampStartDate] = useState('2025-10-05');
  const [newCampEndDate, setNewCampEndDate] = useState('2025-11-15');

  // Funnel composition state
  const [tofuPct, setTofuPct] = useState(50);
  const [mofuPct, setMofuPct] = useState(30);
  const [bofuPct, setBofuPct] = useState(20);

  const handleOpenCreateCampaign = () => {
    setNewCampName('');
    setNewCampObjective('Meningkatkan awareness produk baru melalui edukasi seduh.');
    setNewCampAudience(activeBrand.personas[0]?.role || 'Penggemar kopi manual');
    setNewCampKeyMessage('Kopi single origin terbaik dipetik segar langsung dari petani.');
    setIsCreateModalOpen(true);
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) {
      showToast('Nama campaign harus diisi.');
      return;
    }

    createCampaign({
      brandId: activeBrand.id,
      name: newCampName.trim(),
      objective: newCampObjective,
      targetAudience: newCampAudience,
      startDate: newCampStartDate,
      endDate: newCampEndDate,
      status: 'ACTIVE',
      keyMessage: newCampKeyMessage,
      funnelDistribution: {
        tofu: tofuPct,
        mofu: mofuPct,
        bofu: bofuPct
      },
      contentCount: 10,
      publishedCount: 0
    });

    setIsCreateModalOpen(false);
    showToast(`Campaign "${newCampName}" berhasil dibuat untuk ${activeBrand.name}.`);
  };

  const handleSaveFunnelComposition = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = Number(tofuPct) + Number(mofuPct) + Number(bofuPct);
    if (sum !== 100) {
      showToast(`Total alokasi funnel harus 100% (saat ini ${sum}%).`);
      return;
    }

    if (activeCampaign) {
      activeCampaign.funnelDistribution = {
        tofu: Number(tofuPct),
        mofu: Number(mofuPct),
        bofu: Number(bofuPct)
      };
    }

    setIsFunnelModalOpen(false);
    showToast('Komposisi funnel campaign berhasil disesuaikan.');
  };

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">
            Campaign management
          </h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            {brandCampaigns.length} campaign · {activeBrand.name} · alokasi fleksibel per campaign
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap relative">
          {/* Brand Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsBrandDropdownOpen(!isBrandDropdownOpen);
                setIsStatusDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 shadow-2xs"
            >
              <span>Brand: {activeBrand.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-[#68717E]" />
            </button>

            {isBrandDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
                {brands.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      switchBrand(b.id);
                      setIsBrandDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      b.id === activeBrandId ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                setIsBrandDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 shadow-2xs"
            >
              <span>{statusFilter === 'all' ? 'Semua status' : statusFilter}</span>
              <ChevronDown className="w-3 h-3 text-[#68717E]" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
                {['all', 'ACTIVE', 'DRAFT', 'COMPLETED'].map(st => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st as any);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      statusFilter === st ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                    }`}
                  >
                    {st === 'all' ? 'Semua status' : st}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenCreateCampaign}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Campaign baru</span>
          </button>
        </div>
      </div>

      {/* 2. Main Layout (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Campaign List & Timeline (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Campaigns Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Campaign aktif
                </h3>
                <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  progres dihitung dari status konten
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className="text-xs text-[#5268D8] dark:text-[#8292F0] hover:underline cursor-pointer"
              >
                Semua campaign
              </button>
            </div>

            {/* Campaign Cards List */}
            <div className="space-y-4">
              {brandCampaigns.map(cmp => {
                const isSelected = cmp.id === activeCampaign?.id;
                const tofu = cmp.funnelDistribution?.tofu ?? cmp.funnelDistribution?.TOFU ?? 50;
                const mofu = cmp.funnelDistribution?.mofu ?? cmp.funnelDistribution?.MOFU ?? 30;
                const bofu = cmp.funnelDistribution?.bofu ?? cmp.funnelDistribution?.BOFU ?? 20;

                return (
                  <div
                    key={cmp.id}
                    onClick={() => setSelectedCampaignId(cmp.id)}
                    className={`p-4 rounded-[10px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#5268D8] ring-1 ring-[#5268D8] bg-[#FAFAFD] dark:bg-[#202534]'
                        : 'border-[#E7E9ED] dark:border-[#2E3442] hover:border-neutral-400 bg-white dark:bg-[#1B1E25]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                          {cmp.name}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#E6F4EA] text-[#1E8E3E] font-semibold">
                          ● AKTIF
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#68717E]" />
                    </div>

                    <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mb-3">
                      Awareness → Conversion · {cmp.startDate} - {cmp.endDate}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#68717E]">Progres</span>
                        <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">
                          {cmp.publishedCount ?? 6}/{cmp.contentCount ?? 12} konten
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 dark:bg-[#292E38] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5268D8] rounded-full"
                          style={{
                            width: `${
                              cmp.publishedCount && cmp.contentCount
                                ? Math.round((cmp.publishedCount / cmp.contentCount) * 100)
                                : 50
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Funnel Distribution Bar */}
                    <div className="flex items-center gap-1 h-2 mt-3 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C7D0FA] dark:bg-[#3E4A7A] h-full"
                        style={{ width: `${tofu}%` }}
                      />
                      <div
                        className="bg-[#8292F0] h-full"
                        style={{ width: `${mofu}%` }}
                      />
                      <div
                        className="bg-[#5268D8] h-full"
                        style={{ width: `${bofu}%` }}
                      />
                    </div>

                    {/* Funnel Stats & Actions */}
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#E7E9ED]/60 dark:border-[#2E3442] text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                      <div className="flex items-center gap-3">
                        <span>● TOFU {tofu}%</span>
                        <span>● MOFU {mofu}%</span>
                        <span>● BOFU {bofu}%</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('creative');
                        }}
                        className="text-[#5268D8] dark:text-[#8292F0] font-semibold hover:underline cursor-pointer"
                      >
                        Kelola konten →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Campaign */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Timeline campaign
              </h3>
              <span className="text-[10px] font-mono text-[#68717E]">Sep – Nov 2025</span>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center text-[10px] font-mono text-[#68717E] border-b border-[#E7E9ED] dark:border-[#292E38] pb-1">
                <span className="w-32">SEP</span>
                <span className="w-32">OKT</span>
                <span className="w-32">NOV</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[11px] font-medium block text-[#17191F] dark:text-[#E9EBF0] mb-1">Panen Raya Gayo</span>
                  <div className="h-3 w-3/4 rounded-full bg-[#5268D8]" />
                </div>
                <div>
                  <span className="text-[11px] font-medium block text-[#17191F] dark:text-[#E9EBF0] mb-1">Bundling Oktober</span>
                  <div className="h-3 w-1/2 ml-36 rounded-full bg-[#21A68A]" />
                </div>
                <div>
                  <span className="text-[11px] font-medium block text-[#17191F] dark:text-[#E9EBF0] mb-1">Ngopi di Rumah</span>
                  <div className="h-3 w-1/3 ml-20 rounded-full bg-[#E4A44A]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Campaign Detail Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {activeCampaign && (
            <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-5">
              <div className="pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                    {activeCampaign.name}
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#E6F4EA] text-[#1E8E3E] font-semibold">
                    ● AKTIF
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                  {activeCampaign.startDate} – {activeCampaign.endDate} · {activeBrand.name}
                </p>
              </div>

              {/* Campaign Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block">
                    OBJECTIVE
                  </span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] mt-0.5 leading-relaxed">
                    {activeCampaign.objective}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block">
                    AUDIENS
                  </span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] mt-0.5 leading-relaxed">
                    {activeCampaign.targetAudience}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block">
                    KEY MESSAGE
                  </span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] mt-0.5 leading-relaxed font-semibold">
                    {activeCampaign.keyMessage}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block">
                    PRODUK & PILLAR
                  </span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] mt-0.5">
                    Gayo 200g · Cerita petani · Edukasi seduh
                  </p>
                </div>
              </div>

              {/* Komposisi Funnel */}
              <div className="pt-3 border-t border-[#E7E9ED] dark:border-[#292E38] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">
                    Komposisi funnel
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTofuPct(activeCampaign.funnelDistribution?.tofu ?? 50);
                      setMofuPct(activeCampaign.funnelDistribution?.mofu ?? 30);
                      setBofuPct(activeCampaign.funnelDistribution?.bofu ?? 20);
                      setIsFunnelModalOpen(true);
                    }}
                    className="text-xs text-[#5268D8] hover:underline font-semibold cursor-pointer"
                  >
                    Ubah
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>TOFU Awareness</span>
                      <span className="font-mono">{activeCampaign.funnelDistribution?.tofu ?? 50}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-[#20242D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C7D0FA] dark:bg-[#3E4A7A] rounded-full"
                        style={{ width: `${activeCampaign.funnelDistribution?.tofu ?? 50}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>MOFU Consideration</span>
                      <span className="font-mono">{activeCampaign.funnelDistribution?.mofu ?? 30}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-[#20242D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8292F0] rounded-full"
                        style={{ width: `${activeCampaign.funnelDistribution?.mofu ?? 30}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>BOFU Conversion</span>
                      <span className="font-mono">{activeCampaign.funnelDistribution?.bofu ?? 20}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-[#20242D] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5268D8] rounded-full"
                        style={{ width: `${activeCampaign.funnelDistribution?.bofu ?? 20}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-[#68717E]">
                  Komposisi fleksibel per campaign — tidak ada persentase kaku global.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('creative')}
                  className="flex-1 py-2 rounded-[8px] bg-[#5268D8] hover:bg-[#4357C5] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Kelola konten
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('analytics')}
                  className="px-4 py-2 rounded-[8px] border border-[#E7E9ED] dark:border-[#383F4C] text-[#17191F] dark:text-[#E9EBF0] text-xs font-medium hover:bg-neutral-50 dark:hover:bg-[#20242D] cursor-pointer"
                >
                  Evaluasi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Campaign Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl max-w-md w-full p-5 border border-[#E7E9ED] dark:border-[#292E38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <h3 className="text-sm font-bold text-[#17191F] dark:text-[#E9EBF0]">
                Buat Campaign Baru ({activeBrand.name})
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-[#68717E] hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  NAMA CAMPAIGN
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Panen Raya Gayo Batch 2"
                  value={newCampName}
                  onChange={e => setNewCampName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  OBJECTIVE
                </label>
                <input
                  type="text"
                  value={newCampObjective}
                  onChange={e => setNewCampObjective(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                  KEY MESSAGE
                </label>
                <input
                  type="text"
                  value={newCampKeyMessage}
                  onChange={e => setNewCampKeyMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-neutral-50 dark:bg-[#20242D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                    MULAI
                  </label>
                  <input
                    type="date"
                    value={newCampStartDate}
                    onChange={e => setNewCampStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded-xl bg-neutral-50 dark:bg-[#20242D] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#68717E] mb-1">
                    SELESAI
                  </label>
                  <input
                    type="date"
                    value={newCampEndDate}
                    onChange={e => setNewCampEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded-xl bg-neutral-50 dark:bg-[#20242D] font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 border rounded-xl text-xs text-[#68717E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5268D8] text-white rounded-xl text-xs font-semibold"
                >
                  Simpan Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ubah Komposisi Funnel */}
      {isFunnelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl max-w-sm w-full p-5 border border-[#E7E9ED] dark:border-[#292E38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <h3 className="text-sm font-bold text-[#17191F] dark:text-[#E9EBF0]">
                Ubah Komposisi Funnel
              </h3>
              <button
                type="button"
                onClick={() => setIsFunnelModalOpen(false)}
                className="p-1 rounded text-[#68717E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFunnelComposition} className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#17191F] dark:text-[#E9EBF0]">TOFU Awareness</span>
                  <span className="font-mono font-bold text-[#5268D8]">{tofuPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={tofuPct}
                  onChange={e => setTofuPct(Number(e.target.value))}
                  className="w-full accent-[#5268D8]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#17191F] dark:text-[#E9EBF0]">MOFU Consideration</span>
                  <span className="font-mono font-bold text-[#8292F0]">{mofuPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={mofuPct}
                  onChange={e => setMofuPct(Number(e.target.value))}
                  className="w-full accent-[#8292F0]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-[#17191F] dark:text-[#E9EBF0]">BOFU Conversion</span>
                  <span className="font-mono font-bold text-[#1E8E3E]">{bofuPct}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={bofuPct}
                  onChange={e => setBofuPct(Number(e.target.value))}
                  className="w-full accent-[#1E8E3E]"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-[#20242D] flex justify-between font-mono text-[11px]">
                <span>TOTAL:</span>
                <span className={Number(tofuPct) + Number(mofuPct) + Number(bofuPct) === 100 ? 'text-[#1E8E3E] font-bold' : 'text-red-500 font-bold'}>
                  {Number(tofuPct) + Number(mofuPct) + Number(bofuPct)}% (harus 100%)
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsFunnelModalOpen(false)}
                  className="px-3 py-1.5 border rounded-xl text-xs text-[#68717E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5268D8] text-white rounded-xl text-xs font-semibold"
                >
                  Simpan Komposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
