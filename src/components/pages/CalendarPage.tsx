import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import type { ContentItem, SocialPlatform } from '../../types';

type CalendarView = 'month' | 'week' | 'list' | 'timeline';

const pad = (value: number) => String(value).padStart(2, '0');
const monthKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
const dateKey = (date: Date) => `${monthKey(date)}-${pad(date.getDate())}`;

const getPlatform = (format: ContentItem['format']): SocialPlatform => {
  if (format.startsWith('instagram_')) return 'instagram';
  if (format.startsWith('tiktok_')) return 'tiktok';
  if (format.startsWith('youtube_')) return 'youtube';
  if (format.startsWith('pinterest_')) return 'pinterest';
  return 'facebook';
};

const formatMonth = (key: string) => {
  const [year, month] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' })
    .format(new Date(year, month - 1, 1));
};

const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(new Date(value));

const formatTime = (value: string) => new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Jakarta'
}).format(new Date(value));

const startOfWeek = (date: Date) => {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - offset);
  return result;
};

export const CalendarPage: React.FC = () => {
  const { contentItems, activeBrand, campaigns, navigateTo, openScheduleModal } = useApp();
  const today = new Date();
  const [viewMode, setViewMode] = useState<CalendarView>('month');
  const [selectedMonth, setSelectedMonth] = useState(monthKey(today));
  const [selectedDate, setSelectedDate] = useState(dateKey(today));
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [funnelFilter, setFunnelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const brandCampaigns = campaigns.filter(campaign => campaign.brandId === activeBrand.id);
  const scheduledItems = useMemo(() => contentItems
    .filter(item => item.brandId === activeBrand.id && Boolean(item.scheduledFor))
    .sort((a, b) => new Date(a.scheduledFor!).getTime() - new Date(b.scheduledFor!).getTime()),
  [contentItems, activeBrand.id]);

  const filteredItems = useMemo(() => scheduledItems.filter(item => {
    const matchesCampaign = campaignFilter === 'all' || item.campaignId === campaignFilter;
    const matchesPlatform = platformFilter === 'all' || getPlatform(item.format) === platformFilter;
    const matchesFunnel = funnelFilter === 'all' || item.funnelStage === funnelFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesCampaign && matchesPlatform && matchesFunnel && matchesStatus;
  }), [scheduledItems, campaignFilter, platformFilter, funnelFilter, statusFilter]);

  const monthItems = filteredItems.filter(item => item.scheduledFor?.slice(0, 7) === selectedMonth);
  const selectedDayItems = monthItems.filter(item => item.scheduledFor?.slice(0, 10) === selectedDate);
  const selectedDay = new Date(`${selectedDate}T12:00:00`);
  const weekStart = startOfWeek(selectedDay);
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  const [year, month] = selectedMonth.split('-').map(Number);
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingDays = (firstOfMonth.getDay() + 6) % 7;
  const calendarCells = [
    ...Array.from({ length: leadingDays }, (_, index) => ({ date: null as Date | null, key: `blank-${index}` })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month - 1, index + 1);
      return { date, key: dateKey(date) };
    })
  ];
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push({ date: null, key: `tail-${calendarCells.length}` });
  }

  const moveMonth = (amount: number) => {
    const date = new Date(year, month - 1 + amount, 1);
    const nextMonth = monthKey(date);
    setSelectedMonth(nextMonth);
    setSelectedDate(dateKey(date));
  };

  const resetFilters = () => {
    setCampaignFilter('all');
    setPlatformFilter('all');
    setFunnelFilter('all');
    setStatusFilter('all');
    setSelectedMonth(monthKey(new Date()));
    setSelectedDate(dateKey(new Date()));
  };

  const openContent = (item: ContentItem) => navigateTo('creative', { contentId: item.id });

  const renderEvent = (item: ContentItem, compact = false) => (
    <button
      key={item.id}
      type="button"
      onClick={() => openContent(item)}
      className={`w-full text-left rounded-md border border-[#E7E9ED] dark:border-[#2E3442] bg-[#EEF2FF] dark:bg-[#202638] text-[#3447A5] dark:text-[#B6C2FF] hover:border-[#5268D8] transition-colors ${compact ? 'px-1.5 py-1 text-[9px]' : 'px-3 py-2.5 text-xs'}`}
      title={`${item.title} · ${item.status}`}
    >
      <span className="block truncate font-semibold">{item.title}</span>
      <span className="block truncate opacity-80">{formatTime(item.scheduledFor!)} · {item.status}</span>
    </button>
  );

  const renderDayList = (items: ContentItem[]) => items.length ? (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex items-start gap-3 rounded-xl border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-3">
          <div className="min-w-[62px] text-[11px] font-mono font-semibold text-[#5268D8] dark:text-[#8292F0]">
            {formatTime(item.scheduledFor!)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] truncate">{item.title}</p>
            <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
              {getPlatform(item.format)} · {item.funnelStage} · {item.status}
            </p>
          </div>
          <button type="button" onClick={() => openContent(item)} className="text-[10px] font-semibold text-[#5268D8] hover:underline">
            Buka
          </button>
        </div>
      ))}
    </div>
  ) : (
    <p className="py-8 text-center text-xs text-[#68717E] dark:text-[#9BA3B2]">Tidak ada konten terjadwal pada rentang ini.</p>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">Content calendar</h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            {activeBrand.name} · {monthItems.length} konten pada {formatMonth(selectedMonth)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 rounded-lg border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-1">
            <button type="button" aria-label="Bulan sebelumnya" onClick={() => moveMonth(-1)} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#292E38]"><ChevronLeft className="w-4 h-4"/></button>
            <span className="min-w-[120px] text-center text-xs font-semibold">{formatMonth(selectedMonth)}</span>
            <button type="button" aria-label="Bulan berikutnya" onClick={() => moveMonth(1)} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#292E38]"><ChevronRight className="w-4 h-4"/></button>
          </div>
          <button type="button" onClick={() => openScheduleModal()} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-lg text-xs font-semibold">
            <Plus className="w-3.5 h-3.5"/> Jadwalkan konten
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Filter campaign" value={campaignFilter} onChange={event => setCampaignFilter(event.target.value)} className="px-3 py-2 rounded-lg border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] text-xs">
          <option value="all">Semua campaign</option>
          {brandCampaigns.map(campaign => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
        </select>
        <select aria-label="Filter platform" value={platformFilter} onChange={event => setPlatformFilter(event.target.value)} className="px-3 py-2 rounded-lg border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] text-xs">
          <option value="all">Semua platform</option>
          {(['instagram', 'tiktok', 'youtube', 'facebook', 'pinterest'] as SocialPlatform[]).map(platform => <option key={platform} value={platform}>{platform}</option>)}
        </select>
        <select aria-label="Filter funnel" value={funnelFilter} onChange={event => setFunnelFilter(event.target.value)} className="px-3 py-2 rounded-lg border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] text-xs">
          <option value="all">Semua funnel</option>
          <option value="TOFU">TOFU</option><option value="MOFU">MOFU</option><option value="BOFU">BOFU</option>
        </select>
        <select aria-label="Filter status" value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="px-3 py-2 rounded-lg border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] text-xs">
          <option value="all">Semua status</option>
          {['SCHEDULED', 'QUEUED', 'PUBLISHED', 'FAILED', 'CANCELLED'].map(status => <option key={status} value={status}>{status}</option>)}
        </select>
        <button type="button" onClick={resetFilters} className="px-2 py-2 text-[11px] text-[#5268D8] hover:underline">Reset filter</button>
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-neutral-100 dark:bg-[#20242D] p-1 w-fit">
        {(['month', 'week', 'list', 'timeline'] as CalendarView[]).map(mode => (
          <button key={mode} type="button" onClick={() => setViewMode(mode)} aria-pressed={viewMode === mode} className={`px-3 py-1.5 rounded-md text-xs capitalize ${viewMode === mode ? 'bg-white dark:bg-[#2B303E] font-semibold shadow-sm text-[#17191F] dark:text-[#E9EBF0]' : 'text-[#68717E]'}`}>
            {mode === 'month' ? 'Bulan' : mode === 'week' ? 'Minggu' : mode === 'list' ? 'Daftar' : 'Timeline'}
          </button>
        ))}
      </div>

      {viewMode === 'month' && (
        <div className="rounded-xl border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-3 sm:p-5">
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] font-mono text-[#68717E]">
            {['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'].map(day => <span key={day}>{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map(cell => {
              if (!cell.date) return <div key={cell.key} className="min-h-[58px] sm:min-h-[90px] rounded-md bg-neutral-50/60 dark:bg-[#171A21]/60"/>;
              const key = dateKey(cell.date);
              const dayItems = monthItems.filter(item => item.scheduledFor?.slice(0, 10) === key);
              const selected = selectedDate === key;
              return (
                <div key={key} className={`min-h-[58px] sm:min-h-[90px] rounded-md border p-1 ${selected ? 'border-[#5268D8] bg-[#EEF2FF]/40 dark:bg-[#202638]' : 'border-transparent bg-neutral-50/70 dark:bg-[#20242D]/60'}`}>
                  <button type="button" onClick={() => setSelectedDate(key)} className={`text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded ${selected ? 'bg-[#5268D8] text-white' : 'text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-200 dark:hover:bg-[#343C4B]'}`}>
                    {cell.date.getDate()}
                  </button>
                  <div className="mt-1 space-y-1">
                    {dayItems.slice(0, 2).map(item => (
                      <button key={item.id} type="button" onClick={() => openContent(item)} className="block w-full truncate rounded bg-[#EEF2FF] dark:bg-[#252D49] px-1 py-0.5 text-left text-[8px] sm:text-[9px] text-[#3447A5] dark:text-[#B6C2FF]" title={item.title}>
                        {item.title}
                      </button>
                    ))}
                    {dayItems.length > 2 && <span className="block text-[8px] text-[#68717E]">+{dayItems.length - 2} lainnya</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border-t border-[#E7E9ED] dark:border-[#292E38] pt-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0]">{formatDate(selectedDate)}</span>
              <button type="button" onClick={() => openScheduleModal()} className="text-[10px] font-semibold text-[#5268D8] hover:underline">Tambah jadwal</button>
            </div>
            {renderDayList(selectedDayItems)}
          </div>
        </div>
      )}

      {viewMode === 'week' && (
        <div className="rounded-xl border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-3 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold">Minggu {formatDate(dateKey(weekDates[0]))} – {formatDate(dateKey(weekDates[6]))}</span>
            <button type="button" onClick={() => { const next = new Date(selectedDay); next.setDate(next.getDate() + 7); setSelectedDate(dateKey(next)); setSelectedMonth(monthKey(next)); }} className="text-[10px] text-[#5268D8] hover:underline">Minggu berikutnya</button>
          </div>
          {weekDates.map(date => {
            const key = dateKey(date);
            const items = filteredItems.filter(item => item.scheduledFor?.slice(0, 10) === key);
            return <div key={key} className="grid grid-cols-[110px_1fr] gap-3 border-t border-[#E7E9ED] dark:border-[#292E38] pt-3">
              <button type="button" onClick={() => setSelectedDate(key)} className="text-left text-[11px] font-semibold text-[#5268D8]">{formatDate(key)}</button>
              <div>{renderDayList(items)}</div>
            </div>;
          })}
        </div>
      )}

      {viewMode === 'list' && renderDayList(monthItems)}

      {viewMode === 'timeline' && (
        <div className="rounded-xl border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-3 sm:p-5">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold"><Clock className="w-4 h-4 text-[#5268D8]"/> Timeline publikasi</div>
          <div className="space-y-3">
            {monthItems.map(item => (
              <button key={item.id} type="button" onClick={() => openContent(item)} className="w-full grid grid-cols-[78px_1fr] gap-3 text-left border-l-2 border-[#5268D8] pl-3 py-1 hover:bg-neutral-50 dark:hover:bg-[#20242D] rounded-r-md">
                <span className="text-[10px] font-mono text-[#5268D8]">{formatTime(item.scheduledFor!)}</span>
                <span className="min-w-0"><span className="block text-xs font-semibold truncate">{item.title}</span><span className="block text-[10px] text-[#68717E]">{item.scheduledFor?.slice(0, 10)} · {getPlatform(item.format)} · {item.status}</span></span>
              </button>
            ))}
            {!monthItems.length && <p className="py-8 text-center text-xs text-[#68717E]">Tidak ada event pada bulan ini.</p>}
          </div>
        </div>
      )}
    </div>
  );
};
