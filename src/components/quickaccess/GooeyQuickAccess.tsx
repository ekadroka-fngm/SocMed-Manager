import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Lightbulb,
  Megaphone,
  PenTool,
  Calendar,
  Compass,
  X,
  LayoutDashboard,
  Send,
  Settings,
  Eye,
  Check,
  RotateCw,
  Save
} from 'lucide-react';

export const GooeyQuickAccess: React.FC = () => {
  const {
    isQuickAccessOpen,
    setIsQuickAccessOpen,
    setIsAssistantOpen,
    navigateTo,
    createContentItem,
    openScheduleModal,
    activeBrand,
    activePage,
    selectedContent,
    approveContentItem,
    requestChangesOnItem
  } = useApp();

  const handleOpenAI = () => {
    setIsAssistantOpen(true);
    setIsQuickAccessOpen(false);
  };

  const handleNewContent = () => {
    createContentItem({ brandId: activeBrand.id });
    navigateTo('creative');
    setIsQuickAccessOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* 1. Desktop Pop-Up Action Pills */}
      {isQuickAccessOpen && (
        <div className="hidden sm:flex flex-col items-end gap-2.5 mb-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* AI Assistant Pill */}
          <button
            onClick={handleOpenAI}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#17191F] text-white hover:bg-neutral-800 text-xs font-semibold shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span>AI Assistant</span>
          </button>

          {/* Ide Baru */}
          <button
            onClick={() => {
              navigateTo('ideas');
              setIsQuickAccessOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#1B1E25] text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D] border border-[#E7E9ED] dark:border-[#292E38] text-xs font-medium shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#5268D8] dark:text-[#8292F0]" />
            <span>Ide baru</span>
          </button>

          {/* Campaign Baru */}
          <button
            onClick={() => {
              navigateTo('campaigns');
              setIsQuickAccessOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#1B1E25] text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D] border border-[#E7E9ED] dark:border-[#292E38] text-xs font-medium shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5 text-[#5268D8] dark:text-[#8292F0]" />
            <span>Campaign baru</span>
          </button>

          {/* Konten Baru */}
          <button
            onClick={handleNewContent}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#1B1E25] text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D] border border-[#E7E9ED] dark:border-[#292E38] text-xs font-medium shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5 text-[#5268D8] dark:text-[#8292F0]" />
            <span>Konten baru</span>
          </button>

          {/* Jadwalkan */}
          <button
            onClick={() => {
              openScheduleModal();
              setIsQuickAccessOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#1B1E25] text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D] border border-[#E7E9ED] dark:border-[#292E38] text-xs font-medium shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#5268D8] dark:text-[#8292F0]" />
            <span>Jadwalkan</span>
          </button>

          {/* Navigasi */}
          <button
            onClick={() => {
              navigateTo('overview');
              setIsQuickAccessOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#1B1E25] text-[#17191F] dark:text-[#E9EBF0] hover:bg-neutral-50 dark:hover:bg-[#20242D] border border-[#E7E9ED] dark:border-[#292E38] text-xs font-medium shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#5268D8] dark:text-[#8292F0]" />
            <span>Navigasi</span>
          </button>
        </div>
      )}

      {/* 2. Mobile Pop-Up Card Matching Mobile_Quick_Access_a238a044.png */}
      {isQuickAccessOpen && (
        <div className="sm:hidden mb-3.5 w-[280px] p-4 bg-white dark:bg-[#1B1E25] rounded-[18px] border border-[#E7E9ED] dark:border-[#2E3442] shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Action List */}
          <div className="space-y-1.5 text-xs font-medium">
            {activePage === 'creative' && selectedContent?.status === 'IN_REVIEW' ? (
              <>
                <button
                  onClick={() => {
                    approveContentItem(selectedContent.id);
                    setIsQuickAccessOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] bg-[#1E8E3E] text-white font-semibold"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Setujui</span>
                </button>
                <button
                  onClick={() => {
                    requestChangesOnItem(selectedContent.id, 'Revisi via mobile');
                    setIsQuickAccessOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-neutral-100 dark:hover:bg-[#20242D] text-[#D97706]"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Minta revisi</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    handleNewContent();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] hover:bg-neutral-100 dark:hover:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0]"
                >
                  <Save className="w-4 h-4 text-[#68717E]" />
                  <span>Simpan</span>
                </button>
                <button
                  onClick={() => {
                    navigateTo('creative');
                    setIsQuickAccessOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] bg-[#5268D8] text-white font-semibold"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim review</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                navigateTo('creative');
                setIsQuickAccessOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] hover:bg-neutral-100 dark:hover:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0]"
            >
              <Eye className="w-4 h-4 text-[#68717E]" />
              <span>Pratinjau</span>
            </button>
          </div>

          <div className="border-t border-[#E7E9ED] dark:border-[#2E3442]" />

          {/* Tools Grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <button
              onClick={handleOpenAI}
              className="flex flex-col items-center gap-1 p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]"
            >
              <Sparkles className="w-4 h-4 text-[#5268D8]" />
              <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">AI</span>
            </button>
            <button
              onClick={() => {
                navigateTo('ideas');
                setIsQuickAccessOpen(false);
              }}
              className="flex flex-col items-center gap-1 p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]"
            >
              <Lightbulb className="w-4 h-4 text-[#5268D8]" />
              <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">Ide</span>
            </button>
            <button
              onClick={handleNewContent}
              className="flex flex-col items-center gap-1 p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]"
            >
              <PenTool className="w-4 h-4 text-[#5268D8]" />
              <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">Konten</span>
            </button>
            <button
              onClick={() => {
                openScheduleModal();
                setIsQuickAccessOpen(false);
              }}
              className="flex flex-col items-center gap-1 p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D]"
            >
              <Calendar className="w-4 h-4 text-[#5268D8]" />
              <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">Jadwal</span>
            </button>
          </div>

          <div className="border-t border-[#E7E9ED] dark:border-[#2E3442]" />

          {/* Quick Nav Icons */}
          <div className="flex items-center justify-around text-[#68717E] dark:text-[#9BA3B2] pt-0.5">
            <button onClick={() => { navigateTo('overview'); setIsQuickAccessOpen(false); }}>
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <button onClick={() => { navigateTo('calendar'); setIsQuickAccessOpen(false); }}>
              <Calendar className="w-4 h-4" />
            </button>
            <button onClick={() => { navigateTo('creative'); setIsQuickAccessOpen(false); }}>
              <PenTool className="w-4 h-4" />
            </button>
            <button onClick={() => { navigateTo('publishing'); setIsQuickAccessOpen(false); }}>
              <Send className="w-4 h-4" />
            </button>
            <button onClick={() => { navigateTo('settings'); setIsQuickAccessOpen(false); }}>
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Floating Trigger Button */}
      <button
        onClick={() => setIsQuickAccessOpen(!isQuickAccessOpen)}
        aria-label="Toggle Quick Access Menu"
        className="w-14 h-14 rounded-full bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer ml-auto"
      >
        {isQuickAccessOpen ? (
          <X className="w-5 h-5 stroke-[2.5]" />
        ) : (
          <Sparkles className="w-5 h-5 text-white dark:text-[#17191F] stroke-[2.2]" />
        )}
      </button>
    </div>
  );
};
