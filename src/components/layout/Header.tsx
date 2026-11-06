import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ChevronRight, Bell, HelpCircle, FileText, Lightbulb, Target, Tag, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    searchQuery,
    setSearchQuery,
    navigateTo,
    currentUser,
    workspace,
    brands,
    campaigns,
    contentItems,
    ideas,
    switchBrand
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: Array<{ id: string; title: string; detail: string; icon: React.ReactNode; select: () => void }> = [];
    brands.filter(item => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
      .slice(0, 4).forEach(item => results.push({
        id: `brand-${item.id}`, title: item.name, detail: `Brand · ${item.category}`,
        icon: <Tag className="w-3.5 h-3.5"/>,
        select: () => { switchBrand(item.id); navigateTo('brands'); }
      }));
    campaigns.filter(item => item.name.toLowerCase().includes(query) || item.objective.toLowerCase().includes(query))
      .slice(0, 4).forEach(item => results.push({
        id: `campaign-${item.id}`, title: item.name, detail: 'Campaign',
        icon: <Target className="w-3.5 h-3.5"/>,
        select: () => navigateTo('campaigns', { campaignId: item.id })
      }));
    contentItems.filter(item => item.title.toLowerCase().includes(query) || item.hook.toLowerCase().includes(query))
      .slice(0, 5).forEach(item => results.push({
        id: `content-${item.id}`, title: item.title, detail: `Konten · ${item.status}`,
        icon: <FileText className="w-3.5 h-3.5"/>,
        select: () => navigateTo('creative', { contentId: item.id })
      }));
    ideas.filter(item => item.title.toLowerCase().includes(query) || (item.topic || '').toLowerCase().includes(query))
      .slice(0, 4).forEach(item => results.push({
        id: `idea-${item.id}`, title: item.title, detail: `Ide · ${item.funnelStage}`,
        icon: <Lightbulb className="w-3.5 h-3.5"/>,
        select: () => navigateTo('ideas')
      }));
    return results.slice(0, 10);
  }, [searchQuery, brands, campaigns, contentItems, ideas, switchBrand, navigateTo]);

  const selectSearchResult = (result: (typeof searchResults)[number]) => {
    result.select();
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
        window.setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      if (event.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  const pageTitles: Record<string, string> = {
    overview: 'Overview',
    brands: 'Brands',
    intelligence: 'Intelligence',
    campaigns: 'Campaigns',
    ideas: 'Idea Lab',
    creative: 'Creative Studio',
    calendar: 'Content Calendar',
    analytics: 'Analytics',
    publishing: 'Publishing',
    competitors: 'Competitors',
    integrations: 'Integrations',
    settings: 'Settings'
  };

  return (
    <header className="h-14 px-6 bg-white dark:bg-[#171920] border-b border-[#E7E9ED] dark:border-[#262B35] flex items-center justify-between gap-4 shrink-0 select-none">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-[#68717E] dark:text-[#9BA3B2] min-w-0">
        <span
          className="hover:text-[#17191F] dark:hover:text-[#E9EBF0] cursor-pointer"
          onClick={() => navigateTo('overview')}
        >
          {workspace.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-[#68717E]/40 shrink-0" />
        <span className="font-semibold text-[#17191F] dark:text-[#E9EBF0] truncate">
          {pageTitles[activePage] || 'Overview'}
        </span>
      </div>

      {/* 2. Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#68717E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={event => { setSearchQuery(event.target.value); setIsSearchOpen(true); }}
            onKeyDown={event => {
              if (event.key === 'Enter' && searchResults[0]) { event.preventDefault(); selectSearchResult(searchResults[0]); }
            }}
            placeholder="Cari brand, campaign, konten..."
            aria-label="Cari brand, campaign, ide, atau konten"
            aria-expanded={isSearchOpen && Boolean(searchQuery.trim())}
            className="w-full pl-8 pr-10 py-1.5 text-xs bg-neutral-50/80 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-[8px] text-[#17191F] dark:text-[#E9EBF0] placeholder-[#68717E] focus:outline-none focus:ring-1 focus:ring-[#5268D8]"
          />
          {searchQuery && <button type="button" onClick={() => {setSearchQuery('');setIsSearchOpen(false);}} aria-label="Hapus pencarian" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#68717E] hover:text-[#17191F]"><X className="w-3 h-3"/></button>}
          {!searchQuery && <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#68717E] bg-white dark:bg-[#171920] border border-[#E7E9ED] dark:border-[#2E3442] px-1.5 py-0.5 rounded-[4px]">⌘K</kbd>}
        </div>
        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-[#E7E9ED] dark:border-[#2E3442] bg-white dark:bg-[#1B1E25] shadow-xl p-1.5 max-h-[360px] overflow-y-auto">
            {searchResults.length ? searchResults.map(result => (
              <button key={result.id} type="button" onMouseDown={event => event.preventDefault()} onClick={() => selectSearchResult(result)} className="w-full flex items-center gap-2.5 text-left px-2.5 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#262B35]">
                <span className="text-[#5268D8]">{result.icon}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-[#17191F] dark:text-[#E9EBF0]">{result.title}</span><span className="block text-[10px] text-[#68717E] dark:text-[#9BA3B2]">{result.detail}</span></span>
              </button>
            )) : <p className="px-3 py-4 text-xs text-[#68717E]">Tidak ada hasil untuk “{searchQuery}”.</p>}
          </div>
        )}
      </div>

      {/* 3. Utility Icons: Notifications, Help, User Avatar */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={() => navigateTo('publishing')}
          className="relative p-2 rounded-[8px] text-[#68717E] hover:text-[#17191F] dark:text-[#9BA3B2] dark:hover:text-[#E9EBF0] hover:bg-neutral-100 dark:hover:bg-[#20242D] transition-colors"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#DC6470]" />
        </button>

        <button
          onClick={() => navigateTo('settings')}
          className="p-2 rounded-[8px] text-[#68717E] hover:text-[#17191F] dark:text-[#9BA3B2] dark:hover:text-[#E9EBF0] hover:bg-neutral-100 dark:hover:bg-[#20242D] transition-colors"
          title="Bantuan & Dokumentasi"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User avatar indicator */}
        <div
          onClick={() => navigateTo('settings')}
          className="w-7 h-7 rounded-full bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] flex items-center justify-center font-bold text-[10px] font-mono cursor-pointer shadow-2xs hover:opacity-90 transition-opacity ml-1"
          title={`${currentUser.name} (${currentUser.role})`}
        >
          {currentUser.avatar}
        </div>
      </div>
    </header>
  );
};
