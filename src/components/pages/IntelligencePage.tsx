import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Globe,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const { navigateTo, createIdea, activeBrand } = useApp();
  const [metricMode, setMetricMode] = useState<'engagement' | 'reach'>('engagement');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDays, setSelectedDays] = useState<'30' | '90'>('30');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Semua platform');

  const pillars = [
    {
      name: 'Edukasi seduh',
      konten: 20,
      engagement: '6,8%',
      reach: '542 rb',
      delta: '+1,4 pt',
      trend: 'up',
      barWidth: '68%',
    },
    {
      name: 'Cerita petani',
      konten: 16,
      engagement: '5,9%',
      reach: '412 rb',
      delta: '+0,6 pt',
      trend: 'up',
      barWidth: '59%',
    },
    {
      name: 'Behind the scenes',
      konten: 11,
      engagement: '4,4%',
      reach: '298 rb',
      delta: '0,0 pt',
      trend: 'neutral',
      barWidth: '44%',
    },
    {
      name: 'Produk & promo',
      konten: 15,
      engagement: '3,1%',
      reach: '185 rb',
      delta: '-0,9 pt',
      trend: 'down',
      barWidth: '31%',
    },
  ];

  const formats = [
    { format: 'Reel', value: '6,2%', posts: 24, barWidth: '78%' },
    { format: 'Carousel', value: '3,8%', posts: 18, barWidth: '48%' },
    { format: 'Story', value: '2,1%', posts: 31, barWidth: '26%' },
    { format: 'YT Shorts', value: '5,4%', posts: 12, barWidth: '68%' },
    { format: 'YT Video', value: '4,0%', posts: 6, barWidth: '50%' },
    { format: 'Pinterest Pin', value: '1,4%', posts: 8, barWidth: '18%' },
  ];

  const contentGaps = [
    {
      title: 'Konten perbandingan metode seduh',
      subtitle: 'Dicari 1,2 rb/bln · belum ada',
      topic: 'V60 vs Aeropress untuk Pemula',
    },
    {
      title: 'Penjelasan profil sangrai',
      subtitle: 'Dicari 890/bln · 1 konten lama',
      topic: 'Light Roast vs Dark Roast: Mana untuk Lambung?',
    },
    {
      title: 'Konten harga & value',
      subtitle: 'Dicari 640/bln · tidak ada',
      topic: 'Kenapa Biji Specialty Lebih Mahal dari Kopi Sachet',
    },
  ];

  const topicRecommendations = [
    {
      title: 'Buat seri "uji metode seduh" 4 episode',
      priority: 'Tinggi',
      reason: 'Alasan: Reel edukasi 6,2% vs rata-rata 3,6%. Sumber: analytics 90 hari.',
    },
    {
      title: 'Angkat profil petani Gayo sebagai carousel',
      priority: 'Tinggi',
      reason: 'Alasan: pillar cerita petani 5,9% dengan 16 konten saja — under-supplied.',
    },
    {
      title: 'Ganti promo Story dengan BOFU testimoni',
      priority: 'Sedang',
      reason: 'Alasan: Story promo 0,9%; testimoni 4,1%.',
    },
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 900);
  };

  const handleCreateIdeaFromGap = (topic: string) => {
    createIdea({
      brandId: activeBrand.id,
      title: topic,
      topic: topic,
      targetAudience: 'Penikmat kopi rumahan 22-35th',
      audienceProblem: 'Bingung memilih metode seduh yang cocok dengan jenis biji',
      objective: 'Edukasi dan konversi biji Gayo',
      funnelStage: 'MOFU',
      contentPillarId: 'pil_edukasi',
      creativeAngle: 'Side-by-side taste test blindfold',
      format: 'instagram_reel',
      tone: 'Hangat, ramah, edukatif',
    });
    navigateTo('ideas');
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Intelligence engine
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Periode 1–30 Sep 2025 · 4 akun terhubung · 147 konten dianalisis · diperbarui 09:12 WIB
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Days dropdown */}
          <button
            onClick={() => setSelectedDays(selectedDays === '30' ? '90' : '30')}
            className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1.5 shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer"
          >
            <span>{selectedDays} hari</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {/* Platform dropdown */}
          <button
            onClick={() =>
              setSelectedPlatform(
                selectedPlatform === 'Semua platform' ? 'Instagram' : 'Semua platform'
              )
            }
            className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1.5 shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>{selectedPlatform}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {/* Run Analysis button */}
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-70"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Menganalisis...' : 'Jalankan analisis'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (lg:col-span-8 space-y-6) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Performa per content pillar */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                  Performa per content pillar
                </h2>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                  sumber: D1 analytics_daily + manual tag
                </p>
              </div>

              {/* Segmented Toggle: Engagement | Reach */}
              <div className="p-0.5 bg-[#F3F4F6] dark:bg-[#222630] rounded-xl flex items-center self-start sm:self-auto">
                <button
                  onClick={() => setMetricMode('engagement')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    metricMode === 'engagement'
                      ? 'bg-white dark:bg-[#161922] text-[#111318] dark:text-[#F3F4F6] shadow-xs'
                      : 'text-[#6B7280] dark:text-[#9CA3AF]'
                  }`}
                >
                  Engagement
                </button>
                <button
                  onClick={() => setMetricMode('reach')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    metricMode === 'reach'
                      ? 'bg-white dark:bg-[#161922] text-[#111318] dark:text-[#F3F4F6] shadow-xs'
                      : 'text-[#6B7280] dark:text-[#9CA3AF]'
                  }`}
                >
                  Reach
                </button>
              </div>
            </div>

            {/* Pillar bars */}
            <div className="space-y-5">
              {pillars.map((pillar, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                        {pillar.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#9CA3AF]">
                        {pillar.konten} konten
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-[#111318] dark:text-[#F3F4F6]">
                        {metricMode === 'engagement' ? pillar.engagement : pillar.reach}
                      </span>
                      <span
                        className={`text-[11px] font-mono flex items-center ${
                          pillar.trend === 'up'
                            ? 'text-[#21A68A]'
                            : pillar.trend === 'down'
                            ? 'text-[#DC6470]'
                            : 'text-[#9CA3AF]'
                        }`}
                      >
                        {pillar.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                        {pillar.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                        {pillar.trend === 'neutral' && <Minus className="w-3 h-3" />}
                        {pillar.delta}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2 bg-[#F3F4F6] dark:bg-[#222630] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        i < 2 ? 'bg-[#5268D8]' : i === 2 ? 'bg-[#8292F0]' : 'bg-[#CBD5E1] dark:bg-[#475569]'
                      }`}
                      style={{ width: pillar.barWidth }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Performa per format */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6">
            <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
              Performa per format
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 mb-5">
              rata-rata engagement · 6 format
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {formats.map((fmt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630]"
                >
                  <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] block mb-1">
                    {fmt.format}
                  </span>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold font-heading text-[#111318] dark:text-[#F3F4F6]">
                      {fmt.value}
                    </span>
                    <span className="text-[11px] font-mono text-[#9CA3AF]">
                      {fmt.posts} post
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E5E7EB] dark:bg-[#272B35] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5268D8] rounded-full"
                      style={{ width: fmt.barWidth }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-4 space-y-6) */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1. Content Gap Card */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
                  Content gap
                </h3>
                <span className="text-[11px] text-[#9CA3AF]">6 peluang</span>
              </div>
              <button
                onClick={() => navigateTo('ideas')}
                className="text-xs text-[#5268D8] hover:text-[#4154B8] dark:text-[#7A8EED] font-medium cursor-pointer"
              >
                Kelola
              </button>
            </div>

            <div className="space-y-4">
              {contentGaps.map((gap, i) => (
                <div
                  key={i}
                  className="pb-3 border-b border-[#F1F3F5] dark:border-[#222630] last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-[#111318] dark:text-[#F3F4F6] leading-snug">
                        {gap.title}
                      </h4>
                      <p className="text-[11px] font-mono text-[#9CA3AF] mt-0.5">
                        {gap.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      onClick={() => handleCreateIdeaFromGap(gap.topic)}
                      className="text-xs text-[#5268D8] hover:text-[#4154B8] dark:text-[#7A8EED] font-medium cursor-pointer"
                    >
                      Buat ide →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Rekomendasi Topik */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
                Rekomendasi topik
              </h3>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                output AI · bukan approval
              </p>
            </div>

            <div className="space-y-4">
              {topicRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630] space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#111318] dark:text-[#F3F4F6] leading-snug">
                      {rec.title}
                    </h4>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 ${
                        rec.priority === 'Tinggi'
                          ? 'bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252B3B] dark:text-[#8292F0]'
                          : 'bg-[#FFF7ED] text-[#C2410C] dark:bg-[#332214] dark:text-[#FB923C]'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
