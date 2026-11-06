import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ChevronRight, Bell, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activePage,
    searchQuery,
    setSearchQuery,
    navigateTo,
    currentUser,
    workspace
  } = useApp();

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
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-[#68717E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari workspace..."
            className="w-full pl-8 pr-10 py-1.5 text-xs bg-neutral-50/80 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-[8px] text-[#17191F] dark:text-[#E9EBF0] placeholder-[#68717E] focus:outline-none focus:ring-1 focus:ring-[#5268D8]"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#68717E] bg-white dark:bg-[#171920] border border-[#E7E9ED] dark:border-[#2E3442] px-1.5 py-0.5 rounded-[4px]">
            ⌘K
          </kbd>
        </div>
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
