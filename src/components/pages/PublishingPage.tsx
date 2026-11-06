import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Ban,
  Check,
  Clock,
  Eye,
  RotateCcw,
  Send
} from 'lucide-react';
import type { PublishingJob, SocialPlatform } from '../../types';

const formatDateTime = (value: string) => new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta'
}).format(new Date(value));

const getPlatformName = (platform: SocialPlatform) => ({
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  pinterest: 'Pinterest'
}[platform]);

export const PublishingPage: React.FC = () => {
  const {
    activeBrand,
    contentItems,
    approveContentItem,
    requestChangesOnItem,
    publishingJobs,
    retryPublishingJob,
    cancelPublishingJob,
    navigateTo,
    openScheduleModal,
    showToast
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<'all' | SocialPlatform>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PublishingJob['status']>('all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const brandItems = contentItems.filter(item => item.brandId === activeBrand.id);
  const pendingApprovals = brandItems.filter(item => item.status === 'IN_REVIEW');

  const brandJobs = useMemo(() => publishingJobs
    .filter(job => job.brandId === activeBrand.id)
    .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()),
  [publishingJobs, activeBrand.id]);

  const filteredJobs = brandJobs.filter(job =>
    (platformFilter === 'all' || job.platform === platformFilter) &&
    (statusFilter === 'all' || job.status === statusFilter)
  );
  const selectedJob = filteredJobs.find(job => job.id === selectedJobId) || filteredJobs[0] || null;
  const findContent = (job: PublishingJob) => brandItems.find(item => item.id === job.contentId);

  const counts = {
    draft: brandItems.filter(item => item.status === 'DRAFT').length,
    review: brandItems.filter(item => item.status === 'IN_REVIEW').length,
    approved: brandItems.filter(item => item.status === 'APPROVED').length,
    scheduled: brandItems.filter(item => item.status === 'SCHEDULED').length,
    queued: brandJobs.filter(job => job.status === 'QUEUED').length,
    published: brandItems.filter(item => item.status === 'PUBLISHED').length
  };

  const handleRetry = (job: PublishingJob) => {
    retryPublishingJob(job.id);
    setSelectedJobId(job.id);
  };

  const handleCancel = (job: PublishingJob) => {
    if (!window.confirm(`Batalkan antrean "${findContent(job)?.title || job.contentId}"?`)) return;
    cancelPublishingJob(job.id);
  };

  const canRetry = (job: PublishingJob) => job.status === 'FAILED' && job.retryCount < job.maxRetries;
  const canCancel = (job: PublishingJob) => ['QUEUED', 'SCHEDULED', 'FAILED'].includes(job.status);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">Publishing</h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">{activeBrand.name} · approval, jadwal, dan antrean lokal</p>
        </div>
        <button type="button" onClick={() => openScheduleModal()} className="flex items-center gap-1.5 px-3.5 py-2 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-lg text-xs font-semibold">
          <Send className="w-3.5 h-3.5"/> Jadwalkan konten
        </button>
      </div>

      <div className="rounded-xl border border-[#F3D7A6] dark:border-[#5C4522] bg-[#FFF8E9] dark:bg-[#302718] px-4 py-3 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#B7791F] shrink-0 mt-0.5"/>
        <p className="text-[11px] text-[#805B1B] dark:text-[#F4D28F]">
          Antrean dan retry saat ini tersimpan di state aplikasi. Worker publikasi sosial belum terhubung, jadi status QUEUED bukan berarti konten sudah dikirim ke platform.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          {label:'Draft',value:counts.draft},
          {label:'Review',value:counts.review},
          {label:'Approved',value:counts.approved},
          {label:'Scheduled',value:counts.scheduled},
          {label:'Queued',value:counts.queued},
          {label:'Published',value:counts.published}
        ].map(item => (
          <div key={item.label} className="rounded-lg border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-3">
            <p className="text-lg font-bold font-mono tabular-nums text-[#17191F] dark:text-[#E9EBF0]">{item.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-[#68717E] dark:text-[#9BA3B2]">{item.label}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#17191F] dark:text-[#E9EBF0]">Menunggu approval</h2>
            <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2]">{pendingApprovals.length} konten perlu keputusan</p>
          </div>
          <button type="button" onClick={() => navigateTo('creative')} className="text-[11px] text-[#5268D8] hover:underline">Buka studio</button>
        </div>
        {pendingApprovals.length ? pendingApprovals.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-neutral-50 dark:bg-[#20242D] p-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] truncate">{item.title}</p>
              <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">{item.format.replaceAll('_', ' ')} · v{item.currentVersion} · {item.funnelStage}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={() => navigateTo('creative', {contentId:item.id})} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#E7E9ED] dark:border-[#383F4C] text-[10px]">
                <Eye className="w-3 h-3"/> Pratinjau
              </button>
              <button type="button" onClick={() => { requestChangesOnItem(item.id, 'Perlu revisi dari reviewer.'); showToast('Permintaan revisi dicatat.'); }} className="px-2.5 py-1.5 rounded-md border border-[#E7C17C] text-[10px] text-[#9A681B]">
                Minta revisi
              </button>
              <button type="button" onClick={() => { approveContentItem(item.id); showToast('Konten disetujui.'); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#1E8E3E] text-white text-[10px] font-semibold">
                <Check className="w-3 h-3"/> Setujui
              </button>
            </div>
          </div>
        )) : <p className="py-5 text-center text-xs text-[#68717E]">Tidak ada konten yang menunggu approval.</p>}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="lg:col-span-8 rounded-xl border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#17191F] dark:text-[#E9EBF0]">Antrean publishing</h2>
              <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2]">{filteredJobs.length} job sesuai filter</p>
            </div>
            <div className="flex items-center gap-2">
              <select aria-label="Filter platform publishing" value={platformFilter} onChange={event => setPlatformFilter(event.target.value as 'all' | SocialPlatform)} className="px-2.5 py-1.5 rounded-md border border-[#E7E9ED] dark:border-[#383F4C] bg-white dark:bg-[#20242D] text-[10px]">
                <option value="all">Semua platform</option>
                {(['instagram', 'tiktok', 'youtube', 'facebook', 'pinterest'] as SocialPlatform[]).map(platform => <option key={platform} value={platform}>{getPlatformName(platform)}</option>)}
              </select>
              <select aria-label="Filter status publishing" value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'all' | PublishingJob['status'])} className="px-2.5 py-1.5 rounded-md border border-[#E7E9ED] dark:border-[#383F4C] bg-white dark:bg-[#20242D] text-[10px]">
                <option value="all">Semua status</option>
                {['QUEUED', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELLED'].map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </div>

          {filteredJobs.length ? (
            <div className="space-y-2">
              {filteredJobs.map(job => {
                const content = findContent(job);
                const selected = selectedJob?.id === job.id;
                return (
                  <div key={job.id} className={`rounded-lg border p-3 transition-colors ${selected ? 'border-[#5268D8] bg-[#EEF2FF]/40 dark:bg-[#202638]' : 'border-[#E7E9ED] dark:border-[#292E38]'}`}>
                    <button type="button" onClick={() => setSelectedJobId(job.id)} className="w-full text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] truncate">{content?.title || 'Konten tidak ditemukan'}</p>
                          <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">{getPlatformName(job.platform)} · {formatDateTime(job.scheduledTime)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md px-2 py-1 bg-neutral-100 dark:bg-[#292E38] text-[9px] font-mono">{job.status}</span>
                          <span className="text-[9px] font-mono text-[#68717E]">Retry {job.retryCount}/{job.maxRetries}</span>
                        </div>
                      </div>
                    </button>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      {canRetry(job) && <button type="button" onClick={() => handleRetry(job)} className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#E7E9ED] dark:border-[#383F4C] text-[10px]"><RotateCcw className="w-3 h-3"/> Retry lokal</button>}
                      {canCancel(job) && <button type="button" onClick={() => handleCancel(job)} className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#E7B9B9] text-[10px] text-[#B42318]"><Ban className="w-3 h-3"/> Batalkan</button>}
                      {content && <button type="button" onClick={() => navigateTo('creative', {contentId:content.id})} className="px-2.5 py-1 text-[10px] text-[#5268D8] hover:underline">Buka brief</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="py-8 text-center text-xs text-[#68717E]">Belum ada job pada filter ini.</p>}
        </section>

        <aside className="lg:col-span-4 rounded-xl border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5268D8]"/>
            <h2 className="text-sm font-bold text-[#17191F] dark:text-[#E9EBF0]">Log job</h2>
          </div>
          {selectedJob ? (
            <>
              <div className="rounded-lg bg-neutral-50 dark:bg-[#20242D] p-3">
                <p className="text-xs font-semibold truncate">{findContent(selectedJob)?.title || selectedJob.contentId}</p>
                <p className="text-[10px] text-[#68717E] mt-1">{selectedJob.id} · {selectedJob.status}</p>
              </div>
              <div className="space-y-3">
                {selectedJob.logTrail.length ? selectedJob.logTrail.map((entry, index) => (
                  <div key={`${selectedJob.id}-${index}`} className="border-l-2 border-[#D9DFF8] dark:border-[#3A456D] pl-3">
                    <p className="text-[10px] font-semibold text-[#17191F] dark:text-[#E9EBF0]">{entry.step}</p>
                    <p className="text-[9px] text-[#68717E] mt-0.5">{formatDateTime(entry.timestamp)} · {entry.status}</p>
                    <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">{entry.details}</p>
                  </div>
                )) : <p className="text-xs text-[#68717E]">Belum ada log untuk job ini.</p>}
              </div>
            </>
          ) : <p className="py-8 text-center text-xs text-[#68717E]">Pilih job untuk melihat log.</p>}
        </aside>
      </div>
    </div>
  );
};
