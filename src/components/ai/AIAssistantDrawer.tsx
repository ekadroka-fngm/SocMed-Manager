import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Plus, Send } from 'lucide-react';

export const AIAssistantDrawer: React.FC = () => {
  const {
    isAssistantOpen,
    setIsAssistantOpen,
    aiMessages,
    sendAIMessage,
    isAILoading,
    activeBrand,
    activePage
  } = useApp();

  const [inputVal, setInputVal] = useState('');

  if (!isAssistantOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isAILoading) return;
    const msg = inputVal;
    setInputVal('');
    await sendAIMessage(msg);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendAIMessage(prompt);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-white dark:bg-[#1B1E25] border-l border-[#E7E9ED] dark:border-[#292E38] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 select-none">
      {/* 1. Header Matching Reference */}
      <div className="p-4 border-b border-[#E7E9ED] dark:border-[#292E38] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#17191F] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  AI Assistant
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#5268D8]/10 text-[#5268D8] dark:text-[#8292F0] font-semibold">
                  ● GPT-5
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                Konteks: {activePage.charAt(0).toUpperCase() + activePage.slice(1)} · {activeBrand.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuickPrompt('Mulai analisis sesi baru')}
              className="p-1.5 rounded-[6px] text-[#68717E] hover:text-[#17191F] hover:bg-neutral-100 dark:hover:bg-[#20242D]"
              title="Sesi baru"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAssistantOpen(false)}
              className="p-1.5 rounded-[6px] text-[#68717E] hover:text-[#17191F] hover:bg-neutral-100 dark:hover:bg-[#20242D]"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Context Tags */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block">
            KONTEKS AKTIF
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Overview', 'Arunika Coffee', 'Panen Raya Gayo', 'D1 analytics 30 hari', '6 snapshot kompetitor'].map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-[#20242D] text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {aiMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
                <div className="w-4 h-4 rounded-full bg-[#17191F] text-white flex items-center justify-center font-bold text-[8px]">
                  ✦
                </div>
                <span>Assistant</span>
              </div>
            )}

            <div
              className={`p-3.5 rounded-[12px] max-w-[92%] leading-relaxed whitespace-pre-line text-xs ${
                msg.sender === 'user'
                  ? 'bg-[#EEF2FF] text-[#17191F] dark:bg-[#252A38] dark:text-[#E9EBF0] font-medium'
                  : 'bg-neutral-50 dark:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0] border border-[#E7E9ED]/80 dark:border-[#2E3442]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isAILoading && (
          <div className="flex items-center gap-2 text-xs text-[#5268D8] font-mono animate-pulse">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Menganalisis data workspace...</span>
          </div>
        )}
      </div>

      {/* 3. Footer: Suggestions & Input Bar */}
      <div className="p-4 border-t border-[#E7E9ED] dark:border-[#292E38] space-y-3 bg-neutral-50/50 dark:bg-[#1B1E25]">
        {/* Suggestion Pills */}
        <div className="space-y-1">
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] block">
            SARAN LANJUTAN
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              'Buat brief testimoni',
              'Susun ulang funnel',
              'Bandingkan kompetitor'
            ].map(sug => (
              <button
                key={sug}
                onClick={() => handleQuickPrompt(sug)}
                className="px-2.5 py-1 rounded-[6px] bg-white dark:bg-[#20242D] hover:bg-[#EEF2FF] dark:hover:bg-[#252A38] border border-[#E7E9ED] dark:border-[#2E3442] text-[10px] font-mono text-[#5268D8] dark:text-[#8292F0] transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Tanya brand, campaign, atau konten..."
            className="w-full pl-3.5 pr-11 py-2 text-xs bg-white dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-[10px] text-[#17191F] dark:text-[#E9EBF0] placeholder-[#68717E] focus:outline-none focus:ring-1 focus:ring-[#5268D8]"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isAILoading}
            className="absolute right-1.5 w-7 h-7 rounded-[7px] bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition-opacity cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
