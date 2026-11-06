import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Save,
  Send,
  RotateCw,
  MoreHorizontal,
  Check,
  Music,
  Heart,
  MessageCircle,
  Share2,
  ChevronDown,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  X,
  Target,
  BarChart2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ContentFormat } from '../../types';

interface StoryBeat {
  id: string;
  tag: string;
  time: string;
  text: string;
  color: string;
}

export const CreativeStudioPage: React.FC = () => {
  const {
    activeBrand,
    contentItems,
    selectedContent,
    updateContentItem,
    approveContentItem,
    requestChangesOnItem,
    currentUser,
    openScheduleModal,
    showToast
  } = useApp();

  const brandItems = contentItems.filter(c => c.brandId === activeBrand.id);
  const currentItem = selectedContent || brandItems[0];

  // Tab & format states
  const [activeTab, setActiveTab] = useState<'brief' | 'editor' | 'preview'>('editor');
  const [activeFormatTab, setActiveFormatTab] = useState<ContentFormat>('instagram_reel');
  const [savedNotice, setSavedNotice] = useState(false);

  // 1. Hook state - manual editing + AI assistance
  const [hookText, setHookText] = useState(
    currentItem?.hook || 'Kamu tahu nggak, biji ini dipetik 12 jam sebelum sampai cangkirmu?'
  );
  const [showAiHookSuggestions, setShowAiHookSuggestions] = useState(false);

  // 2. Alur Storytelling (Script Beats) - manual editing + AI assistance
  const [isEditingStoryBeats, setIsEditingStoryBeats] = useState(false);
  const [storyBeats, setStoryBeats] = useState<StoryBeat[]>([
    { id: '1', tag: 'HOOK', time: '0:00', text: 'Pertanyaan asal-usul biji, visual close-up cherry.', color: 'text-[#5268D8]' },
    { id: '2', tag: 'PROBLEM', time: '0:03', text: 'Kopi enak sering tidak jelas dari mana asalnya.', color: 'text-[#D97706]' },
    { id: '3', tag: 'AGITATION', time: '0:12', text: 'Salah beli = mahal tapi rasa tidak sesuai harapan.', color: 'text-[#DC2626]' },
    { id: '4', tag: 'SOLUTION', time: '0:22', text: 'Panen Gayo, dipanggang mingguan, ada nama petani.', color: 'text-[#1E8E3E]' },
    { id: '5', tag: 'CTA', time: '0:36', text: 'Komentari GAYO untuk resep seduh hari ini.', color: 'text-[#5268D8]' }
  ]);
  const [showAiBeatTemplates, setShowAiBeatTemplates] = useState(false);

  // 3. CTA state - manual editing + AI assistance
  const [ctaText, setCtaText] = useState(
    currentItem?.cta || 'Komentari GAYO untuk resep seduh hari ini'
  );

  // 4. Target KPIs state - manual editing + AI calculation
  const [targetKPIs, setTargetKPIs] = useState({
    views: '25.000',
    reach: '40.000',
    engagement: '4,8%',
    saves: '450'
  });
  const [isAiCalculatingKpi, setIsAiCalculatingKpi] = useState(false);

  // 5. Caption & Hashtags state - manual editing + AI assistance
  const [captionText, setCaptionText] = useState(
    currentItem?.caption ||
    'Dari kebun Pak Salim jam 5 pagi, sampai cangkirmu 12 jam kemudian. Panen tahun ini lebih kecil, tapi rasanya lebih bersih. Simpan postingan ini untuk tips seduh berikutnya.'
  );
  const [showAiCaptionSuggestions, setShowAiCaptionSuggestions] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([
    '#arunikacoffee',
    '#singleorigin',
    '#gayo',
    '#kopiindonesia'
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  // 6. Interactive Checklist Items (15 items)
  const [checklist, setChecklist] = useState([
    { num: '01', label: 'Content title', done: true },
    { num: '02', label: 'Objective', done: true },
    { num: '03', label: 'Target audience', done: true },
    { num: '04', label: 'Funnel stage', done: true },
    { num: '05', label: 'Content pillar', done: true },
    { num: '06', label: 'Format', done: true },
    { num: '07', label: 'Main message', done: true },
    { num: '08', label: 'Creative angle', done: true },
    { num: '09', label: 'Hook', done: true },
    { num: '10', label: 'Script / copy', done: true },
    { num: '11', label: 'Visual direction', done: true },
    { num: '12', label: 'CTA', done: true },
    { num: '13', label: 'Caption', done: true },
    { num: '14', label: 'Hashtags', done: false },
    { num: '15', label: 'References', done: false }
  ]);

  // 7. Version History
  const [versionList, setVersionList] = useState([
    { ver: 'v3', status: 'IN_REVIEW', label: 'Aktif · 2 Okt 10:12', user: 'Ayu', isCurrent: true },
    { ver: 'v2', status: 'APPROVED', label: 'Disetujui · 30 Sep 16:40', user: 'Bagas', isCurrent: false },
    { ver: 'v1', status: 'DRAFT', label: 'Draft awal · 28 Sep 09:05', user: 'Ayu', isCurrent: false }
  ]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  if (!currentItem) {
    return (
      <div className="p-12 text-center text-xs text-[#68717E]">
        Belum ada konten brief.
      </div>
    );
  }

  // Checklist completion calculation
  const completedCount = checklist.filter(item => item.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const toggleChecklistItem = (num: string) => {
    setChecklist(prev =>
      prev.map(item => (item.num === num ? { ...item, done: !item.done } : item))
    );
  };

  const handleSave = () => {
    updateContentItem(
      currentItem.id,
      {
        hook: hookText,
        caption: captionText,
        cta: ctaText,
        hashtags: hashtags
      },
      'Pembaruan manual studio'
    );
    setSavedNotice(true);
    showToast('Perubahan konten brief berhasil disimpan.');
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleSaveNewVersion = () => {
    const nextVerNum = versionList.length + 1;
    const newVer = {
      ver: `v${nextVerNum}`,
      status: 'IN_REVIEW',
      label: `Aktif · Baru saja disunting`,
      user: currentUser.name,
      isCurrent: true
    };
    setVersionList(prev => [
      newVer,
      ...prev.map(v => ({ ...v, isCurrent: false }))
    ]);
    handleSave();
    showToast(`Versi baru v${nextVerNum} berhasil dibuat dan disimpan.`);
  };

  const handleRestoreVersion = (ver: string) => {
    if (ver === 'v2') {
      setHookText('Kopi enak tak harus mahal, tapi harus jelas asalnya.');
      setCaptionText('Panen Gayo kali ini membawa profil rasa manis gula aren dan aroma melati yang khas.');
      setCtaText('Beli bundling promo minggu ini di toko resmi.');
    } else if (ver === 'v1') {
      setHookText('Kenapa rasa kopi seduhan rumahan sering pahit gosong?');
      setCaptionText('Eksperimen pertama dengan biji single origin Gayo.');
      setCtaText('Tulis pendapatmu di kolom komentar.');
    }
    showToast(`Konten brief berhasil dipulihkan ke ${ver}.`);
  };

  // AI Hook suggestions
  const aiHookIdeas = [
    'Kamu tahu nggak, biji ini dipetik 12 jam sebelum sampai cangkirmu?',
    'Stop seduh kopi mahal kalau cara simpan bijimu masih seperti ini.',
    '3 tanda biji kopi yang kamu beli sudah kehilangan aroma terbaiknya.',
    'Rahasia rasa floral di kopi Gayo: proses petik jam 5 pagi Pak Salim.'
  ];

  // AI Script Beat Templates
  const aiStoryTemplates = [
    {
      name: 'Problem - Agitate - Solve (PAS)',
      beats: [
        { id: 't1', tag: 'HOOK', time: '0:00', text: 'Tunjukkan hasil seduh yang gagal & rasa pahit menusuk.', color: 'text-[#5268D8]' },
        { id: 't2', tag: 'PROBLEM', time: '0:04', text: 'Banyak orang menyalahkan alat seduh padahal bijinya yang salah.', color: 'text-[#D97706]' },
        { id: 't3', tag: 'AGITATION', time: '0:12', text: 'Biji lama di rak toko sudah oksidasi dan kehilangan rasa buah.', color: 'text-[#DC2626]' },
        { id: 't4', tag: 'SOLUTION', time: '0:22', text: 'Biji Gayo segar sangrai mingguan dengan tanggal roast jelas.', color: 'text-[#1E8E3E]' },
        { id: 't5', tag: 'CTA', time: '0:36', text: 'Komentari GAYO untuk dapat panduan seduh gratis.', color: 'text-[#5268D8]' }
      ]
    },
    {
      name: 'Before - After - Bridge (BAB)',
      beats: [
        { id: 't1', tag: 'HOOK', time: '0:00', text: 'Perbandingan visual warna kopi segar vs kopi lama.', color: 'text-[#5268D8]' },
        { id: 't2', tag: 'PROBLEM', time: '0:05', text: 'Sebelum: Kopi terasa getir dan perlu banyak gula.', color: 'text-[#D97706]' },
        { id: 't3', tag: 'SOLUTION', time: '0:15', text: 'Sesudah: Manis alami keluar tanpa tambahan pemanis.', color: 'text-[#1E8E3E]' },
        { id: 't4', tag: 'CTA', time: '0:30', text: 'Coba batch sangrai minggu ini di link bio.', color: 'text-[#5268D8]' }
      ]
    }
  ];

  // AI Caption Suggestions
  const aiCaptionIdeas = [
    'Dari kebun Pak Salim jam 5 pagi, sampai cangkirmu 12 jam kemudian. Panen tahun ini lebih kecil, tapi rasanya lebih bersih. Simpan postingan ini untuk tips seduh berikutnya.',
    'Pernah merasa kopi manual brew di rumah rasanya hambar? Masalahnya seringkali ada di umur biji kopi. Biji Gayo kami dipanggang tiap Senin agar aromanya tetap di puncak kelezatan.',
    'Kopi bukan sekadar kafein—ini cerita kerja keras petani di dataran tinggi Aceh Tengah. Dapatkan bundling 2x200g eksklusif untuk seduhan terbaikmu minggu ini.'
  ];

  // AI KPI calculation
  const handleCalculateAiKpis = () => {
    setIsAiCalculatingKpi(true);
    setTimeout(() => {
      setTargetKPIs({
        views: '32.500',
        reach: '54.000',
        engagement: '5,2%',
        saves: '680'
      });
      setIsAiCalculatingKpi(false);
      showToast('Rekomendasi target KPI AI berhasil dimuat berdasarkan benchmark 30 hari brand.');
    }, 500);
  };

  // Add hashtag
  const handleAddHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const formatted = newTagInput.startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
    if (!hashtags.includes(formatted)) {
      setHashtags(prev => [...prev, formatted]);
    }
    setNewTagInput('');
  };

  const handleRemoveHashtag = (tagToRemove: string) => {
    setHashtags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Script Beat helpers
  const handleUpdateBeat = (id: string, field: keyof StoryBeat, value: string) => {
    setStoryBeats(prev =>
      prev.map(beat => (beat.id === id ? { ...beat, [field]: value } : beat))
    );
  };

  const handleAddBeat = () => {
    const newBeat: StoryBeat = {
      id: `beat_${Date.now()}`,
      tag: 'SCENE',
      time: '0:40',
      text: 'Visual pendukung atau poin penjelasan baru.',
      color: 'text-[#5268D8]'
    };
    setStoryBeats(prev => [...prev, newBeat]);
  };

  const handleDeleteBeat = (id: string) => {
    if (storyBeats.length <= 1) {
      showToast('Alur storytelling harus memiliki minimal 1 beat.');
      return;
    }
    setStoryBeats(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* 1. Header with Version Dropdown & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">
            Creative Studio
          </h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            {currentItem.title} · v{currentItem.currentVersion} · {currentItem.format === 'instagram_reel' ? 'IG Reel' : 'IG Carousel'} · {currentItem.status} oleh {currentUser.name}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Version Switcher */}
          <div className="relative group">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-mono font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 shadow-2xs"
            >
              <span>v{currentItem.currentVersion} · 2 Okt 10:12</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#68717E]" />
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-[#1B1E25] hover:bg-neutral-50 dark:hover:bg-[#20242D] border border-[#E7E9ED] dark:border-[#292E38] text-[#17191F] dark:text-[#E9EBF0] rounded-[8px] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedNotice ? 'Tersimpan ✓' : 'Simpan brief'}</span>
          </button>

          {/* Jadwalkan Posting Button (Wire ScheduleModal) */}
          <button
            onClick={() => openScheduleModal(currentItem.id)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-[#20242D] dark:hover:bg-[#2A303C] text-[#17191F] dark:text-[#E9EBF0] border border-[#E7E9ED] dark:border-[#2E3442] rounded-[8px] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#5268D8]" />
            <span>Jadwalkan posting</span>
          </button>

          {/* Primary Review / Approve Button */}
          <button
            onClick={() => {
              approveContentItem(currentItem.id);
              showToast(`Brief "${currentItem.title}" disetujui (APPROVED).`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim ke review</span>
          </button>
        </div>
      </div>

      {/* Mobile Creative Studio View (matching Mobile_Studio_15c8b97c.png) */}
      <div className="sm:hidden space-y-4">
        {/* Segmented Tab Control */}
        <div className="p-1 bg-[#F3F4F6] dark:bg-[#20242D] rounded-[10px] grid grid-cols-3 gap-1 text-center text-xs">
          {(['brief', 'editor', 'preview'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 rounded-[7px] font-medium transition-colors cursor-pointer capitalize ${
                activeTab === tab
                  ? 'bg-white dark:bg-[#1B1E25] text-[#17191F] dark:text-[#E9EBF0] font-semibold shadow-xs'
                  : 'text-[#68717E] dark:text-[#9BA3B2]'
              }`}
            >
              {tab === 'brief' ? 'Brief' : tab === 'editor' ? 'Editor' : 'Pratinjau'}
            </button>
          ))}
        </div>

        {/* Progress Bar: Brief completedCount/15 */}
        <div className="flex items-center justify-between text-xs font-mono text-[#68717E] dark:text-[#9BA3B2] gap-3">
          <span className="shrink-0 text-[11px]">Brief {completedCount}/15</span>
          <div className="flex-1 h-1.5 bg-[#E5E7EB] dark:bg-[#272B35] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#21A68A] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] font-bold text-[#17191F] dark:text-[#E9EBF0]">
            {progressPercent}%
          </span>
        </div>

        {/* Mobile Tab: Brief Checklist View */}
        {activeTab === 'brief' && (
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-2xs space-y-3">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
              STRUKTUR CREATIVE BRIEF (KLIK UNTUK CENTANG)
            </div>
            <div className="space-y-2">
              {checklist.map(item => (
                <div
                  key={item.num}
                  onClick={() => toggleChecklistItem(item.num)}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#20242D] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#68717E] dark:text-[#9BA3B2]">
                      {item.num}
                    </span>
                    <span className={item.done ? 'font-medium text-[#17191F] dark:text-[#E9EBF0]' : 'text-[#68717E] dark:text-[#9BA3B2]'}>
                      {item.label}
                    </span>
                  </div>
                  {item.done ? (
                    <span className="w-4 h-4 rounded-full bg-[#E6F4EA] dark:bg-[#1C372B] text-[#1E8E3E] dark:text-[#34D399] flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-[#E7E9ED] dark:border-[#383F4C] flex items-center justify-center text-[10px] text-transparent">
                      ○
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Tab: Editor View */}
        {activeTab === 'editor' && (
          <div className="space-y-4">
            {/* Card 1: Blue Tinted Hook Card with Manual Edit & AI Suggestions */}
            <div className="p-4 rounded-[12px] bg-[#EEF2FF] dark:bg-[#202534] border border-[#5268D8]/30 dark:border-[#8292F0]/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#5268D8] dark:text-[#8292F0] font-semibold">
                <div className="flex items-center gap-1.5">
                  <span>HOOK · 0:00-0:03</span>
                  <span className="px-1 py-0.2 rounded bg-white dark:bg-[#2E3650] text-[9px]">AI BANTU</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiHookSuggestions(!showAiHookSuggestions)}
                  className="flex items-center gap-1 hover:underline text-[10px] cursor-pointer"
                >
                  <span>✦ Buat ulang</span>
                  <RotateCw className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Editable Hook Input */}
              <textarea
                rows={2}
                value={hookText}
                onChange={e => setHookText(e.target.value)}
                placeholder="Tulis hook pembuka..."
                className="w-full p-2 text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] bg-white/80 dark:bg-[#1B1E25]/80 border border-[#5268D8]/30 rounded-lg focus:ring-1 focus:ring-[#5268D8] focus:outline-none"
              />

              {/* AI Hook Suggestions Drawer */}
              {showAiHookSuggestions && (
                <div className="pt-2 border-t border-[#5268D8]/20 space-y-1.5">
                  <span className="text-[9px] font-mono uppercase text-[#68717E] dark:text-[#9BA3B2] block">
                    PILIH SARAN HOOK AI (DAPAT DISUNTING MANUAL):
                  </span>
                  {aiHookIdeas.map((idea, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setHookText(idea);
                        setShowAiHookSuggestions(false);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-[#1B1E25] hover:bg-[#E0E7FF] dark:hover:bg-[#2C344D] text-[11px] text-[#17191F] dark:text-[#E9EBF0] border border-[#E7E9ED] dark:border-[#2E3442] transition-colors cursor-pointer"
                    >
                      "{idea}"
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Card 2: Alur Storytelling */}
            <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                  Alur storytelling
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAiBeatTemplates(!showAiBeatTemplates)}
                    className="text-[10px] text-[#5268D8] dark:text-[#8292F0] font-mono hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Template AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingStoryBeats(!isEditingStoryBeats)}
                    className="text-xs text-[#5268D8] dark:text-[#8292F0] font-semibold cursor-pointer"
                  >
                    {isEditingStoryBeats ? 'Selesai' : 'Edit'}
                  </button>
                </div>
              </div>

              {/* Template suggestions */}
              {showAiBeatTemplates && (
                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] space-y-2">
                  <span className="text-[9px] font-mono uppercase text-[#68717E] block">
                    PILIH STRUKTUR ALUR STORYTELLING (BEBAS DISUNTING):
                  </span>
                  {aiStoryTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setStoryBeats(tpl.beats);
                        setShowAiBeatTemplates(false);
                        showToast(`Template "${tpl.name}" dimuat. Anda bisa mengubah setiap beat.`);
                      }}
                      className="w-full text-left p-2 rounded bg-white dark:bg-[#1B1E25] text-xs font-medium hover:border-[#5268D8] border border-[#E7E9ED] dark:border-[#2E3442] flex justify-between items-center"
                    >
                      <span>{tpl.name}</span>
                      <span className="text-[10px] font-mono text-[#5268D8]">Terapkan →</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Story Beats List */}
              <div className="space-y-2 text-xs">
                {storyBeats.map((step) => (
                  <div key={step.id} className="py-1 border-b border-[#F1F3F5] dark:border-[#242A36] last:border-b-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isEditingStoryBeats ? (
                          <input
                            type="text"
                            value={step.tag}
                            onChange={e => handleUpdateBeat(step.id, 'tag', e.target.value.toUpperCase())}
                            className="font-mono text-[9px] font-bold text-[#5268D8] w-16 p-1 border rounded bg-neutral-50 dark:bg-[#20242D]"
                          />
                        ) : (
                          <span className={`font-mono text-[9px] font-bold ${step.color} w-16 shrink-0`}>
                            {step.tag}
                          </span>
                        )}

                        {isEditingStoryBeats ? (
                          <input
                            type="text"
                            value={step.text}
                            onChange={e => handleUpdateBeat(step.id, 'text', e.target.value)}
                            className="text-[11px] p-1 border rounded bg-neutral-50 dark:bg-[#20242D] w-full"
                          />
                        ) : (
                          <span className="text-[11px] text-[#17191F] dark:text-[#E9EBF0]">
                            {step.text}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isEditingStoryBeats ? (
                          <>
                            <input
                              type="text"
                              value={step.time}
                              onChange={e => handleUpdateBeat(step.id, 'time', e.target.value)}
                              className="font-mono text-[9px] w-10 p-0.5 border rounded text-center"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteBeat(step.id)}
                              className="text-[#DC2626] p-1 hover:bg-neutral-100 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <span className="font-mono text-[10px] text-[#68717E]">{step.time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isEditingStoryBeats && (
                <button
                  type="button"
                  onClick={handleAddBeat}
                  className="w-full py-1.5 text-[11px] border border-dashed border-[#5268D8] text-[#5268D8] rounded-lg font-medium flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah beat alur</span>
                </button>
              )}
            </div>

            {/* Card 3: Call to Action (CTA) */}
            <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                  Call to Action (CTA)
                </h3>
                <span className="text-[10px] font-mono text-[#68717E]">Dapat disunting bebas</span>
              </div>
              <input
                type="text"
                value={ctaText}
                onChange={e => setCtaText(e.target.value)}
                placeholder="Tulis instruksi CTA..."
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-lg text-[#17191F] dark:text-[#E9EBF0]"
              />
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[9px] font-mono text-[#68717E] w-full">Saran AI:</span>
                {[
                  'Komentari GAYO untuk resep',
                  'Klik link di bio diskon 20%',
                  'Simpan video ini untuk tips besok'
                ].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCtaText(sug)}
                    className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-[#20242D] hover:bg-[#EEF2FF] text-[#5268D8] cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Card 4: Target KPIs */}
            <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                  Target KPI Konten
                </h3>
                <button
                  type="button"
                  onClick={handleCalculateAiKpis}
                  disabled={isAiCalculatingKpi}
                  className="text-[10px] text-[#5268D8] font-mono flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAiCalculatingKpi ? 'Menghitung...' : '✦ Rekomendasi AI'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded-lg border border-[#E7E9ED] dark:border-[#2E3442]">
                  <span className="text-[9px] font-mono text-[#68717E] block">TARGET REACH</span>
                  <input
                    type="text"
                    value={targetKPIs.reach}
                    onChange={e => setTargetKPIs({ ...targetKPIs, reach: e.target.value })}
                    className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                  />
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded-lg border border-[#E7E9ED] dark:border-[#2E3442]">
                  <span className="text-[9px] font-mono text-[#68717E] block">TARGET VIEWS</span>
                  <input
                    type="text"
                    value={targetKPIs.views}
                    onChange={e => setTargetKPIs({ ...targetKPIs, views: e.target.value })}
                    className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                  />
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded-lg border border-[#E7E9ED] dark:border-[#2E3442]">
                  <span className="text-[9px] font-mono text-[#68717E] block">ENGAGEMENT RATE</span>
                  <input
                    type="text"
                    value={targetKPIs.engagement}
                    onChange={e => setTargetKPIs({ ...targetKPIs, engagement: e.target.value })}
                    className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                  />
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded-lg border border-[#E7E9ED] dark:border-[#2E3442]">
                  <span className="text-[9px] font-mono text-[#68717E] block">TARGET SAVES</span>
                  <input
                    type="text"
                    value={targetKPIs.saves}
                    onChange={e => setTargetKPIs({ ...targetKPIs, saves: e.target.value })}
                    className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                  />
                </div>
              </div>
            </div>

            {/* Card 5: Caption & Hashtags */}
            <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                  Caption & Hashtags
                </h3>
                <span className="font-mono text-[10px] text-[#68717E] dark:text-[#9BA3B2]">
                  {captionText.length} / 2.200
                </span>
              </div>

              <textarea
                rows={3}
                value={captionText}
                onChange={e => setCaptionText(e.target.value)}
                className="w-full p-2 text-xs bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-lg text-[#17191F] dark:text-[#E9EBF0]"
              />

              {/* Hashtag Editor */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {hashtags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-[#20242D] text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHashtag(tag)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddHashtag} className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    placeholder="Tambah hashtag (#kopi)..."
                    className="flex-1 px-2 py-1 text-xs border rounded bg-neutral-50 dark:bg-[#20242D]"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-xs bg-neutral-200 dark:bg-[#2A303C] rounded font-medium"
                  >
                    +
                  </button>
                </form>
              </div>
            </div>

            {/* Card 6: Versi */}
            <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0]">
                  Versi & Riwayat
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="text-xs text-[#5268D8] dark:text-[#8292F0] font-semibold cursor-pointer"
                >
                  Bandingkan
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {versionList.map((ver) => (
                  <div key={ver.ver} className="flex items-center justify-between py-1 border-b border-[#F1F3F5] dark:border-[#242A36] last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#17191F] dark:text-[#E9EBF0]">{ver.ver}</span>
                      <span className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">{ver.label}</span>
                    </div>
                    {!ver.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRestoreVersion(ver.ver)}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-100 dark:bg-[#20242D] text-[#68717E] hover:text-[#17191F] cursor-pointer"
                      >
                        Pulihkan
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Tab: Preview View */}
        {activeTab === 'preview' && (
          <div className="p-4 bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] space-y-4">
            <div className="w-full max-w-[260px] mx-auto aspect-[9/16] rounded-[20px] bg-gradient-to-b from-[#3B2516] via-[#1F140D] to-[#0A0705] p-3 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border border-neutral-700">
              <div className="flex items-center justify-between text-[10px] pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#B85D2A] text-white flex items-center justify-center font-bold text-[8px]">
                    A
                  </div>
                  <span className="font-semibold text-[10px]">arunika.coffee</span>
                  <span className="opacity-60 text-[9px]">· Reel</span>
                </div>
              </div>

              <div className="my-auto px-2 text-center">
                <p className="text-xs font-bold leading-snug drop-shadow-md">
                  "{hookText}"
                </p>
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] text-white/90">
                    {ctaText} →
                  </span>
                  <div className="flex items-center gap-2">
                    <Music className="w-3 h-3" />
                    <MessageCircle className="w-3 h-3" />
                    <Share2 className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => openScheduleModal(currentItem.id)}
                className="w-full py-2.5 bg-[#5268D8] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwalkan Sekarang</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Desktop 3-Column Layout Matching Creative_Studio_46c73fd5.png */}
      <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (3 cols): STRUKTUR CREATIVE BRIEF */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
                STRUKTUR BRIEF
              </span>
              <span className="text-[10px] font-mono font-bold text-[#21A68A]">
                {completedCount}/15 ({progressPercent}%)
              </span>
            </div>

            {/* Checklist items with interactive toggling */}
            <div className="space-y-1.5">
              {checklist.map(item => (
                <div
                  key={item.num}
                  onClick={() => toggleChecklistItem(item.num)}
                  className="flex items-center justify-between text-xs text-[#17191F] dark:text-[#E9EBF0] p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#20242D] cursor-pointer transition-colors"
                  title="Klik untuk mengubah status kelengkapan"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#68717E] dark:text-[#9BA3B2]">
                      {item.num}
                    </span>
                    <span className={item.done ? 'font-medium' : 'text-[#68717E] dark:text-[#9BA3B2]'}>
                      {item.label}
                    </span>
                  </div>
                  {item.done ? (
                    <span className="w-4 h-4 rounded-full bg-[#E6F4EA] dark:bg-[#1C372B] text-[#1E8E3E] dark:text-[#34D399] flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-[#E7E9ED] dark:border-[#383F4C] flex items-center justify-center text-[10px] text-transparent hover:border-neutral-500">
                      ○
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#E7E9ED] dark:border-[#292E38] text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]">
            <span className="uppercase text-[9px] block">SUMBER IDE</span>
            Idea #2 · Campaign Panen Raya Gayo
          </div>
        </div>

        {/* Center Column (5 cols): Brief Editor */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-5">
          {/* Editor Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                  {currentItem.title}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] font-mono text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706] dark:bg-[#382D1B] dark:text-[#FBBF24]">
                  ● {currentItem.status}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                IG Reel · 0:42 · AI sebagai asisten · Kendali manual penuh
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveNewVersion}
              className="p-1 rounded-[6px] text-[#68717E] hover:bg-neutral-100 dark:hover:bg-[#20242D] cursor-pointer"
              title="Simpan versi baru"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Hook Callout Box with Direct Manual Edit + AI Suggestion */}
          <div className="p-3.5 rounded-[10px] bg-[#EEF2FF] dark:bg-[#22283A] border border-[#5268D8]/20 dark:border-[#8292F0]/20 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#5268D8] dark:text-[#8292F0] font-semibold">
              <div className="flex items-center gap-1.5">
                <span>HOOK · 0:00-0:03</span>
                <span className="px-1 py-0.2 rounded bg-white dark:bg-[#2E3650] text-[9px]">AI BANTU</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAiHookSuggestions(!showAiHookSuggestions)}
                className="flex items-center gap-1 hover:underline text-[10px] cursor-pointer"
              >
                <span>✦ Rekomendasi AI</span>
                <RotateCw className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Editable Hook Textarea */}
            <textarea
              rows={2}
              value={hookText}
              onChange={e => setHookText(e.target.value)}
              className="w-full p-2 text-xs font-semibold text-[#17191F] dark:text-[#E9EBF0] bg-white/70 dark:bg-[#1B1E25]/80 border border-[#5268D8]/20 rounded-md focus:ring-1 focus:ring-[#5268D8] focus:outline-none"
            />

            {/* AI Hook Popover */}
            {showAiHookSuggestions && (
              <div className="pt-2 border-t border-[#5268D8]/20 space-y-1">
                <span className="text-[9px] font-mono uppercase text-[#68717E] dark:text-[#9BA3B2] block">
                  PILIH HOOK AI (DAPAT DISUNTING MANUAL):
                </span>
                {aiHookIdeas.map((idea, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setHookText(idea);
                      setShowAiHookSuggestions(false);
                    }}
                    className="w-full text-left p-1.5 rounded bg-white dark:bg-[#1B1E25] hover:bg-[#E0E7FF] dark:hover:bg-[#2B3550] text-[11px] text-[#17191F] dark:text-[#E9EBF0] border border-[#E7E9ED] dark:border-[#2E3442] cursor-pointer"
                  >
                    "{idea}"
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Alur Storytelling with Full Script Editing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
              <span>ALUR STORYTELLING (SCRIPT BEATS)</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiBeatTemplates(!showAiBeatTemplates)}
                  className="text-[#5268D8] dark:text-[#8292F0] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Struktur AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingStoryBeats(!isEditingStoryBeats)}
                  className="text-[#5268D8] dark:text-[#8292F0] hover:underline font-semibold cursor-pointer"
                >
                  {isEditingStoryBeats ? 'Selesai' : 'Edit Script'}
                </button>
              </div>
            </div>

            {/* AI Template choices */}
            {showAiBeatTemplates && (
              <div className="p-2 rounded-lg bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] space-y-1.5">
                <span className="text-[9px] font-mono uppercase text-[#68717E] block">
                  PILIH FORMULA STORYTELLING (BEBAS DISUNTING):
                </span>
                {aiStoryTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setStoryBeats(tpl.beats);
                      setShowAiBeatTemplates(false);
                      showToast(`Struktur "${tpl.name}" diterapkan.`);
                    }}
                    className="w-full text-left p-1.5 rounded bg-white dark:bg-[#1B1E25] text-xs hover:border-[#5268D8] border border-[#E7E9ED] dark:border-[#2E3442] flex justify-between items-center cursor-pointer"
                  >
                    <span>{tpl.name}</span>
                    <span className="text-[10px] font-mono text-[#5268D8]">Pakai →</span>
                  </button>
                ))}
              </div>
            )}

            {/* Editable Script Beats List */}
            <div className="space-y-2 text-xs">
              {storyBeats.map((step) => (
                <div
                  key={step.id}
                  className="p-1.5 rounded-[6px] hover:bg-neutral-50 dark:hover:bg-[#20242D] space-y-1"
                >
                  <div className="flex items-start gap-2.5">
                    {isEditingStoryBeats ? (
                      <div className="flex flex-col gap-1 w-20 shrink-0">
                        <input
                          type="text"
                          value={step.tag}
                          onChange={e => handleUpdateBeat(step.id, 'tag', e.target.value.toUpperCase())}
                          className="font-mono text-[9px] font-bold p-1 border rounded bg-white dark:bg-[#1B1E25]"
                        />
                        <input
                          type="text"
                          value={step.time}
                          onChange={e => handleUpdateBeat(step.id, 'time', e.target.value)}
                          className="font-mono text-[9px] p-1 border rounded bg-white dark:bg-[#1B1E25]"
                        />
                      </div>
                    ) : (
                      <span className={`font-mono text-[9px] font-bold ${step.color} w-16 shrink-0`}>
                        {step.tag} <span className="text-[#68717E] font-normal">{step.time}</span>
                      </span>
                    )}

                    {isEditingStoryBeats ? (
                      <div className="flex-1 flex gap-1">
                        <textarea
                          rows={2}
                          value={step.text}
                          onChange={e => handleUpdateBeat(step.id, 'text', e.target.value)}
                          className="w-full text-[11px] p-1.5 border rounded bg-white dark:bg-[#1B1E25]"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBeat(step.id)}
                          className="text-[#DC2626] p-1.5 hover:bg-red-50 rounded"
                          title="Hapus beat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[#17191F] dark:text-[#E9EBF0] text-[11px] leading-relaxed">
                        {step.text}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isEditingStoryBeats && (
              <button
                type="button"
                onClick={handleAddBeat}
                className="w-full py-1 text-xs border border-dashed border-[#5268D8] text-[#5268D8] rounded font-medium flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah beat script</span>
              </button>
            )}
          </div>

          {/* Call to Action (CTA) Section */}
          <div className="space-y-1.5 pt-2 border-t border-[#E7E9ED] dark:border-[#292E38]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
                CALL TO ACTION (CTA)
              </span>
              <span className="text-[10px] font-mono text-[#68717E]">Dapat disunting bebas</span>
            </div>
            <input
              type="text"
              value={ctaText}
              onChange={e => setCtaText(e.target.value)}
              className="w-full p-2 text-xs bg-neutral-50/70 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-md text-[#17191F] dark:text-[#E9EBF0]"
            />
            <div className="flex items-center gap-1 flex-wrap">
              {[
                'Komentari GAYO untuk resep seduh',
                'Klik link di bio diskon 20%',
                'Simpan video ini untuk tips besok'
              ].map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCtaText(sug)}
                  className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-[#20242D] hover:bg-[#EEF2FF] text-[#5268D8] cursor-pointer"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Target KPIs Section */}
          <div className="space-y-2 pt-2 border-t border-[#E7E9ED] dark:border-[#292E38]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
                TARGET KPIS (MANUAL & AI ASSIST)
              </span>
              <button
                type="button"
                onClick={handleCalculateAiKpis}
                disabled={isAiCalculatingKpi}
                className="text-[10px] text-[#5268D8] font-mono flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isAiCalculatingKpi ? 'Menghitung...' : '✦ Hitung Rekomendasi AI'}</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded border border-[#E7E9ED] dark:border-[#2E3442]">
                <span className="text-[9px] font-mono text-[#68717E] block">TARGET REACH</span>
                <input
                  type="text"
                  value={targetKPIs.reach}
                  onChange={e => setTargetKPIs({ ...targetKPIs, reach: e.target.value })}
                  className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                />
              </div>
              <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded border border-[#E7E9ED] dark:border-[#2E3442]">
                <span className="text-[9px] font-mono text-[#68717E] block">TARGET VIEWS</span>
                <input
                  type="text"
                  value={targetKPIs.views}
                  onChange={e => setTargetKPIs({ ...targetKPIs, views: e.target.value })}
                  className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                />
              </div>
              <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded border border-[#E7E9ED] dark:border-[#2E3442]">
                <span className="text-[9px] font-mono text-[#68717E] block">ENGAGEMENT</span>
                <input
                  type="text"
                  value={targetKPIs.engagement}
                  onChange={e => setTargetKPIs({ ...targetKPIs, engagement: e.target.value })}
                  className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                />
              </div>
              <div className="p-2 bg-neutral-50 dark:bg-[#20242D] rounded border border-[#E7E9ED] dark:border-[#2E3442]">
                <span className="text-[9px] font-mono text-[#68717E] block">TARGET SAVES</span>
                <input
                  type="text"
                  value={targetKPIs.saves}
                  onChange={e => setTargetKPIs({ ...targetKPIs, saves: e.target.value })}
                  className="font-mono font-bold text-xs bg-transparent text-[#17191F] dark:text-[#E9EBF0] w-full"
                />
              </div>
            </div>
          </div>

          {/* Caption Box */}
          <div className="space-y-2 pt-2 border-t border-[#E7E9ED] dark:border-[#292E38]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#68717E] dark:text-[#9BA3B2]">
                CAPTION
              </span>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#68717E] dark:text-[#9BA3B2]">
                <span>{captionText.length} / 2.200 karakter</span>
                <button
                  type="button"
                  onClick={() => setShowAiCaptionSuggestions(!showAiCaptionSuggestions)}
                  className="text-[#5268D8] dark:text-[#8292F0] hover:underline font-semibold cursor-pointer"
                >
                  ✦ Buat ulang AI
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={captionText}
              onChange={e => setCaptionText(e.target.value)}
              className="w-full p-2.5 text-xs bg-neutral-50/70 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-[8px] text-[#17191F] dark:text-[#E9EBF0] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#5268D8]"
            />

            {/* AI Caption popover */}
            {showAiCaptionSuggestions && (
              <div className="p-2 rounded bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] space-y-1.5">
                <span className="text-[9px] font-mono text-[#68717E] block">PILIH VARIASI CAPTION:</span>
                {aiCaptionIdeas.map((cap, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCaptionText(cap);
                      setShowAiCaptionSuggestions(false);
                    }}
                    className="w-full text-left p-1.5 rounded bg-white dark:bg-[#1B1E25] text-xs hover:border-[#5268D8] border border-[#E7E9ED] dark:border-[#2E3442] cursor-pointer"
                  >
                    {cap}
                  </button>
                ))}
              </div>
            )}

            {/* Hashtag manager */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {hashtags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-[#20242D] text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHashtag(tag)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddHashtag} className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={e => setNewTagInput(e.target.value)}
                  placeholder="Tambah hashtag (#kopi)..."
                  className="flex-1 px-2.5 py-1 text-xs border rounded-[6px] bg-neutral-50 dark:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0]"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-neutral-200 dark:bg-[#2A303C] hover:bg-neutral-300 text-xs rounded-[6px] font-medium cursor-pointer"
                >
                  + Tambah
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Preview & Versions */}
        <div className="lg:col-span-4 space-y-5">
          {/* Platform Preview Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <span className="text-xs font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Pratinjau platform
              </span>
              <span className="text-[10px] font-mono text-[#68717E]">9:16</span>
            </div>

            {/* Format Pill Switcher */}
            <div className="flex items-center gap-1 text-[11px] font-medium flex-wrap">
              {(['instagram_reel', 'instagram_carousel', 'instagram_story', 'tiktok_video'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setActiveFormatTab(fmt)}
                  className={`px-2.5 py-1 rounded-[6px] transition-colors cursor-pointer ${
                    activeFormatTab === fmt
                      ? 'bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] font-semibold'
                      : 'bg-neutral-100 dark:bg-[#20242D] text-[#68717E] dark:text-[#9BA3B2]'
                  }`}
                >
                  {fmt === 'instagram_reel' ? 'IG Reel' : fmt === 'instagram_carousel' ? 'Carousel' : fmt === 'instagram_story' ? 'Story' : 'TikTok'}
                </button>
              ))}
            </div>

            {/* Simulated Mobile Video Mockup */}
            <div className="w-full max-w-[240px] mx-auto aspect-[9/16] rounded-[20px] bg-gradient-to-b from-[#3B2516] via-[#1F140D] to-[#0A0705] p-3 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border border-neutral-700">
              {/* Phone Top Overlay */}
              <div className="flex items-center justify-between text-[10px] pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#B85D2A] text-white flex items-center justify-center font-bold text-[8px]">
                    A
                  </div>
                  <span className="font-semibold text-[10px]">arunika.coffee</span>
                  <span className="opacity-60 text-[9px]">· {activeFormatTab.includes('reel') ? 'Reel' : 'Post'}</span>
                </div>
              </div>

              {/* Center Video Hook Overlay */}
              <div className="my-auto px-2 text-center">
                <p className="text-xs font-bold leading-snug drop-shadow-md">
                  "{hookText}"
                </p>
              </div>

              {/* Bottom Video UI */}
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] text-white/90">
                    {ctaText} →
                  </span>
                  <div className="flex items-center gap-2">
                    <Music className="w-3 h-3" />
                    <MessageCircle className="w-3 h-3" />
                    <Share2 className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openScheduleModal(currentItem.id)}
              className="w-full py-2 bg-[#5268D8] hover:bg-[#4357C5] text-white text-xs font-semibold rounded-[8px] flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwalkan posting konten ini</span>
            </button>
          </div>

          {/* Versions Card */}
          <div className="bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <span className="text-xs font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Versi & Histori
              </span>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="text-xs text-[#5268D8] dark:text-[#8292F0] hover:underline font-semibold cursor-pointer"
              >
                Bandingkan
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {versionList.map((ver) => (
                <div
                  key={ver.ver}
                  className={`p-2.5 rounded-[8px] border flex items-center justify-between ${
                    ver.isCurrent
                      ? 'bg-[#EEF2FF] dark:bg-[#22283A] border-[#5268D8]/30 text-[#5268D8] dark:text-[#8292F0]'
                      : 'bg-neutral-50 dark:bg-[#20242D] border-[#E7E9ED] dark:border-[#2E3442]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold">
                      <span>{ver.ver}</span>
                      <span className="text-[9px] px-1 rounded bg-white dark:bg-[#1B1E25] border">
                        {ver.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
                      {ver.label}
                    </p>
                  </div>
                  {!ver.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRestoreVersion(ver.ver)}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-[#292E38] border border-[#E7E9ED] text-[#68717E] hover:text-[#17191F] cursor-pointer"
                    >
                      Pulihkan
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-[#D97706] pt-2 border-t border-[#E7E9ED] dark:border-[#292E38]">
              Edit setelah approval membatalkan status APPROVED → review ulang wajib (PRD BR-014).
            </p>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1B1E25] rounded-2xl max-w-2xl w-full p-5 border border-[#E7E9ED] dark:border-[#292E38] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
              <h3 className="text-base font-bold text-[#17191F] dark:text-[#E9EBF0]">
                Bandingkan Versi Brief (v3 vs v2)
              </h3>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1 rounded text-[#68717E] hover:bg-neutral-100 dark:hover:bg-[#20242D]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-[#20242D] rounded-xl space-y-2 border">
                <span className="font-mono font-bold text-xs text-[#5268D8] block">v3 (DRAFT AKTIF)</span>
                <div>
                  <span className="text-[10px] font-mono text-[#68717E] block">HOOK</span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] font-medium">"{hookText}"</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#68717E] block">CTA</span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0]">{ctaText}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#68717E] block">CAPTION</span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] text-[11px]">{captionText}</p>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-[#20242D] rounded-xl space-y-2 border">
                <span className="font-mono font-bold text-xs text-[#1E8E3E] block">v2 (APPROVED)</span>
                <div>
                  <span className="text-[10px] font-mono text-[#68717E] block">HOOK</span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] font-medium">"Kopi enak tak harus mahal, tapi harus jelas asalnya."</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#68717E] block">CTA</span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0]">Beli bundling promo minggu ini di toko resmi.</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#68717E] block">CAPTION</span>
                  <p className="text-[#17191F] dark:text-[#E9EBF0] text-[11px]">Panen Gayo kali ini membawa profil rasa manis gula aren dan aroma melati yang khas.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-2 bg-[#5268D8] text-white text-xs font-semibold rounded-xl"
              >
                Tutup Perbandingan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
