import React from 'react';
import { useApp } from '../../context/AppContext';
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
  Target,
  Share2,
  Settings,
  ChevronsUpDown,
  Moon,
  Sun,
  X
} from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const {
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    activePage,
    navigateTo,
    activeBrand,
    brands,
    selectBrand,
    theme,
    toggleTheme,
    currentUser,
    contentItems,
  } = useApp();

  if (!isMobileDrawerOpen) return null;

  const pendingApprovalsCount = contentItems.filter(
    (c) => c.status === 'IN_REVIEW' || c.status === 'APPROVED'
  ).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'brands', label: 'Brands', icon: Layers },
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'ideas', label: 'Idea Lab', icon: Lightbulb },
    { id: 'creative', label: 'Creative Studio', icon: PenTool },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'publishing', label: 'Publishing', icon: Send, badge: pendingApprovalsCount },
    { id: 'competitors', label: 'Competitors', icon: Target },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer content matching Mobile_Drawer_bda52421.png */}
      <div className="relative w-[300px] max-w-[85vw] h-full bg-white dark:bg-[#161922] shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
        {/* Top Logo & Close Button */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#272B35]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#111318] dark:bg-white flex items-center justify-center text-white dark:text-[#111318]">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <span className="font-heading font-bold text-sm tracking-tight text-[#111318] dark:text-[#F3F4F6]">
              Kompas
            </span>
          </div>

          <button
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Tutup navigasi"
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111318] dark:text-[#9CA3AF] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Card */}
        <div className="p-3 border-b border-[#E5E7EB] dark:border-[#272B35]">
          <div
            onClick={() => {
              // Cycle to next brand if clicked
              const nextIndex =
                (brands.findIndex((b) => b.id === activeBrand.id) + 1) % brands.length;
              selectBrand(brands[nextIndex].id);
            }}
            className="p-2.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] flex items-center justify-between cursor-pointer hover:bg-[#F3F4F6] dark:hover:bg-[#222630] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-lg text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-xs"
                style={{ backgroundColor: activeBrand.themeColor || '#B85D2A' }}
              >
                {activeBrand.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6] truncate">
                  {activeBrand.name}
                </h4>
                <p className="text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                  Private · 2 members
                </p>
              </div>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF]">
            WORKSPACE
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id as any);
                  setIsMobileDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#5268D8] dark:bg-[#22283A] dark:text-[#8292F0] font-semibold'
                    : 'text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24] hover:text-[#111318] dark:hover:text-[#F3F4F6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#5268D8] dark:text-[#8292F0]' : 'text-[#9CA3AF]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-[#5268D8]/10 text-[#5268D8] dark:bg-[#5268D8]/20 dark:text-[#8292F0]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User profile & quick theme at bottom */}
        <div className="p-3 border-t border-[#E5E7EB] dark:border-[#272B35] flex items-center justify-between bg-[#F9FAFB] dark:bg-[#1A1D24]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.avatar}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6] truncate">
                {currentUser.name}
              </h5>
              <p className="text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                {currentUser.role}
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle tema gelap / terang"
            className="w-8 h-8 rounded-xl bg-white dark:bg-[#222630] border border-[#E5E7EB] dark:border-[#272B35] flex items-center justify-center text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-white cursor-pointer"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
