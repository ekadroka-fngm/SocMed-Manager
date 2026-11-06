import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Send,
  MoreVertical,
  Layers
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { contentItems, activeBrand, campaigns, navigateTo, openScheduleModal, showToast } = useApp();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list' | 'timeline'>('month');

  // Interactive filters
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2025');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [funnelFilter, setFunnelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Open dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const brandCampaigns = campaigns.filter(c => c.brandId === activeBrand.id);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const handleResetFilters = () => {
    setSelectedMonth('Oktober 2025');
    setCampaignFilter('all');
    setPlatformFilter('all');
    setFunnelFilter('all');
    setStatusFilter('all');
    setOpenDropdown(null);
    showToast('Filter kalender berhasil di-reset.');
  };

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">
            Content calendar
          </h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            {selectedMonth} · 24 konten terjadwal · {activeBrand.name} · semua jam WIB
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Switcher */}
          <div className="flex items-center bg-white dark:bg-[#1B1E25] p-0.5 rounded-[8px] border border-[#E7E9ED] dark:border-[#292E38] text-xs">
            {(['month', 'week', 'list', 'timeline'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-[6px] font-medium capitalize transition-colors cursor-pointer ${
                  viewMode === mode
                    ? 'bg-neutral-100 dark:bg-[#292E38] text-[#17191F] dark:text-[#E9EBF0] font-semibold'
                    : 'text-[#68717E] hover:text-[#17191F]'
                }`}
              >
                {mode === 'month' ? 'Bulan' : mode === 'week' ? 'Minggu' : mode === 'list' ? 'Daftar' : 'Timeline'}
              </button>
            ))}
          </div>

          <button
            onClick={() => openScheduleModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Jadwalkan konten</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar Matching Reference with Interactive Dropdowns */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-[#17191F] dark:text-[#E9EBF0] relative">
        {/* Month Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('month')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] cursor-pointer shadow-2xs hover:border-[#5268D8]/50"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#68717E]" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3 h-3 text-[#68717E]" />
          </button>
          {openDropdown === 'month' && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
              {['September 2025', 'Oktober 2025', 'November 2025'].map(m => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    selectedMonth === m ? 'bg-[#EEF2FF] dark:bg-[#202534] text-[#5268D8] font-bold' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Campaign Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('campaign')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] cursor-pointer shadow-2xs hover:border-[#5268D8]/50"
          >
            <span>
              {campaignFilter === 'all'
                ? 'Semua campaign'
                : brandCampaigns.find(c => c.id === campaignFilter)?.name || 'Campaign'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#68717E]" />
          </button>
          {openDropdown === 'campaign' && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
              <button
                onClick={() => {
                  setCampaignFilter('all');
                  setOpenDropdown(null);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                  campaignFilter === 'all' ? 'bg-[#EEF2FF] text-[#5268D8] font-bold' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                }`}
              >
                Semua campaign
              </button>
              {brandCampaigns.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCampaignFilter(c.id);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors truncate ${
                    campaignFilter === c.id ? 'bg-[#EEF2FF] text-[#5268D8] font-bold' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Platform Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('platform')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] cursor-pointer shadow-2xs hover:border-[#5268D8]/50"
          >
            <span className="capitalize">{platformFilter === 'all' ? 'Semua platform' : platformFilter}</span>
            <ChevronDown className="w-3 h-3 text-[#68717E]" />
          </button>
          {openDropdown === 'platform' && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
              {['all', 'instagram', 'tiktok', 'youtube', 'facebook'].map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setPlatformFilter(p);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors capitalize ${
                    platformFilter === p ? 'bg-[#EEF2FF] text-[#5268D8] font-bold' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  {p === 'all' ? 'Semua platform' : p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Funnel Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('funnel')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] cursor-pointer shadow-2xs hover:border-[#5268D8]/50"
          >
            <span>{funnelFilter === 'all' ? 'Semua funnel' : funnelFilter}</span>
            <ChevronDown className="w-3 h-3 text-[#68717E]" />
          </button>
          {openDropdown === 'funnel' && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
              {['all', 'TOFU', 'MOFU', 'BOFU'].map(f => (
                <button
                  key={f}
                  onClick={() => {
                    setFunnelFilter(f);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    funnelFilter === f ? 'bg-[#EEF2FF] text-[#5268D8] font-bold' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  {f === 'all' ? 'Semua funnel' : f}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('status')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] cursor-pointer shadow-2xs hover:border-[#5268D8]/50"
          >
            <span>{statusFilter === 'all' ? 'Semua status' : statusFilter}</span>
            <ChevronDown className="w-3 h-3 text-[#68717E]" />
          </button>
          {openDropdown === 'status' && (
            <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
              {['all', 'DRAFT', 'IN_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    statusFilter === s ? 'bg-[#EEF2FF] text-[#5268D8] font-bold' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  {s === 'all' ? 'Semua status' : s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="text-[11px] font-mono text-[#68717E] hover:text-[#5268D8] dark:hover:text-[#8292F0] ml-auto cursor-pointer"
        >
          Reset filter <span className="text-[#17191F] dark:text-[#E9EBF0]">(24 konten · 6 menunggu approval)</span>
        </button>
      </div>

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Desktop Calendar Grid (hidden on mobile) */}
        <div className="hidden sm:block lg:col-span-8 bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-px border-b border-[#E7E9ED] dark:border-[#292E38] pb-2 text-center text-[10px] font-mono uppercase text-[#68717E]">
            <span>SEN</span>
            <span>SEL</span>
            <span>RAB</span>
            <span>KAM</span>
            <span>JUM</span>
            <span>SAB</span>
            <span>MIN</span>
          </div>

          {/* Month Cells Grid */}
          <div className="grid grid-cols-7 gap-1 pt-2 text-xs">
            {/* Week 1 */}
            <div className="min-h-[72px] p-1.5 border border-transparent rounded-[6px] text-neutral-400">29</div>
            <div className="min-h-[72px] p-1.5 border border-transparent rounded-[6px] text-neutral-400">30</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]">
              <span className="font-semibold">1</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#5268D8] mt-1" />
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[8px] border-2 border-[#17191F] dark:border-white bg-[#EEF2FF]/40 dark:bg-[#22283A]">
              <span className="w-5 h-5 rounded-full bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] flex items-center justify-center font-bold text-[10px]">2</span>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]">
              <span className="font-semibold">3</span>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]">
              <span className="font-semibold">4</span>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]">
              <span className="font-semibold">5</span>
            </div>

            {/* Week 2 */}
            <div className="min-h-[72px] p-1.5 rounded-[6px]">6</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">7</span>
              <div className="text-[9px] p-1 rounded bg-[#FEF3C7] text-[#D97706] truncate">Bundling teaser ●</div>
              <div className="text-[9px] p-1 rounded bg-[#E6F4EA] text-[#1E8E3E] truncate">Q&A petani ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">8</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">9</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Cold brew shift ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">10</span>
              <div className="text-[9px] p-1 rounded bg-[#FEF3C7] text-[#D97706] truncate">Panen Gayo ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">11</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">12</div>

            {/* Week 3 */}
            <div className="min-h-[72px] p-1.5 rounded-[6px]">13</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">14</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Profil petani ●</div>
              <div className="text-[9px] p-1 rounded bg-neutral-200 text-neutral-800 truncate">Kuis biji ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">15</span>
              <div className="text-[9px] p-1 rounded bg-[#E6F4EA] text-[#1E8E3E] truncate">Panen Raya ●</div>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Uji V60 ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">16</span>
              <div className="text-[9px] p-1 rounded bg-[#FEF3C7] text-[#D97706] truncate">Harga transparan ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">17</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Kesalahan simpan ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">18</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">19</div>

            {/* Week 4 */}
            <div className="min-h-[72px] p-1.5 rounded-[6px]">20</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">21</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Seri seduh #2 ●</div>
              <div className="text-[9px] p-1 rounded bg-[#FEE2E2] text-[#DC2626] truncate">Promo bundling ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">22</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Behind cupping ●</div>
              <div className="text-[9px] p-1 rounded bg-[#E6F4EA] text-[#1E8E3E] truncate">Testimoni ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">23</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">24</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Panen Raya final ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">25</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px]">26</div>

            {/* Week 5 */}
            <div className="min-h-[72px] p-1.5 rounded-[6px]">27</div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">28</span>
              <div className="text-[9px] p-1 rounded bg-[#E6F4EA] text-[#1E8E3E] truncate">Q&A seduh ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">29</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Seri seduh #3 ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">30</span>
              <div className="text-[9px] p-1 rounded bg-[#FEF3C7] text-[#D97706] truncate">Promo akhir bulan ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 rounded-[6px] bg-neutral-50/70 dark:bg-[#20242D] space-y-1">
              <span className="font-semibold">31</span>
              <div className="text-[9px] p-1 rounded bg-[#EEF2FF] text-[#5268D8] truncate">Rekap panen ●</div>
            </div>
            <div className="min-h-[72px] p-1.5 text-neutral-400">1</div>
            <div className="min-h-[72px] p-1.5 text-neutral-400">2</div>
          </div>
        </div>

        {/* Mobile Week Strip + Event List (matching Mobile_Calendar_8cb0133a.png) */}
        <div className="sm:hidden space-y-4">
          {/* Week Day Strip */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-3 shadow-2xs">
            <div className="grid grid-cols-7 gap-1 text-center">
              {[
                { day: 'SEN', num: '29', isCurrent: false },
                { day: 'SEL', num: '30', isCurrent: false },
                { day: 'RAB', num: '1', isCurrent: false },
                { day: 'KAM', num: '2', isCurrent: true },
                { day: 'JUM', num: '3', isCurrent: false },
                { day: 'SAB', num: '4', isCurrent: false },
                { day: 'MIN', num: '5', isCurrent: false }
              ].map((d, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded-[8px] flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    d.isCurrent
                      ? 'bg-[#17191F] dark:bg-white text-white dark:text-[#17191F]'
                      : 'hover:bg-neutral-50 dark:hover:bg-[#20242D] text-[#68717E] dark:text-[#9BA3B2]'
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase">{d.day}</span>
                  <span className={`text-xs font-bold mt-0.5 ${d.isCurrent ? 'font-mono' : ''}`}>{d.num}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grouped Events */}
          <div className="space-y-4">
            {/* Hari Ini */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] block">
                HARI INI · 2 OKT
              </span>
              <div className="space-y-2">
                <div className="p-3.5 rounded-[10px] bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#5268D8] dark:text-[#8292F0]">18:30 WIB</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252A38] dark:text-[#8292F0]">
                      SCHEDULED
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                    Cerita panen Gayo 2025
                  </h4>
                  <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                    IG Reel · v3 · Arunika Coffee
                  </p>
                </div>

                <div className="p-3.5 rounded-[10px] bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-[#1E8E3E]">09:00 WIB</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-[#E6F4EA] text-[#1E8E3E] dark:bg-[#1C372B] dark:text-[#34D399]">
                      PUBLISHED
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                    Behind the roast
                  </h4>
                  <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                    IG Story · v2 · Arunika Coffee
                  </p>
                </div>
              </div>
            </div>

            {/* Jumat */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] block">
                JUMAT · 3 OKT
              </span>
              <div className="p-3.5 rounded-[10px] bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#D97706]">12:15 WIB</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-[#FEF3C7] text-[#D97706] dark:bg-[#382D1B] dark:text-[#FBBF24]">
                    IN_REVIEW
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                  Perbandingan metode seduh V60 vs Aeropress
                </h4>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  YT Shorts · v1 · Arunika Coffee
                </p>
              </div>
            </div>

            {/* Minggu */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] block">
                MINGGU · 5 OKT
              </span>
              <div className="p-3.5 rounded-[10px] bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#5268D8] dark:text-[#8292F0]">10:00 WIB</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252A38] dark:text-[#8292F0]">
                    APPROVED
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                  Promo bundling Oktober 2x200g
                </h4>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  IG Carousel · v2 · Arunika Coffee
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Column: Day Detail & Antrean Publishing (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Kamis, 2 Okt Detail Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <div>
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Kamis, 2 Okt
                </h3>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  2 konten · 1 antre
                </p>
              </div>
              <button
                type="button"
                onClick={() => openScheduleModal()}
                title="Jadwalkan konten di tanggal ini"
                className="w-6 h-6 rounded-[6px] border border-[#E7E9ED] dark:border-[#383F4C] flex items-center justify-center text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-[9px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-[#5268D8]">18:30</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EEF2FF] text-[#5268D8] font-bold">
                    SCHEDULED
                  </span>
                </div>
                <h4 className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">
                  Ramadhan blend: cerita petani
                </h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#68717E]">
                  <span>IG Reel · v3</span>
                  <MoreVertical className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-3 rounded-[9px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold text-[#1E8E3E]">09:00</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#E6F4EA] text-[#1E8E3E] font-bold">
                    PUBLISHED
                  </span>
                </div>
                <h4 className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">
                  Behind the roast
                </h4>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#68717E]">
                  <span>IG Story · v3</span>
                  <MoreVertical className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Antrean Publishing Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <span className="text-xs font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Antrean publishing
              </span>
              <span className="text-[10px] font-mono text-[#68717E]">3 job</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-[6px] bg-neutral-50 dark:bg-[#20242D]">
                <div>
                  <span className="font-mono text-[10px] text-[#5268D8] mr-2">18:30</span>
                  <span className="font-medium text-[#17191F] dark:text-[#E9EBF0]">Ramadhan blend · IG</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[6px] bg-neutral-50 dark:bg-[#20242D]">
                <div>
                  <span className="font-mono text-[10px] text-[#5268D8] mr-2">20:00</span>
                  <span className="font-medium text-[#17191F] dark:text-[#E9EBF0]">Cold brew · TikTok</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-[6px] bg-neutral-50 dark:bg-[#20242D]">
                <div>
                  <span className="font-mono text-[10px] text-[#68717E] mr-2">besok 09:00</span>
                  <span className="font-medium text-[#17191F] dark:text-[#E9EBF0]">Profil petani · IG</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-[#68717E] pt-2 border-t border-[#E7E9ED] dark:border-[#292E38]">
              Konten belum approved tidak masuk antrean aktif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
