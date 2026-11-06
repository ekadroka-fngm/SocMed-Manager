import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Download, ChevronDown, Instagram, Facebook, Youtube, Music, Bookmark } from 'lucide-react';
import type { ContentFormat, SocialPlatform } from '../../types';

const getPlatform = (format: ContentFormat): SocialPlatform => {
  if (format.startsWith('instagram_')) return 'instagram';
  if (format.startsWith('tiktok_')) return 'tiktok';
  if (format.startsWith('youtube_')) return 'youtube';
  if (format.startsWith('pinterest_')) return 'pinterest';
  return 'facebook';
};

const platformName = (platform: SocialPlatform) => ({
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  pinterest: 'Pinterest'
}[platform]);

const platformIcon = (platform: SocialPlatform) => {
  if (platform === 'instagram') return <Instagram className="w-4 h-4 text-[#E1306C]"/>;
  if (platform === 'tiktok') return <Music className="w-4 h-4 text-[#111318] dark:text-white"/>;
  if (platform === 'youtube') return <Youtube className="w-4 h-4 text-[#FF0000]"/>;
  if (platform === 'facebook') return <Facebook className="w-4 h-4 text-[#1877F2]"/>;
  return <Bookmark className="w-4 h-4 text-[#BD081C]"/>;
};

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const AnalyticsPage: React.FC = () => {
  const { activeBrand, brands, switchBrand, contentItems, campaigns, publishingJobs, navigateTo, showToast } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'30' | '90'>('30');
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const brandItems = contentItems.filter(item => item.brandId === activeBrand.id);
  const latestTimestamp = brandItems.reduce((latest, item) => {
    const value = new Date(item.updatedAt || item.createdAt || 0).getTime();
    return Math.max(latest, Number.isFinite(value) ? value : 0);
  }, 0);

  const periodItems = useMemo(() => {
    const cutoff = latestTimestamp ? latestTimestamp - Number(selectedPeriod) * 24 * 60 * 60 * 1000 : 0;
    return brandItems.filter(item => {
      const value = new Date(item.updatedAt || item.createdAt || 0).getTime();
      return !cutoff || !value || value >= cutoff;
    });
  }, [brandItems, latestTimestamp, selectedPeriod]);

  const countStatus = (status: string) => periodItems.filter(item => item.status === status).length;
  const activeJobs = publishingJobs.filter(job => job.brandId === activeBrand.id && ['QUEUED', 'SCHEDULED', 'PUBLISHING'].includes(job.status));
  const brandCampaigns = campaigns.filter(campaign => campaign.brandId === activeBrand.id);
  const total = periodItems.length;

  const kpis = [
    { label: 'TOTAL BRIEF', value: total, source: `${selectedPeriod} hari · data konten` },
    { label: 'MENUNGGU REVIEW', value: countStatus('IN_REVIEW'), source: 'butuh keputusan' },
    { label: 'APPROVED', value: countStatus('APPROVED'), source: 'siap dijadwalkan' },
    { label: 'TERJADWAL', value: countStatus('SCHEDULED') + countStatus('QUEUED'), source: 'jadwal + antrean' },
    { label: 'PUBLISHED', value: countStatus('PUBLISHED'), source: 'status pada brief' }
  ];

  const platformStats = (['instagram', 'tiktok', 'youtube', 'facebook', 'pinterest'] as SocialPlatform[]).map(platform => {
    const items = periodItems.filter(item => getPlatform(item.format) === platform);
    return {
      platform,
      name: platformName(platform),
      count: items.length,
      share: total ? Math.round(items.length / total * 100) : 0,
      scheduled: items.filter(item => ['SCHEDULED', 'QUEUED'].includes(item.status)).length,
      published: items.filter(item => item.status === 'PUBLISHED').length
    };
  });

  const funnelStats = (['TOFU', 'MOFU', 'BOFU'] as const).map(stage => {
    const count = periodItems.filter(item => item.funnelStage === stage).length;
    return { stage, count, share: total ? Math.round(count / total * 100) : 0 };
  });

  const mostUsedPlatform = platformStats.slice().sort((a, b) => b.count - a.count)[0];
  const leastCoveredFunnel = funnelStats.slice().sort((a, b) => a.count - b.count)[0];

  const handleExport = () => {
    if (!periodItems.length) {
      showToast('Tidak ada data konten pada periode ini untuk diekspor.');
      return;
    }
    const headers = ['Content ID', 'Title', 'Brand ID', 'Campaign ID', 'Format', 'Platform', 'Funnel', 'Status', 'Created At', 'Scheduled For', 'Published URL'];
    const rows = periodItems.map(item => [
      item.id,
      item.title,
      item.brandId,
      item.campaignId || '',
      item.format,
      platformName(getPlatform(item.format)),
      item.funnelStage,
      item.status,
      item.createdAt || '',
      item.scheduledFor || '',
      item.publishedUrl || ''
    ]);
    const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `socmed-manager_${activeBrand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_${selectedPeriod}d.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`Export ${periodItems.length} brief berhasil dibuat.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">Analytics</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            {activeBrand.name} · {total} brief · {brandCampaigns.length} campaign
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select aria-label="Periode analytics" value={selectedPeriod} onChange={event => setSelectedPeriod(event.target.value as '30' | '90')} className="px-3 py-2 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-lg text-xs">
            <option value="30">30 hari</option>
            <option value="90">90 hari</option>
          </select>
          <div className="relative">
            <button type="button" onClick={() => setBrandDropdownOpen(value => !value)} aria-expanded={brandDropdownOpen} className="px-3 py-2 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-lg text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{backgroundColor:activeBrand.themeColor || '#B85D2A'}}/>
              {activeBrand.name}
              <ChevronDown className="w-3.5 h-3.5"/>
            </button>
            {brandDropdownOpen && <div className="absolute right-0 top-full mt-1 z-20 min-w-[180px] rounded-xl border border-[#E5E7EB] dark:border-[#272B35] bg-white dark:bg-[#1A1D24] p-1 shadow-xl">
              {brands.map(brand => <button key={brand.id} type="button" onClick={() => {switchBrand(brand.id);setBrandDropdownOpen(false);}} className={`w-full text-left rounded-lg px-3 py-2 text-xs ${brand.id === activeBrand.id ? 'bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252B3B]' : 'hover:bg-neutral-50 dark:hover:bg-[#222630]'}`}>{brand.name}</button>)}
            </div>}
          </div>
          <button type="button" onClick={handleExport} className="px-3 py-2 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-lg text-xs font-medium flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5"/> Ekspor CSV
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#F3D7A6] dark:border-[#5C4522] bg-[#FFF8E9] dark:bg-[#302718] p-3">
        <p className="text-[11px] text-[#805B1B] dark:text-[#F4D28F]">
          Data sosial seperti reach, impressions, views, engagement, dan follower growth belum tersedia. Angka di halaman ini hanya menghitung record konten dan status workflow, bukan performa akun.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {kpis.map(kpi => (
          <div key={kpi.label} className="rounded-xl border border-[#E5E7EB] dark:border-[#272B35] bg-white dark:bg-[#161922] p-4">
            <p className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-[#9CA3AF]">{kpi.label}</p>
            <p className="text-xl font-bold font-heading text-[#111318] dark:text-[#F3F4F6] mt-1">{kpi.value}</p>
            <p className="text-[10px] text-[#9CA3AF] mt-1">{kpi.source}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-8 rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] bg-white dark:bg-[#161922] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">Konten per platform</h2>
              <p className="text-[11px] text-[#9CA3AF]">Berdasarkan format yang dipilih pada brief</p>
            </div>
            <button type="button" onClick={() => navigateTo('integrations')} className="text-xs text-[#5268D8] flex items-center gap-1">Integrasi <ArrowRight className="w-3 h-3"/></button>
          </div>
          <div className="space-y-4">
            {platformStats.map(stat => (
              <div key={stat.platform} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold">{platformIcon(stat.platform)} {stat.name}</span>
                  <span className="text-[10px] font-mono text-[#68717E]">{stat.count} brief · {stat.share}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#F3F4F6] dark:bg-[#222630] overflow-hidden">
                  <div className="h-full rounded-full bg-[#5268D8]" style={{width:`${stat.share}%`}}/>
                </div>
                <p className="text-[10px] text-[#9CA3AF]">{stat.scheduled} scheduled/queued · {stat.published} published</p>
              </div>
            ))}
            {!total && <p className="text-xs text-[#68717E] py-4">Belum ada brief dalam periode ini.</p>}
          </div>
        </section>

        <div className="lg:col-span-4 space-y-5">
          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] bg-white dark:bg-[#161922] p-5">
            <h2 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">Distribusi funnel</h2>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5 mb-4">Jumlah brief, bukan konversi.</p>
            <div className="space-y-4">
              {funnelStats.map(stage => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-xs mb-1.5"><span>{stage.stage}</span><span className="font-mono font-semibold">{stage.count} · {stage.share}%</span></div>
                  <div className="h-2 rounded-full bg-[#F3F4F6] dark:bg-[#222630] overflow-hidden"><div className="h-full rounded-full bg-[#5268D8]" style={{width:`${stage.share}%`}}/></div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] bg-white dark:bg-[#161922] p-5 space-y-3">
            <h2 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">Ringkasan workflow</h2>
            <p className="text-xs text-[#68717E] dark:text-[#9CA3AF]">{activeJobs.length} job masih berada di antrean lokal.</p>
            <p className="text-xs text-[#68717E] dark:text-[#9CA3AF]">Platform paling sering dipilih: {mostUsedPlatform?.name || 'Belum ada data'}.</p>
            <p className="text-xs text-[#68717E] dark:text-[#9CA3AF]">Funnel dengan jumlah brief paling sedikit: {leastCoveredFunnel.stage} ({leastCoveredFunnel.count}).</p>
            <button type="button" onClick={() => navigateTo('campaigns')} className="text-xs font-semibold text-[#5268D8] hover:underline">Buat campaign <ArrowRight className="inline w-3 h-3"/></button>
          </section>
        </div>
      </div>
    </div>
  );
};
