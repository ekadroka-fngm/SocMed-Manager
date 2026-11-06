import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Globe, Sparkles } from 'lucide-react';
import type { ContentFormat, SocialPlatform } from '../../types';

const getPlatform = (format: ContentFormat): SocialPlatform => {
  if (format.startsWith('instagram_')) return 'instagram';
  if (format.startsWith('tiktok_')) return 'tiktok';
  if (format.startsWith('youtube_')) return 'youtube';
  if (format.startsWith('pinterest_')) return 'pinterest';
  return 'facebook';
};

const formatLabel = (format: ContentFormat) =>
  format.split('_').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

export const IntelligencePage: React.FC = () => {
  const { navigateTo, createIdea, activeBrand, contentItems, showToast } = useApp();
  const [metricMode, setMetricMode] = useState<'count' | 'share'>('count');
  const [selectedDays, setSelectedDays] = useState<'30' | '90'>('30');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | SocialPlatform>('all');
  const [lastAnalysisAt, setLastAnalysisAt] = useState<string | null>(null);

  const brandContent = contentItems.filter(item => item.brandId === activeBrand.id);
  const referenceTimestamp = brandContent.reduce((latest, item) => {
    const value = new Date(item.updatedAt || item.createdAt || 0).getTime();
    return Math.max(latest, Number.isFinite(value) ? value : 0);
  }, 0);

  const periodContent = useMemo(() => {
    const cutoff = referenceTimestamp ? referenceTimestamp - Number(selectedDays) * 24 * 60 * 60 * 1000 : 0;
    return brandContent.filter(item => {
      const createdAt = new Date(item.updatedAt || item.createdAt || 0).getTime();
      const inPeriod = !createdAt || !cutoff || createdAt >= cutoff;
      const matchesPlatform = selectedPlatform === 'all' || getPlatform(item.format) === selectedPlatform;
      return inPeriod && matchesPlatform;
    });
  }, [brandContent, referenceTimestamp, selectedDays, selectedPlatform]);

  const total = periodContent.length;
  const funnelCounts = {
    TOFU: periodContent.filter(item => item.funnelStage === 'TOFU').length,
    MOFU: periodContent.filter(item => item.funnelStage === 'MOFU').length,
    BOFU: periodContent.filter(item => item.funnelStage === 'BOFU').length
  };

  const pillars = activeBrand.pillars.map(pillar => {
    const count = periodContent.filter(item => item.contentPillarId === pillar.id).length;
    const share = total ? Math.round((count / total) * 100) : 0;
    return { id: pillar.id, name: pillar.name, count, share };
  }).sort((a, b) => b.count - a.count);

  const formats = Array.from(periodContent.reduce((map, item) => {
    map.set(item.format, (map.get(item.format) || 0) + 1);
    return map;
  }, new Map<ContentFormat, number>()).entries())
    .map(([format, posts]) => ({
      format,
      label: formatLabel(format),
      posts,
      share: total ? Math.round((posts / total) * 100) : 0
    }))
    .sort((a, b) => b.posts - a.posts);

  const contentGaps = pillars
    .slice()
    .sort((a, b) => a.count - b.count)
    .slice(0, 3)
    .map(pillar => ({
      pillarId: pillar.id,
      title: pillar.count === 0 ? `Mulai topik untuk ${pillar.name}` : `Kembangkan ${pillar.name}`,
      subtitle: `${pillar.count} konten pada periode ini`,
      topic: `Ide konten: ${pillar.name}`
    }));

  const leastCoveredFunnel = (Object.entries(funnelCounts) as [keyof typeof funnelCounts, number][])
    .sort((a, b) => a[1] - b[1])[0];

  const topicRecommendations = [
    {
      title: leastCoveredFunnel && leastCoveredFunnel[1] === 0
        ? `Mulai bangun konten ${leastCoveredFunnel[0]}`
        : `Perkuat distribusi ${leastCoveredFunnel?.[0] || 'TOFU'}`,
      priority: 'Tinggi',
      reason: `Distribusi funnel saat ini: TOFU ${funnelCounts.TOFU}, MOFU ${funnelCounts.MOFU}, BOFU ${funnelCounts.BOFU} konten.`
    },
    {
      title: pillars[0]?.name ? `Buat seri lanjutan ${pillars[0].name}` : 'Lengkapi content pillar brand',
      priority: 'Sedang',
      reason: pillars[0] ? `${pillars[0].name} menjadi pillar dengan jumlah brief terbanyak (${pillars[0].count}).` : 'Brand belum mempunyai content pillar.'
    },
    {
      title: formats[0]?.label ? `Kembangkan format ${formats[0].label}` : 'Tentukan format konten pertama',
      priority: 'Sedang',
      reason: formats[0] ? `${formats[0].posts} brief menggunakan format ini pada periode terpilih.` : 'Belum ada brief pada periode terpilih.'
    }
  ];

  const handleRunAnalysis = () => {
    setLastAnalysisAt(new Date().toISOString());
    showToast(`Analisis lokal selesai: ${total} brief diperiksa. Metrik sosial belum tersedia.`);
  };

  const handleCreateIdeaFromGap = (gap: typeof contentGaps[number]) => {
    createIdea({
      brandId: activeBrand.id,
      title: gap.topic,
      topic: gap.topic,
      targetAudience: activeBrand.personas[0]?.name || 'Audiens utama',
      audienceProblem: `Kebutuhan konten pada pillar ${activeBrand.pillars.find(pillar => pillar.id === gap.pillarId)?.name || 'brand'} belum banyak terwakili.`,
      objective: 'Mengembangkan distribusi konten brand',
      funnelStage: leastCoveredFunnel?.[0] || 'TOFU',
      contentPillarId: gap.pillarId,
      creativeAngle: 'Edukasi berbasis masalah audiens',
      format: formats[0]?.format || 'instagram_reel',
      tone: activeBrand.voiceAndTone || 'Sesuai brand voice'
    });
    showToast('Ide ditambahkan ke Idea Lab.');
    navigateTo('ideas');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">Intelligence engine</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            {activeBrand.name} · {total} brief dalam periode data · analisis workspace lokal
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select aria-label="Periode analisis" value={selectedDays} onChange={event => setSelectedDays(event.target.value as '30' | '90')} className="px-3 py-2 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-lg text-xs">
            <option value="30">30 hari</option>
            <option value="90">90 hari</option>
          </select>
          <select aria-label="Platform analisis" value={selectedPlatform} onChange={event => setSelectedPlatform(event.target.value as 'all' | SocialPlatform)} className="px-3 py-2 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-lg text-xs">
            <option value="all">Semua platform</option>
            {(['instagram', 'tiktok', 'youtube', 'facebook', 'pinterest'] as SocialPlatform[]).map(platform => <option key={platform} value={platform}>{platform}</option>)}
          </select>
          <button type="button" onClick={handleRunAnalysis} className="px-3.5 py-2 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-lg text-xs font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5"/> Jalankan analisis
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#E7E9ED] dark:border-[#292E38] bg-white dark:bg-[#1B1E25] p-3 flex items-start gap-2">
        <Globe className="w-4 h-4 text-[#68717E] shrink-0 mt-0.5"/>
        <div className="min-w-0">
          <p className="text-[11px] text-[#68717E] dark:text-[#9BA3B2]">
            Data di halaman ini dihitung dari brief yang tersimpan. Engagement, reach, search volume, dan performa kompetitor belum ditampilkan karena API analytics belum terhubung.
          </p>
          {lastAnalysisAt && <p className="text-[10px] text-[#5268D8] mt-1">Perhitungan terakhir: {new Date(lastAnalysisAt).toLocaleString('id-ID')}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">Distribusi content pillar</h2>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">Berdasarkan jumlah brief, bukan metrik sosial.</p>
              </div>
              <div className="p-0.5 bg-[#F3F4F6] dark:bg-[#222630] rounded-lg flex items-center">
                <button type="button" onClick={() => setMetricMode('count')} aria-pressed={metricMode === 'count'} className={`px-3 py-1 text-xs rounded-md ${metricMode === 'count' ? 'bg-white dark:bg-[#161922] font-semibold shadow-xs' : 'text-[#6B7280]'}`}>Jumlah</button>
                <button type="button" onClick={() => setMetricMode('share')} aria-pressed={metricMode === 'share'} className={`px-3 py-1 text-xs rounded-md ${metricMode === 'share' ? 'bg-white dark:bg-[#161922] font-semibold shadow-xs' : 'text-[#6B7280]'}`}>Proporsi</button>
              </div>
            </div>
            <div className="space-y-4">
              {pillars.map((pillar, index) => (
                <div key={pillar.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">{pillar.name}</span>
                    <span className="font-mono text-[#68717E]">{metricMode === 'count' ? `${pillar.count} brief` : `${pillar.share}%`}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F3F4F6] dark:bg-[#222630] overflow-hidden">
                    <div className={`h-full rounded-full ${index === 0 ? 'bg-[#5268D8]' : index === 1 ? 'bg-[#8292F0]' : 'bg-[#21A68A]'}`} style={{ width: `${metricMode === 'count' ? (pillars[0]?.count ? pillar.count / pillars[0].count * 100 : 0) : pillar.share}%` }}/>
                  </div>
                </div>
              ))}
              {!pillars.length && <p className="text-xs text-[#68717E]">Belum ada pillar pada brand ini.</p>}
            </div>
          </section>

          <section className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">Distribusi format</h2>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 mb-4">Jumlah brief berdasarkan format.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map(format => (
                <div key={format.format} className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">{format.label}</span>
                    <span className="text-xs font-mono text-[#68717E]">{format.posts} brief</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-[#E5E7EB] dark:bg-[#272B35] rounded-full overflow-hidden">
                    <div className="h-full bg-[#5268D8] rounded-full" style={{width:`${total ? format.posts / total * 100 : 0}%`}}/>
                  </div>
                </div>
              ))}
              {!formats.length && <p className="text-xs text-[#68717E]">Belum ada brief pada periode terpilih.</p>}
            </div>
          </section>

          <section className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5 sm:p-6">
            <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">Funnel coverage</h2>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {(['TOFU', 'MOFU', 'BOFU'] as const).map(stage => (
                <div key={stage} className="rounded-lg bg-[#F9FAFB] dark:bg-[#1A1D24] p-3 text-center">
                  <p className="text-lg font-bold font-mono">{funnelCounts[stage]}</p>
                  <p className="text-[10px] text-[#68717E]">{stage}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">Content gap</h3>
                <p className="text-[11px] text-[#9CA3AF]">Pillar dengan coverage paling rendah</p>
              </div>
              <button type="button" onClick={() => navigateTo('ideas')} className="text-xs text-[#5268D8] font-medium">Idea Lab</button>
            </div>
            <div className="space-y-4">
              {contentGaps.map(gap => (
                <div key={gap.pillarId} className="pb-3 border-b border-[#F1F3F5] dark:border-[#222630] last:border-0">
                  <h4 className="text-xs font-semibold text-[#111318] dark:text-[#F3F4F6]">{gap.title}</h4>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{gap.subtitle}</p>
                  <button type="button" onClick={() => handleCreateIdeaFromGap(gap)} className="mt-2 text-xs text-[#5268D8] font-medium hover:underline">Buat ide <ArrowRight className="inline w-3 h-3"/></button>
                </div>
              ))}
              {!contentGaps.length && <p className="text-xs text-[#68717E]">Tambahkan content pillar untuk melihat peluang.</p>}
            </div>
          </section>

          <section className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">Rekomendasi workflow</h3>
              <p className="text-[11px] text-[#9CA3AF]">Aturan sederhana dari distribusi konten</p>
            </div>
            <div className="space-y-3">
              {topicRecommendations.map((recommendation, index) => (
                <div key={index} className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630] space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#111318] dark:text-[#F3F4F6]">{recommendation.title}</h4>
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-[#EEF2FF] text-[#5268D8]">{recommendation.priority}</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">{recommendation.reason}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
