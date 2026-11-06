import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Download,
  ArrowRight,
  Instagram,
  Facebook,
  Youtube,
  Music,
  Bookmark
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { activeBrand, navigateTo } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'30' | '90'>('30');
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const kpis = [
    { label: 'REACH', value: '1,28 jt', source: 'Meta + TikTok' },
    { label: 'IMPRESI', value: '3,04 jt', source: 'Meta + YouTube' },
    { label: 'VIEWS', value: '742 rb', source: 'YouTube + TikTok' },
    { label: 'ENGAGEMENT', value: '4,7%', source: 'terbobot per platform' },
    { label: 'FOLLOWERS', value: '+8.214', source: 'IG + TikTok' },
  ];

  const platforms = [
    {
      name: 'Instagram',
      icon: <Instagram className="w-4 h-4 text-[#E1306C]" />,
      konten: 62,
      reach: '842 rb',
      impresi: '2,1 jt',
      engage: '5,2%',
      catatan: 'reach = akun unik',
      active: true,
    },
    {
      name: 'TikTok',
      icon: <Music className="w-4 h-4 text-[#111318] dark:text-white" />,
      konten: 38,
      reach: '318 rb',
      impresi: '640 rb',
      engage: '3,9%',
      catatan: 'views = tayang ≥2 detik',
      active: true,
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-4 h-4 text-[#FF0000]" />,
      konten: 24,
      reach: '96 rb',
      impresi: '214 rb',
      engage: '4,1%',
      catatan: 'views ≠ impresi',
      active: true,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4 text-[#1877F2]" />,
      konten: 18,
      reach: '24 rb',
      impresi: '96 rb',
      engage: '2,6%',
      catatan: 'reach organik',
      active: true,
    },
    {
      name: 'Pinterest',
      icon: <Bookmark className="w-4 h-4 text-[#BD081C]" />,
      konten: 0,
      reach: '—',
      impresi: '—',
      engage: '—',
      catatan: 'analytics belum diotorisasi',
      active: false,
    },
  ];

  const funnels = [
    { stage: 'TOFU Awareness', value: '5,4%', width: '76%' },
    { stage: 'MOFU Consideration', value: '4,1%', width: '58%' },
    { stage: 'BOFU Conversion', value: '2,8%', width: '39%' },
  ];

  const handleExport = () => {
    const csvContent =
      'Platform,Konten,Reach,Impresi,Engagement,Catatan\n' +
      platforms
        .map(
          (p) =>
            `"${p.name}",${p.konten},"${p.reach}","${p.impresi}","${p.engage}","${p.catatan}"`
        )
        .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_${activeBrand.name.toLowerCase().replace(/\s+/g, '_')}_sep2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Analytics
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            1–30 Sep 2025 · 4 akun terhubung · 142 konten · semua metrik menyertakan sumber
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="relative">
            <button
              onClick={() => setSelectedPeriod(selectedPeriod === '30' ? '90' : '30')}
              className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1.5 shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer"
            >
              <span>{selectedPeriod} hari</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          </div>

          {/* Brand Selector */}
          <div className="relative">
            <button
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1.5 shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeBrand.themeColor || '#B85D2A' }}
              />
              <span>{activeBrand.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1.5 shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Ekspor</span>
          </button>
        </div>
      </div>

      {/* Top KPI: 2x2 on Mobile, 5-col on Desktop */}
      <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs overflow-hidden">
        {/* Mobile 2x2 Grid */}
        <div className="grid grid-cols-2 divide-x divide-y divide-[#E5E7EB] dark:divide-[#272B35] sm:hidden">
          {kpis.slice(0, 4).map((kpi, idx) => (
            <div key={idx} className="p-4">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#6B7280] dark:text-[#9CA3AF]">
                {kpi.label}
              </span>
              <div className="text-xl font-bold font-heading text-[#111318] dark:text-[#F3F4F6] mt-0.5 tracking-tight">
                {kpi.value}
              </div>
              <p className="text-[10px] font-mono text-[#9CA3AF] dark:text-[#6B7280] mt-0.5">
                {kpi.source}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop 5-col Strip */}
        <div className="hidden sm:grid sm:grid-cols-5 divide-x divide-[#E5E7EB] dark:divide-[#272B35]">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="p-5">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#6B7280] dark:text-[#9CA3AF]">
                {kpi.label}
              </span>
              <div className="text-2xl font-bold font-heading text-[#111318] dark:text-[#F3F4F6] mt-1 tracking-tight">
                {kpi.value}
              </div>
              <p className="text-[11px] font-mono text-[#9CA3AF] dark:text-[#6B7280] mt-1">
                {kpi.source}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Perbandingan platform (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                  Perbandingan platform
                </h2>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                  sumber: API tiap platform · normalisasi dicatat di kanan
                </p>
              </div>
              <button
                onClick={() => navigateTo('integrations')}
                className="text-xs text-[#5268D8] hover:text-[#4154B8] dark:text-[#7A8EED] font-medium flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                Detail per platform <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Desktop 6-Column Table (hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#272B35] text-[10px] font-mono uppercase text-[#9CA3AF] dark:text-[#6B7280]">
                    <th className="pb-3 font-medium">PLATFORM</th>
                    <th className="pb-3 font-medium">KONTEN</th>
                    <th className="pb-3 font-medium">REACH</th>
                    <th className="pb-3 font-medium">IMPRESI</th>
                    <th className="pb-3 font-medium">ENGAGE</th>
                    <th className="pb-3 font-medium">CATATAN DEFINISI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5] dark:divide-[#222630]">
                  {platforms.map((p, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24] transition-colors"
                    >
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] dark:bg-[#222630] flex items-center justify-center shrink-0">
                            {p.icon}
                          </div>
                          <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-[#6B7280] dark:text-[#9CA3AF] tabular-nums">
                        {p.konten}
                      </td>
                      <td className="py-3.5 font-mono text-[#111318] dark:text-[#F3F4F6] font-medium tabular-nums">
                        {p.reach}
                      </td>
                      <td className="py-3.5 font-mono text-[#111318] dark:text-[#F3F4F6] font-medium tabular-nums">
                        {p.impresi}
                      </td>
                      <td className="py-3.5 font-mono text-[#111318] dark:text-[#F3F4F6] font-medium tabular-nums">
                        {p.engage}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`font-mono text-[11px] ${
                            p.active
                              ? 'text-[#6B7280] dark:text-[#9CA3AF]'
                              : 'text-[#9CA3AF] dark:text-[#6B7280] italic'
                          }`}
                        >
                          {p.catatan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile-Native Platform Bar List (matching Mobile_Analytics_5b977067.png) */}
            <div className="sm:hidden space-y-4 pt-1">
              {[
                { name: 'Instagram', icon: <Instagram className="w-4 h-4 text-[#E1306C]" />, reach: '842 rb', engage: '5,2%', pct: 78 },
                { name: 'TikTok', icon: <Music className="w-4 h-4 text-[#111318] dark:text-white" />, reach: '318 rb', engage: '3,9%', pct: 45 },
                { name: 'YouTube', icon: <Youtube className="w-4 h-4 text-[#FF0000]" />, reach: '96 rb', engage: '4,1%', pct: 28 },
                { name: 'Facebook', icon: <Facebook className="w-4 h-4 text-[#1877F2]" />, reach: '24 rb', engage: '2,6%', pct: 15 }
              ].map((plat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#F3F4F6] dark:bg-[#222630] flex items-center justify-center shrink-0">
                        {plat.icon}
                      </div>
                      <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                        {plat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono text-xs">
                      <span className="text-[#6B7280] dark:text-[#9CA3AF]">{plat.reach}</span>
                      <span className="font-bold text-[#111318] dark:text-[#F3F4F6]">{plat.engage}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#F3F4F6] dark:bg-[#222630] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5268D8] rounded-full transition-all duration-300"
                      style={{ width: `${plat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (lg:col-span-4 space-y-5) */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. Performa Funnel */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5">
            <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
              Performa funnel
            </h3>
            <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 mb-4">
              engagement per stage · Sep
            </p>

            <div className="space-y-4">
              {funnels.map((f, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#111318] dark:text-[#F3F4F6]">
                      {f.stage}
                    </span>
                    <span className="font-mono font-bold text-[#111318] dark:text-[#F3F4F6]">
                      {f.value}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F3F4F6] dark:bg-[#222630] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5268D8] rounded-full"
                      style={{ width: f.width }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-[#9CA3AF] dark:text-[#6B7280] mt-4 pt-3 border-t border-[#F1F3F5] dark:border-[#222630]">
              BOFU kurang 6 konten untuk kesimpulan stabil.
            </p>
          </div>

          {/* 2. Rekomendasi AI */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
                Rekomendasi AI
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#252B3B] text-[10px] font-mono font-bold text-[#5268D8] dark:text-[#8292F0]">
                  GPT
                </span>
                <span className="text-[11px] text-[#9CA3AF]">· 4 temuan</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <h4 className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                  Naikkan porsi Shorts
                </h4>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 leading-relaxed">
                  Shorts 5,4% vs Reel 6,2% dengan biaya produksi 40% lebih rendah.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                  Kurangi Story promo
                </h4>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] mt-0.5 leading-relaxed">
                  Story promo 0,9% menarik 3× lebih sedikit interaksi.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('campaigns')}
                  className="text-xs text-[#5268D8] hover:text-[#4154B8] dark:text-[#7A8EED] font-medium flex items-center gap-1 cursor-pointer"
                >
                  Buat rencana →
                </button>
              </div>
            </div>
          </div>

          {/* 3. Catatan Normalisasi */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5">
            <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
              Catatan normalisasi
            </h3>
            <p className="text-[10px] font-mono text-[#9CA3AF] dark:text-[#6B7280] mt-0.5 mb-2.5">
              wajib dibaca sebelum membandingkan
            </p>

            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              Engagement dihitung dari interaksi ÷ impresi. Instagram memakai reach sebagai basis, TikTok memakai views — angka disesuaikan ke impresi agar sebanding.
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#F1F3F5] dark:border-[#222630]">
              <span className="px-2 py-0.5 rounded-md bg-[#F3F4F6] dark:bg-[#222630] text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                basis: impresi
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#F3F4F6] dark:bg-[#222630] text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                reach ≠ views
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#F3F4F6] dark:bg-[#222630] text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                pinterest: n/a
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
