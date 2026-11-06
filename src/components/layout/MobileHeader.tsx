import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Search, ArrowLeft, Download } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const { activeBrand, activePage, setIsMobileDrawerOpen, setIsAiAssistantOpen, navigateTo } = useApp();

  const getPageInfo = () => {
    switch (activePage) {
      case 'overview':
        return { title: 'Overview', subtitle: activeBrand.name };
      case 'brands':
        return { title: 'Brands', subtitle: '3 aktif · 1 arsip' };
      case 'intelligence':
        return { title: 'Intelligence', subtitle: '1–30 Sep · 4 akun' };
      case 'campaigns':
        return { title: 'Campaigns', subtitle: '4 aktif · 2 selesai' };
      case 'ideas':
        return { title: 'Idea Lab', subtitle: '24 ide · 11 terhubung' };
      case 'creative':
        return { title: 'Creative Studio', subtitle: 'v3 · IN_REVIEW · IG Reel' };
      case 'calendar':
        return { title: 'Content calendar', subtitle: activeBrand.name };
      case 'analytics':
        return { title: 'Analytics', subtitle: `${activeBrand.name} · 1–30 Sep` };
      case 'publishing':
        return { title: 'Publishing', subtitle: '3 job aktif · gate approval' };
      case 'competitors':
        return { title: 'Competitors', subtitle: '6 dipantau · snapshot 28 Sep' };
      case 'integrations':
        return { title: 'Integrations', subtitle: '4 terhubung · 1 perlu otorisasi' };
      case 'settings':
        return { title: 'Settings', subtitle: 'Workspace · 2 pengguna' };
      default:
        return { title: 'Overview', subtitle: activeBrand.name };
    }
  };

  const { title, subtitle } = getPageInfo();
  const isStudio = activePage === 'creative';

  return (
    <header className="lg:hidden h-14 px-3.5 bg-white dark:bg-[#161922] border-b border-[#E5E7EB] dark:border-[#272B35] flex items-center justify-between gap-3 shrink-0 select-none sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        {isStudio ? (
          <button
            onClick={() => navigateTo('overview')}
            aria-label="Kembali"
            className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] dark:hover:bg-[#2D3342] transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Buka menu navigasi"
            className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] dark:hover:bg-[#2D3342] transition-colors shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <h1 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6] leading-tight truncate">
            {title}
          </h1>
          <p className="text-[11px] font-mono text-[#6B7280] dark:text-[#9CA3AF] leading-tight truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {activePage === 'analytics' ? (
          <button
            onClick={() => {
              const csv = 'Platform,Reach,Impresi\nInstagram,842rb,2.1jt\nTikTok,318rb,640rb';
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'analytics-mobile.csv';
              a.click();
            }}
            aria-label="Unduh laporan analitik"
            className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] dark:hover:bg-[#2D3342] transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            aria-label="Cari atau buka AI Assistant"
            className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] dark:hover:bg-[#2D3342] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
