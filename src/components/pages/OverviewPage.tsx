import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Layers,
  Plus,
  Sparkles,
  Info,
  Check,
  ArrowRight,
  ChevronDown
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    contentItems,
    createContentItem,
    navigateTo,
    activeBrand,
    activeBrandId,
    switchBrand,
    brands,
    approveContentItem,
    showToast
  } = useApp();

  const [trendMetric, setTrendMetric] = useState<'reach' | 'impresi' | 'engage'>('reach');
  const [period, setPeriod] = useState<'7' | '30' | '90' | '365'>('30');
  const [mobilePeriod, setMobilePeriod] = useState<'30' | '90'>('30');

  // Dropdown states
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isMobileBrandDropdownOpen, setIsMobileBrandDropdownOpen] = useState(false);

  const pendingApprovals = contentItems.filter(
    c => c.status === 'IN_REVIEW'
  );

  const handleCreateNewContent = () => {
    const item = createContentItem({ brandId: activeBrand.id });
    navigateTo('creative', { contentId: item.id });
    showToast(`Brief baru "${item.title}" dibuat di Creative Studio.`);
  };

  const periodLabels: Record<string, string> = {
    '7': '7 hari terakhir',
    '30': '30 hari terakhir',
    '90': '90 hari terakhir',
    '365': '12 bulan terakhir'
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">
            Overview
          </h1>
          <p className="text-[11px] sm:text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            {activeBrand.name} · 1–30 Sep 2025 · 4 akun terhubung · sinkron 09:12 WIB
          </p>
        </div>

        {/* Desktop Controls (hidden on mobile) */}
        <div className="hidden sm:flex items-center gap-2.5 flex-wrap relative">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDateDropdownOpen(!isDateDropdownOpen);
                setIsBrandDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#68717E]" />
              <span>{periodLabels[period]}</span>
              <span className="text-[10px] text-[#68717E]">▼</span>
            </button>

            {isDateDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-30 p-1">
                {(['7', '30', '90', '365'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setPeriod(p);
                      setIsDateDropdownOpen(false);
                      showToast(`Periode diubah ke ${periodLabels[p]}.`);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      period === p ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                    }`}
                  >
                    {periodLabels[p]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brand Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsBrandDropdownOpen(!isBrandDropdownOpen);
                setIsDateDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 transition-colors shadow-2xs"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: activeBrand.themeColor || '#B85D2A' }}
              />
              <span className="truncate max-w-[130px]">{activeBrand.name}</span>
              <span className="text-[10px] text-[#68717E]">▼</span>
            </button>

            {isBrandDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-30 p-1">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      switchBrand(brand.id);
                      setIsBrandDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      brand.id === activeBrandId ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                    }`}
                  >
                    <span className="truncate">{brand.name}</span>
                    <span className="text-[10px] font-mono text-[#68717E]">{brand.campaignCount}c</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleCreateNewContent}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] active:bg-[#384AB5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Konten baru</span>
          </button>
        </div>

        {/* Mobile Filter Row matching Mobile_Overview_b7eb7d5c.png with working dropdown */}
        <div className="flex sm:hidden items-center justify-between gap-2 pt-1 relative">
          <div className="relative">
            <button
              onClick={() => setIsMobileBrandDropdownOpen(!isMobileBrandDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] shadow-xs cursor-pointer"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: activeBrand.themeColor || '#B85D2A' }}
              />
              <span className="truncate max-w-[120px]">{activeBrand.name}</span>
              <ChevronDown className="w-3 h-3 text-[#68717E]" />
            </button>

            {isMobileBrandDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-30 p-1">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => {
                      switchBrand(brand.id);
                      setIsMobileBrandDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      brand.id === activeBrandId ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-[#ECEEEF] dark:bg-[#20242D] p-0.5 rounded-xl text-xs font-medium">
            <button
              onClick={() => setMobilePeriod('30')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                mobilePeriod === '30'
                  ? 'bg-white dark:bg-[#2B303E] text-[#17191F] dark:text-[#E9EBF0] shadow-2xs font-semibold'
                  : 'text-[#68717E] dark:text-[#9BA3B2]'
              }`}
            >
              30 hari
            </button>
            <button
              onClick={() => setMobilePeriod('90')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                mobilePeriod === '90'
                  ? 'bg-white dark:bg-[#2B303E] text-[#17191F] dark:text-[#E9EBF0] shadow-2xs font-semibold'
                  : 'text-[#68717E] dark:text-[#9BA3B2]'
              }`}
            >
              90 hari
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Row */}
      {/* Mobile 2x2 Metric Card matching Mobile_Overview_b7eb7d5c.png */}
      <div className="sm:hidden bg-white dark:bg-[#1B1E25] rounded-2xl border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-xs">
        <div className="grid grid-cols-2 gap-y-4 gap-x-3">
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] block">
              REACH
            </span>
            <div className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] mt-0.5 tabular-nums">
              1,28 jt
            </div>
            <span className="text-[11px] font-mono text-[#21A68A] block mt-0.5">
              +12,4% <span className="text-[#68717E] dark:text-[#9BA3B2]">Meta</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] block">
              IMPRESI
            </span>
            <div className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] mt-0.5 tabular-nums">
              3,04 jt
            </div>
            <span className="text-[11px] font-mono text-[#21A68A] block mt-0.5">
              +8,1% <span className="text-[#68717E] dark:text-[#9BA3B2]">Meta + TikTok</span>
            </span>
          </div>

          <div className="pt-3 border-t border-[#F1F3F5] dark:border-[#242A36]">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] block">
              ENGAGEMENT
            </span>
            <div className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] mt-0.5 tabular-nums">
              4,7%
            </div>
            <span className="text-[11px] font-mono text-[#21A68A] block mt-0.5">
              +0,6 pt <span className="text-[#68717E] dark:text-[#9BA3B2]">5 platform</span>
            </span>
          </div>

          <div className="pt-3 border-t border-[#F1F3F5] dark:border-[#242A36]">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] block">
              FOLLOWERS
            </span>
            <div className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] mt-0.5 tabular-nums">
              +8.214
            </div>
            <span className="text-[11px] font-mono text-[#21A68A] block mt-0.5">
              +3,2% <span className="text-[#68717E] dark:text-[#9BA3B2]">IG + TikTok</span>
            </span>
          </div>
        </div>
      </div>

      {/* Desktop 5-Metric Strip with Dividers (hidden on mobile) */}
      <div className="hidden sm:block bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs">
        <div className="grid grid-cols-5 divide-x divide-[#E7E9ED] dark:divide-[#292E38]">
          <div className="pr-4">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
              REACH
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tabular-nums">
                1,28 jt
              </span>
              <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#21A68A]/10 text-[#21A68A] font-semibold">
                ↗ +12,4%
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-1 truncate">
              Meta Graph API · IG + FB
            </div>
          </div>

          <div className="px-4">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
              IMPRESI
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tabular-nums">
                3,04 jt
              </span>
              <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#21A68A]/10 text-[#21A68A] font-semibold">
                ↗ +8,1%
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-1 truncate">
              Meta + TikTok API
            </div>
          </div>

          <div className="px-4">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
              VIEWS
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tabular-nums">
                742 rb
              </span>
              <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#21A68A]/10 text-[#21A68A] font-semibold">
                ↗ +23,6%
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-1 truncate">
              YouTube Data API
            </div>
          </div>

          <div className="px-4">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
              ENGAGEMENT
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tabular-nums">
                4,7%
              </span>
              <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#21A68A]/10 text-[#21A68A] font-semibold">
                ↗ +0,6 pt
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-1 truncate">
              5 platform
            </div>
          </div>

          <div className="pl-4">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
              FOLLOWERS
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tabular-nums">
                +8.214
              </span>
              <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#21A68A]/10 text-[#21A68A] font-semibold">
                ↗ +3,2%
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-1 truncate">
              IG · TikTok
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pinterest Information Banner */}
      <div className="flex items-start sm:items-center gap-2 p-2.5 rounded-xl bg-neutral-100/70 dark:bg-[#1F232D] text-xs text-[#68717E] dark:text-[#9BA3B2] border border-[#E7E9ED]/70 dark:border-[#292E38]/70">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 sm:mt-0 text-[#68717E]" />
        <span className="leading-relaxed text-[11px] sm:text-xs">
          Reach & impresi Pinterest tidak tersedia — analytics API belum diotorisasi, sehingga tidak ditampilkan sebagai nol.
        </span>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {/* Tren Performa Chart Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl border border-[#E7E9ED] dark:border-[#292E38] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Tren performa
                </h3>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  Mingguan · 12 minggu terakhir · Meta + TikTok API
                </p>
              </div>

              {/* Segmented Metric Switcher */}
              <div className="flex items-center bg-neutral-100 dark:bg-[#20242D] p-0.5 rounded-lg border border-[#E7E9ED] dark:border-[#2E3442]">
                {(['reach', 'impresi', 'engage'] as const).map(met => (
                  <button
                    key={met}
                    onClick={() => setTrendMetric(met)}
                    className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer ${
                      trendMetric === met
                        ? 'bg-white dark:bg-[#2B303E] text-[#17191F] dark:text-[#E9EBF0] font-semibold shadow-2xs'
                        : 'text-[#68717E] dark:text-[#9BA3B2] hover:text-[#17191F]'
                    }`}
                  >
                    {met === 'reach' ? 'Reach' : met === 'impresi' ? 'Impresi' : 'Engage'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar Chart Visual with clean scroll on mobile */}
            <div className="overflow-x-auto pb-1">
              <div className="h-40 sm:h-44 min-w-[320px] pt-4 flex items-end justify-between gap-1.5 sm:gap-2">
                {[
                  { label: '14/7', height: '35%' },
                  { label: '21/7', height: '45%' },
                  { label: '28/7', height: '30%' },
                  { label: '4/8', height: '52%' },
                  { label: '11/8', height: '60%' },
                  { label: '18/8', height: '55%' },
                  { label: '25/8', height: '58%' },
                  { label: '1/9', height: '70%' },
                  { label: '8/9', height: '65%' },
                  { label: '15/9', height: '85%' },
                  { label: '22/9', height: '78%' },
                  { label: '29/9', height: '94%', active: true }
                ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div
                      className={`w-full rounded-t-[4px] transition-all ${
                        bar.active
                          ? 'bg-[#5268D8]'
                          : 'bg-[#C7D0FA] dark:bg-[#343C56] hover:bg-[#A8B6F7]'
                      }`}
                      style={{ height: bar.height }}
                    />
                    <span className="text-[9px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-2 block">
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-[#E7E9ED] dark:border-[#292E38] text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-3">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5268D8]" />
                  <span>29 Sep · 158 rb reach</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C7D0FA] dark:bg-[#343C56]" />
                  <span>Rata-rata 12 mgg · 112 rb</span>
                </div>
              </div>
              <span className="text-[#9BA3AF]">sumber: D1 analytics_daily</span>
            </div>
          </div>

          {/* Pipeline Konten Strip */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl border border-[#E7E9ED] dark:border-[#292E38] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-baseline gap-2">
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Pipeline konten
                </h3>
                <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  147 item aktif
                </span>
              </div>
              <button
                onClick={() => navigateTo('calendar')}
                className="text-xs text-[#5268D8] dark:text-[#8292F0] hover:underline flex items-center gap-1"
              >
                Kalender →
              </button>
            </div>

            {/* Segmented Pipeline Bar */}
            <div className="h-2.5 w-full bg-neutral-100 dark:bg-[#20242D] rounded-full overflow-hidden flex">
              <div style={{ width: '10%' }} className="bg-[#CBD5E1]" title="Idea: 14" />
              <div style={{ width: '6%' }} className="bg-[#94A3B8]" title="Brief: 9" />
              <div style={{ width: '5%' }} className="bg-[#E4A44A]" title="Produksi: 7" />
              <div style={{ width: '4%' }} className="bg-[#E29D52]" title="Review: 6" />
              <div style={{ width: '7%' }} className="bg-[#21A68A]" title="Approved: 10" />
              <div style={{ width: '8%' }} className="bg-[#5268D8]" title="Jadwal: 12" />
              <div style={{ width: '60%' }} className="bg-[#17191F] dark:bg-[#475569]" title="Published: 42" />
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-3 text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
              <div className="flex items-center justify-between sm:justify-start sm:gap-1.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" /> IDEA</span>
                <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">14</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start sm:gap-1.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" /> BRIEF</span>
                <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">9</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start sm:gap-1.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#E4A44A]" /> PRODUKSI</span>
                <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">7</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start sm:gap-1.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#E29D52]" /> REVIEW</span>
                <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">6</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start sm:gap-1.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#21A68A]" /> APPROVED</span>
                <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">10</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start sm:gap-1.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#5268D8]" /> JADWAL</span>
                <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">12</span>
              </div>
              <div className="flex items-center justify-between sm:justify-start sm:gap-1.5">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#17191F] dark:bg-[#475569]" /> PUBLISHED</span>
                <span className="font-bold text-[#17191F] dark:text-[#E9EBF0]">42</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4-5 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-5">
          {/* AI Insights Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl border border-[#E7E9ED] dark:border-[#292E38] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#5268D8] dark:text-[#8292F0]" />
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  AI insights
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#5268D8]/10 text-[#5268D8] dark:text-[#8292F0] font-semibold">
                ● GPT
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Item 1: PELUANG */}
              <div>
                <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#EEF2FF] dark:bg-[#252A38] text-[#5268D8] dark:text-[#8292F0] font-bold tracking-wider uppercase mb-1">
                  PELUANG
                </span>
                <p className="text-[#17191F] dark:text-[#E9EBF0] leading-relaxed">
                  Konten "single origin" mendapat engagement <strong>2,4× rata-rata</strong>. Tambah 2 slot Reel sebelum 15 Okt.
                </p>
                <button
                  onClick={() => createContentItem({ brandId: activeBrand.id })}
                  className="text-xs font-semibold text-[#5268D8] dark:text-[#8292F0] hover:underline mt-1 block cursor-pointer"
                >
                  Buat brief →
                </button>
              </div>

              {/* Item 2: RISIKO */}
              <div className="pt-2 border-t border-[#E7E9ED]/60 dark:border-[#292E38]/60">
                <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#FEF3C7] dark:bg-[#342714] text-[#D97706] dark:text-[#FBBF24] font-bold tracking-wider uppercase mb-1">
                  RISIKO
                </span>
                <p className="text-[#17191F] dark:text-[#E9EBF0] leading-relaxed">
                  BOFU hanya 11% dari konten September — funnel tidak seimbang dibanding Agustus (19%).
                </p>
                <button
                  onClick={() => navigateTo('campaigns')}
                  className="text-xs font-semibold text-[#5268D8] dark:text-[#8292F0] hover:underline mt-1 block cursor-pointer"
                >
                  Tinjau funnel →
                </button>
              </div>

              {/* Item 3: TREN */}
              <div className="pt-2 border-t border-[#E7E9ED]/60 dark:border-[#292E38]/60">
                <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded-[4px] bg-[#EEF2FF] dark:bg-[#252A38] text-[#5268D8] dark:text-[#8292F0] font-bold tracking-wider uppercase mb-1">
                  TREN
                </span>
                <p className="text-[#17191F] dark:text-[#E9EBF0] leading-relaxed">
                  Format carousel turun 18% di IG, sementara Shorts naik 34%. Pertimbangkan realokasi.
                </p>
                <button
                  onClick={() => navigateTo('analytics')}
                  className="text-xs font-semibold text-[#5268D8] dark:text-[#8292F0] hover:underline mt-1 block cursor-pointer"
                >
                  Lihat analitik →
                </button>
              </div>
            </div>

            <div className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] pt-3 mt-3 border-t border-[#E7E9ED] dark:border-[#292E38]">
              Berdasarkan 30 hari data Arunika Coffee · output AI bukan approval
            </div>
          </div>

          {/* Menunggu Approval Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl border border-[#E7E9ED] dark:border-[#292E38] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Menunggu approval
                </h3>
                <span className="w-5 h-5 rounded-full bg-[#DC6470]/10 text-[#DC6470] flex items-center justify-center text-[10px] font-mono font-bold">
                  {pendingApprovals.length}
                </span>
              </div>
              <button
                onClick={() => navigateTo('publishing')}
                className="text-xs text-[#5268D8] dark:text-[#8292F0] hover:underline cursor-pointer"
              >
                Lihat semua
              </button>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-1.5 border-b border-[#E7E9ED]/50 dark:border-[#292E38]/50 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                      {item.format === 'instagram_reel' ? 'IG Reel' : item.format === 'instagram_carousel' ? 'IG Carousel' : 'YT Shorts'} · v{item.currentVersion} · 2 j lalu
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        approveContentItem(item.id);
                        showToast(`Konten "${item.title}" berhasil disetujui (APPROVED).`);
                      }}
                      className="w-7 h-7 rounded-lg bg-[#E6F4EA] hover:bg-[#D1EBD8] text-[#1E8E3E] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      title="Setujui (Approve)"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => navigateTo('creative', { contentId: item.id })}
                      className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-[#292E38] hover:bg-neutral-200 dark:hover:bg-[#343C4B] text-[#17191F] dark:text-[#E9EBF0] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                      title="Buka Brief"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jadwal Berikutnya Card (Mobile-friendly matching Mobile_Overview_b7eb7d5c.png) */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl border border-[#E7E9ED] dark:border-[#292E38] p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Jadwal berikutnya
              </h3>
              <button
                onClick={() => navigateTo('calendar')}
                className="text-xs text-[#5268D8] dark:text-[#8292F0] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                Kalender →
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#5268D8] font-bold">18:30</span>
                  <span className="font-sans text-[#17191F] dark:text-[#E9EBF0] font-medium">Ramadhan blend</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252B3B] dark:text-[#8292F0] font-semibold">
                  SCHEDULED
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#5268D8] font-bold">20:00</span>
                  <span className="font-sans text-[#17191F] dark:text-[#E9EBF0] font-medium">Cold brew shift</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252B3B] dark:text-[#8292F0] font-semibold">
                  SCHEDULED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
