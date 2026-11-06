import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Check,
  RotateCcw,
  Calendar,
  Layers,
  ChevronRight,
  Send,
  Eye,
  AlertTriangle
} from 'lucide-react';

export const PublishingPage: React.FC = () => {
  const {
    contentItems,
    approveContentItem,
    requestChangesOnItem,
    publishingJobs,
    retryPublishingJob,
    navigateTo,
    openScheduleModal,
    showToast
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDropdown, setOpenDropdown] = useState<'platform' | 'status' | null>(null);

  const pendingApprovals = contentItems.filter(c => c.status === 'IN_REVIEW');

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">
            Publishing
          </h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            Antrean, approval gate, dan log · 3 job aktif · worker terakhir berjalan 09:12 WIB
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Platform Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(prev => (prev === 'platform' ? null : 'platform'))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 shadow-2xs"
            >
              <span className="capitalize">{platformFilter === 'all' ? 'Semua platform' : platformFilter}</span>
              <span className="text-[10px] text-[#68717E]">▼</span>
            </button>
            {openDropdown === 'platform' && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
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

          {/* Status Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(prev => (prev === 'status' ? null : 'status'))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 shadow-2xs"
            >
              <span>{statusFilter === 'all' ? 'Semua status' : statusFilter}</span>
              <span className="text-[10px] text-[#68717E]">▼</span>
            </button>
            {openDropdown === 'status' && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
                {['all', 'QUEUED', 'PUBLISHING', 'PUBLISHED', 'FAILED'].map(s => (
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

          <button
            onClick={() => openScheduleModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Jadwalkan konten</span>
          </button>
        </div>
      </div>

      {/* 2. Top Status Strip */}
      <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-2xs space-y-3">
        <div className="text-xs font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
          Status konten & publishing
        </div>

        {/* Mobile 4-Metric Strip (matching Mobile_Publishing_7e06885a.png) */}
        <div className="grid grid-cols-4 gap-2 sm:hidden">
          {[
            { count: 8, label: 'APPROVED', bg: 'bg-[#E6F4EA] dark:bg-[#1C372B]', text: 'text-[#1E8E3E]' },
            { count: 11, label: 'JADWAL', bg: 'bg-[#EEF2FF] dark:bg-[#202638]', text: 'text-[#5268D8] dark:text-[#8292F0]' },
            { count: 3, label: 'QUEUED', bg: 'bg-[#FEF3C7] dark:bg-[#3D2E19]', text: 'text-[#B45309]' },
            { count: 34, label: 'TAYANG', bg: 'bg-[#F3F4F6] dark:bg-[#20242D]', text: 'text-neutral-700 dark:text-neutral-300' }
          ].map((m, idx) => (
            <div key={idx} className={`p-2.5 rounded-[8px] ${m.bg} border border-[#E7E9ED]/60 dark:border-[#2E3442] flex flex-col justify-between text-center`}>
              <span className={`text-lg font-bold font-mono tabular-nums ${m.text}`}>{m.count}</span>
              <span className="text-[8px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] mt-0.5 font-semibold">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Desktop Pipeline Step Boxes (7 cols) */}
        <div className="hidden sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { count: 6, label: 'DRAFT', bg: 'bg-[#F3F4F6] dark:bg-[#20242D]', text: 'text-neutral-700 dark:text-neutral-300' },
            { count: 5, label: 'IN REVIEW', bg: 'bg-[#FEF3C7]/60 dark:bg-[#382D1B]/50', text: 'text-[#D97706]' },
            { count: 8, label: 'APPROVED', bg: 'bg-[#E6F4EA] dark:bg-[#1C372B]', text: 'text-[#1E8E3E]' },
            { count: 11, label: 'SCHEDULED', bg: 'bg-[#EEF2FF] dark:bg-[#202638]', text: 'text-[#5268D8] dark:text-[#8292F0]' },
            { count: 3, label: 'QUEUED', bg: 'bg-[#EFF6FF] dark:bg-[#1F2C46]', text: 'text-[#2563EB]' },
            { count: 1, label: 'PUBLISHING', bg: 'bg-[#FEF3C7] dark:bg-[#3D2E19]', text: 'text-[#B45309]' },
            { count: 34, label: 'PUBLISHED', bg: 'bg-[#E6F4EA] dark:bg-[#1C372B]', text: 'text-[#1E8E3E]' }
          ].map((step, i) => (
            <div
              key={i}
              className={`p-3 rounded-[8px] ${step.bg} border border-[#E7E9ED]/60 dark:border-[#2E3442] flex flex-col justify-between`}
            >
              <span className={`text-xl font-bold font-mono tabular-nums ${step.text}`}>
                {step.count}
              </span>
              <span className="text-[9px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2] mt-1 font-semibold">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Subtext info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] pt-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span>Cabang kegagalan:</span>
            <span className="inline-flex items-center gap-1 text-[#DC6470] font-semibold">● FAILED</span>
            <span className="inline-flex items-center gap-1 text-neutral-500 font-semibold">● CANCELLED</span>
            <span>· retry otomatis 2m → 8m → 30m</span>
          </div>
          <span className="hidden sm:inline">konten belum APPROVED tidak masuk antrean aktif</span>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Menunggu Approval Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Menunggu approval
                </h3>
                <span className="text-xs text-[#68717E] dark:text-[#9BA3B2]">
                  4 konten
                </span>
              </div>
              <button
                onClick={() => navigateTo('creative')}
                className="text-xs text-[#5268D8] dark:text-[#8292F0] hover:underline"
              >
                Lihat semua
              </button>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-[9px] bg-neutral-50/70 dark:bg-[#20242D]/60 border border-[#E7E9ED] dark:border-[#2E3442] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-[6px] bg-neutral-200 dark:bg-[#2E3650] shrink-0 flex items-center justify-center text-xs font-mono text-[#68717E]">
                      {item.format.includes('reel') ? 'Reel' : 'Post'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0] truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                        {item.format === 'instagram_reel' ? 'IG Reel' : item.format === 'instagram_carousel' ? 'IG Carousel' : 'YT Shorts'} · v{item.currentVersion} · Arunika Coffee · Diajukan {item.versions[0]?.modifiedBy || 'Ayu'} · 2 j lalu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => navigateTo('creative', { contentId: item.id })}
                      className="px-2.5 py-1 text-xs font-medium rounded-[6px] border border-[#E7E9ED] dark:border-[#383F4C] bg-white dark:bg-[#1B1E25] hover:bg-neutral-100 text-[#17191F] dark:text-[#E9EBF0] transition-colors"
                    >
                      Pratinjau
                    </button>
                    <button
                      onClick={() => requestChangesOnItem(item.id, 'Perlu penyesuaian overlay teks detik ke-6')}
                      className="px-2.5 py-1 text-xs font-medium rounded-[6px] border border-[#D97706]/40 text-[#D97706] bg-[#FEF3C7]/40 hover:bg-[#FEF3C7] transition-colors"
                    >
                      Minta revisi
                    </button>
                    <button
                      onClick={() => approveContentItem(item.id)}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-[6px] bg-[#1E8E3E] hover:bg-[#177232] text-white shadow-2xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Setujui</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] pt-2 border-t border-[#E7E9ED] dark:border-[#292E38]">
              Approval mencatat approver, timestamp, dan versi konten — edit setelah approval membatalkan validitas.
            </p>
          </div>

          {/* Antrean Publishing Table */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Antrean publishing
                </h3>
                <span className="text-xs text-[#68717E] dark:text-[#9BA3B2]">
                  4 job hari ini
                </span>
              </div>
              <button
                onClick={() => navigateTo('calendar')}
                className="text-xs text-[#5268D8] dark:text-[#8292F0] hover:underline"
              >
                Log lengkap →
              </button>
            </div>

            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#E7E9ED] dark:border-[#292E38] text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2]">
                    <th className="pb-2 font-medium">JOB · IDEMPOTENCY</th>
                    <th className="pb-2 font-medium">KONTEN</th>
                    <th className="pb-2 font-medium">PLATFORM</th>
                    <th className="pb-2 font-medium">JADWAL</th>
                    <th className="pb-2 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E9ED] dark:divide-[#292E38]">
                  {[
                    { id: 'pb_7f3a', idem: 'c_9f2b..', title: 'Cerita panen Gayo 2025', plat: 'IG Reel', time: '2 Okt 18:30', status: 'QUEUED', badge: 'bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E2D48] dark:text-[#60A5FA]' },
                    { id: 'pb_7f3b', idem: 'c_9f2c..', title: 'Cold brew shift malam', plat: 'TikTok', time: '2 Okt 20:00', status: 'PUBLISHING', badge: 'bg-[#FEF3C7] text-[#B45309] dark:bg-[#382D1B] dark:text-[#FBBF24]' },
                    { id: 'pb_7f39', idem: 'c_9f19..', title: '3 cara seduh tanpa mesin', plat: 'YT Shorts', time: '2 Okt 12:15', status: 'PUBLISHED', badge: 'bg-[#E6F4EA] text-[#1E8E3E] dark:bg-[#1C372B] dark:text-[#34D399]' },
                    { id: 'pb_7f35', idem: 'c_9e88..', title: 'Kuis biji kopi', plat: 'IG Story', time: '1 Okt 09:40', status: 'FAILED', badge: 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#3E1B1B] dark:text-[#F87171]', retry: true }
                  ].map((job, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/70 dark:hover:bg-[#20242D] transition-colors">
                      <td className="py-3 font-mono text-[11px] text-[#17191F] dark:text-[#E9EBF0]">
                        <div>{job.id}</div>
                        <div className="text-[9px] text-[#68717E]">{job.idem}</div>
                      </td>
                      <td className="py-3 font-semibold text-[#17191F] dark:text-[#E9EBF0]">
                        {job.title}
                      </td>
                      <td className="py-3 font-mono text-[#68717E] dark:text-[#9BA3B2]">
                        {job.plat}
                      </td>
                      <td className="py-3 font-mono text-[#68717E] dark:text-[#9BA3B2]">
                        {job.time}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-semibold ${job.badge}`}>
                            ● {job.status}
                          </span>
                          {job.retry && (
                            <button
                              onClick={() => retryPublishingJob(job.id)}
                              className="text-[10px] font-mono text-[#DC2626] hover:underline flex items-center gap-0.5"
                            >
                              <RotateCcw className="w-2.5 h-2.5" />
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Native Queue Cards List */}
            <div className="sm:hidden space-y-3">
              {[
                { id: 'pb_7f3a', title: 'Cerita panen Gayo 2025', plat: 'IG Reel', time: '2 Okt 18:30', status: 'QUEUED', badge: 'bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E2D48] dark:text-[#60A5FA]' },
                { id: 'pb_7f3b', title: 'Cold brew shift malam', plat: 'TikTok', time: '2 Okt 20:00', status: 'PUBLISHING', badge: 'bg-[#FEF3C7] text-[#B45309] dark:bg-[#382D1B] dark:text-[#FBBF24]' },
                { id: 'pb_7f39', title: '3 cara seduh tanpa mesin', plat: 'YT Shorts', time: '2 Okt 12:15', status: 'PUBLISHED', badge: 'bg-[#E6F4EA] text-[#1E8E3E] dark:bg-[#1C372B] dark:text-[#34D399]' },
                { id: 'pb_7f35', title: 'Kuis biji kopi', plat: 'IG Story', time: '1 Okt 09:40', status: 'FAILED', badge: 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#3E1B1B] dark:text-[#F87171]', retry: true }
              ].map((job, idx) => (
                <div key={idx} className="p-3 rounded-[8px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-xs text-[#17191F] dark:text-[#E9EBF0] leading-snug">
                      {job.title}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] font-mono text-[9px] font-semibold shrink-0 ${job.badge}`}>
                      ● {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] text-[9px] font-medium">{job.plat}</span>
                      <span>{job.time}</span>
                    </div>
                    {job.retry ? (
                      <button
                        onClick={() => retryPublishingJob(job.id)}
                        className="text-[10px] font-mono text-[#DC2626] hover:underline flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        Retry
                      </button>
                    ) : (
                      <span>{job.id}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Log Job Panel */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <div>
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  Log job pb_7f3a
                </h3>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  idem c_9f2b... · IG Reel · v3
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E2D48] dark:text-[#60A5FA]">
                ● QUEUED
              </span>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 relative pl-4 border-l-2 border-[#E7E9ED] dark:border-[#292E38] ml-2 text-xs">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-4 ring-white dark:ring-[#1B1E25]" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[#17191F] dark:text-[#E9EBF0]">09:12</span>
                  <span className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">Masuk queue</span>
                </div>
                <p className="text-[11px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                  approval v3 valid · capability IG Reel ok
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-4 ring-white dark:ring-[#1B1E25]" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[#17191F] dark:text-[#E9EBF0]">09:12</span>
                  <span className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">Idempotency key dibuat</span>
                </div>
                <p className="text-[11px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                  c_9f2b.. disimpan untuk mencegah duplikasi
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-4 ring-white dark:ring-[#1B1E25]" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[#17191F] dark:text-[#E9EBF0]">08:58</span>
                  <span className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">Disetujui Bagas</span>
                </div>
                <p className="text-[11px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                  approver: bagas@nusantara.studio · v3
                </p>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-4 ring-white dark:ring-[#1B1E25]" />
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-[#17191F] dark:text-[#E9EBF0]">08:40</span>
                  <span className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">Diajukan review</span>
                </div>
                <p className="text-[11px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                  oleh Ayu · perubahan caption
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E7E9ED] dark:border-[#292E38] text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
              Percobaan: 0 / 3 · backoff 2m → 8m → 30m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
