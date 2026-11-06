import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Sparkles, ArrowLeft, Download } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const { activeBrand, activePage, setIsMobileDrawerOpen, setIsAiAssistantOpen, navigateTo, contentItems, campaigns, ideas, competitors, publishingJobs, selectedContent, showToast } = useApp();

  const getPageInfo = () => {
    switch (activePage) {
      case 'overview':
        return { title: 'Overview', subtitle: activeBrand.name };
      case 'brands':
        return { title: 'Brands', subtitle: activeBrand.name };
      case 'intelligence':
        return { title: 'Intelligence', subtitle: '1–30 Sep · 4 akun' };
      case 'campaigns':
        return { title: 'Campaigns', subtitle: `${campaigns.filter(item => item.brandId === activeBrand.id).length} campaign` };
      case 'ideas':
        return { title: 'Idea Lab', subtitle: `${ideas.filter(item => item.brandId === activeBrand.id).length} ide` };
      case 'creative':
        return { title: 'Creative Studio', subtitle: selectedContent ? `v${selectedContent.currentVersion} · ${selectedContent.status}` : 'Belum ada brief' };
      case 'calendar':
        return { title: 'Content calendar', subtitle: activeBrand.name };
      case 'analytics':
        return { title: 'Analytics', subtitle: `${activeBrand.name} · ${contentItems.filter(item => item.brandId === activeBrand.id).length} brief` };
      case 'publishing':
        return { title: 'Publishing', subtitle: `${publishingJobs.filter(item => item.brandId === activeBrand.id).length} job lokal` };
      case 'competitors':
        return { title: 'Competitors', subtitle: `${competitors.filter(item => item.brandId === activeBrand.id).length} kompetitor` };
      case 'integrations':
        return { title: 'Integrations', subtitle: 'OAuth perlu konfigurasi' };
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
              const rows = contentItems.filter(item => item.brandId === activeBrand.id);
              if (!rows.length) {
                showToast('Belum ada brief untuk diekspor.');
                return;
              }
              const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
              const headers = ['Content ID', 'Title', 'Format', 'Funnel', 'Status', 'Created At', 'Scheduled For', 'Published URL'];
              const data = rows.map(item => [item.id, item.title, item.format, item.funnelStage, item.status, item.createdAt || '', item.scheduledFor || '', item.publishedUrl || '']);
              const csv = '\\uFEFF' + [headers, ...data].map(row => row.map(cell).join(',')).join('\\r\\n');
              const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
              const link = document.createElement('a');
              link.href = url;
              link.download = `socmed-manager_${activeBrand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_mobile.csv`;
              document.body.appendChild(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(url);
              showToast(`Export ${rows.length} brief selesai.`);
            }}
            aria-label="Unduh laporan analitik"
            className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] dark:hover:bg-[#2D3342] transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            aria-label="Buka AI Assistant"
            className="w-9 h-9 rounded-xl bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] flex items-center justify-center cursor-pointer hover:bg-[#E5E7EB] dark:hover:bg-[#2D3342] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
