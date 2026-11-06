import React, { useState } from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Megaphone,
  Lightbulb,
  PenTool,
  Calendar,
  BarChart3,
  Send,
  Eye,
  Share2,
  Settings,
  ChevronDown,
  ChevronsUpDown,
  Moon,
  Sun,
  MoreHorizontal
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const {
    activePage,
    navigateTo,
    activeBrand,
    activeBrandId,
    switchBrand,
    brands,
    theme,
    toggleTheme,
    currentUser,
    publishingJobs,
    workspace
  } = useApp();

  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  const scheduledCount = publishingJobs.filter(j => j.status === 'SCHEDULED' || j.status === 'QUEUED').length;

  const mainNavItems: { id: AppPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'brands', label: 'Brands', icon: <Layers className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'intelligence', label: 'Intelligence', icon: <Sparkles className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'campaigns', label: 'Campaigns', icon: <Megaphone className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'ideas', label: 'Idea Lab', icon: <Lightbulb className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'creative', label: 'Creative Studio', icon: <PenTool className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'calendar', label: 'Content Calendar', icon: <Calendar className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 stroke-[1.8]" /> }
  ];

  const managementNavItems: { id: AppPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'publishing', label: 'Publishing', icon: <Send className="w-4 h-4 stroke-[1.8]" />, badge: 4 },
    { id: 'competitors', label: 'Competitors', icon: <Eye className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'integrations', label: 'Integrations', icon: <Share2 className="w-4 h-4 stroke-[1.8]" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 stroke-[1.8]" /> }
  ];

  return (
    <aside className={`w-[240px] shrink-0 h-screen flex flex-col bg-white dark:bg-[#171920] border-r border-[#E7E9ED] dark:border-[#262B35] select-none ${className}`}>
      {/* 1. Header: Logo & Workspace */}
      <div className="p-4 pb-3 space-y-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] flex items-center justify-center font-bold shadow-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-base tracking-tight text-[#17191F] dark:text-[#E9EBF0]">
              Kompas
            </span>
            <span className="font-mono text-[9px] tracking-wider text-[#68717E] dark:text-[#9BA3B2] uppercase">
              INTELLIGENCE
            </span>
          </div>
        </div>

        {/* Workspace Selector */}
        <div className="flex items-center justify-between p-1.5 rounded-[8px] hover:bg-neutral-50 dark:hover:bg-[#20242D] cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#E0E7FF] dark:bg-[#2E3650] text-[#5268D8] dark:text-[#8292F0] flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
              NS
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] truncate leading-tight">
                {workspace.name}
              </p>
              <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] truncate leading-tight mt-0.5">
                {workspace.plan}
              </p>
            </div>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#68717E] shrink-0" />
        </div>
      </div>

      {/* 2. Active Brand Selector Card */}
      <div className="px-3 pb-3 relative">
        <div className="px-1.5 mb-1.5 text-[9px] font-mono tracking-wider text-[#68717E] dark:text-[#9BA3B2] uppercase">
          ACTIVE BRAND
        </div>
        <button
          onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
          aria-expanded={isBrandDropdownOpen}
          className="w-full flex items-center justify-between p-2 rounded-[10px] bg-neutral-50/80 dark:bg-[#20242D] hover:bg-neutral-100 dark:hover:bg-[#262B35] border border-[#E7E9ED] dark:border-[#2E3442] transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-[8px] bg-[#B85D2A] text-white flex items-center justify-center font-bold text-xs font-heading shrink-0 shadow-2xs">
              {activeBrand.logo}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0] truncate leading-tight">
                {activeBrand.name}
              </p>
              <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] truncate leading-tight mt-0.5">
                {activeBrand.category} · {activeBrand.campaignCount} campaigns
              </p>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-[#68717E] transition-transform shrink-0 ${isBrandDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isBrandDropdownOpen && (
          <div className="absolute top-full left-3 right-3 mt-1 p-1 bg-white dark:bg-[#20242D] rounded-[10px] border border-[#E7E9ED] dark:border-[#2E3442] shadow-xl z-30">
            {brands.map(brand => (
              <button
                key={brand.id}
                onClick={() => {
                  switchBrand(brand.id);
                  setIsBrandDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[6px] text-xs transition-colors ${
                  brand.id === activeBrandId
                    ? 'bg-[#EEF2FF] text-[#5268D8] font-semibold dark:bg-[#2B334E] dark:text-[#8292F0]'
                    : 'text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-100 dark:hover:bg-[#262B35]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="w-5 h-5 rounded-[5px] bg-[#B85D2A] text-white text-[10px] flex items-center justify-center font-bold">
                    {brand.logo}
                  </span>
                  <span className="truncate">{brand.name}</span>
                </div>
                <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                  {brand.campaignCount}c
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
        <div>
          <div className="px-2 mb-1.5 text-[9px] font-mono tracking-wider text-[#68717E] dark:text-[#9BA3B2] uppercase">
            WORKSPACE
          </div>
          <nav className="space-y-0.5">
            {mainNavItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#EEF2FF] dark:bg-[#22283A] text-[#5268D8] dark:text-[#8292F0] font-semibold'
                      : 'text-[#68717E] dark:text-[#9BA3B2] hover:text-[#17191F] dark:hover:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-[#5268D8] dark:text-[#8292F0]' : 'text-[#68717E] dark:text-[#9BA3B2]'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#E0E7FF] text-[#5268D8] dark:bg-[#2E3650] dark:text-[#8292F0] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-2 mb-1.5 text-[9px] font-mono tracking-wider text-[#68717E] dark:text-[#9BA3B2] uppercase">
            MANAGEMENT
          </div>
          <nav className="space-y-0.5">
            {managementNavItems.map(item => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[8px] text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#EEF2FF] dark:bg-[#22283A] text-[#5268D8] dark:text-[#8292F0] font-semibold'
                      : 'text-[#68717E] dark:text-[#9BA3B2] hover:text-[#17191F] dark:hover:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-[#5268D8] dark:text-[#8292F0]' : 'text-[#68717E] dark:text-[#9BA3B2]'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#E0E7FF] text-[#5268D8] dark:bg-[#2E3650] dark:text-[#8292F0] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 4. Bottom Controls: Theme, Queue Card, User Account */}
      <div className="p-3 border-t border-[#E7E9ED] dark:border-[#262B35] space-y-2.5 shrink-0 bg-neutral-50/40 dark:bg-[#171920]">
        {/* Light / Dark Mode Toggle Pill */}
        <div className="grid grid-cols-2 p-0.5 bg-neutral-100 dark:bg-[#222631] rounded-[8px] border border-[#E7E9ED] dark:border-[#2E3442] text-xs">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`flex items-center justify-center gap-1.5 py-1 rounded-[6px] text-xs transition-colors ${
              theme === 'light'
                ? 'bg-white dark:bg-[#2B303E] text-[#17191F] dark:text-[#E9EBF0] font-semibold shadow-2xs'
                : 'text-[#68717E] dark:text-[#9BA3B2]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`flex items-center justify-center gap-1.5 py-1 rounded-[6px] text-xs transition-colors ${
              theme === 'dark'
                ? 'bg-white dark:bg-[#2B303E] text-[#17191F] dark:text-[#E9EBF0] font-semibold shadow-2xs'
                : 'text-[#68717E] dark:text-[#9BA3B2]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>

        {/* Publishing Queue Widget */}
        <div
          onClick={() => navigateTo('publishing')}
          className="p-2.5 rounded-[9px] bg-white dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] cursor-pointer hover:border-[#5268D8]/50 transition-colors"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#21A68A]" />
              <span className="font-semibold text-[#17191F] dark:text-[#E9EBF0]">Publishing queue</span>
            </div>
            <span className="font-mono font-bold text-xs text-[#17191F] dark:text-[#E9EBF0]">
              {scheduledCount || 3}
            </span>
          </div>
          <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            next 18:30 · IG Reel
          </p>
        </div>

        {/* User Account Row */}
        <div className="flex items-center justify-between pt-1">
          <div
            onClick={() => navigateTo('settings')}
            className="flex items-center gap-2 min-w-0 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] flex items-center justify-center font-bold text-[10px] font-mono shrink-0">
              {currentUser.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] truncate leading-tight mt-0.5">
                {currentUser.role} · Cloudflare Access
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('settings')}
            className="p-1 rounded-[6px] text-[#68717E] hover:text-[#17191F] dark:text-[#9BA3B2] dark:hover:text-[#E9EBF0] hover:bg-neutral-100 dark:hover:bg-[#20242D]"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
