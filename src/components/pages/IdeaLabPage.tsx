import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Plus,
  ChevronDown,
  LayoutGrid,
  List,
  MoreHorizontal,
  Link,
  Wand2
} from 'lucide-react';
import { IdeaItem, FunnelStage, ContentFormat } from '../../types';

export const IdeaLabPage: React.FC = () => {
  const { ideas, activeBrand, convertIdeaToContentBrief, createIdea, updateIdeaStatus, showToast } = useApp();
  const brandIdeas = ideas.filter(i => i.brandId === activeBrand.id);
  const getIdeaPillarName = (idea: IdeaItem) =>
    activeBrand.pillars.find(pillar => pillar.id === idea.contentPillarId)?.name || 'Tanpa pillar';
  const filteredIdeas = brandIdeas.filter(idea => {
    const matchesPillar = pillarFilter === 'all' || getIdeaPillarName(idea) === pillarFilter;
    if (!matchesPillar) return false;
    if (activeTab === 'new') return idea.status === 'NEW' || idea.status === 'IDEA';
    if (activeTab === 'saved') return idea.status === 'SAVED';
    if (activeTab === 'archived') return idea.status === 'ARCHIVED';
    return idea.status !== 'ARCHIVED';
  });

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'saved' | 'archived'>('all');
  const [topic, setTopic] = useState('Single origin Gayo');
  const [selectedObjective, setSelectedObjective] = useState('Consideration');
  const [selectedFunnel, setSelectedFunnel] = useState<FunnelStage>('MOFU');
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>('instagram_carousel');
  const [selectedTone, setSelectedTone] = useState('Hangat');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateIdea = () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      showToast('Isi topik terlebih dahulu.');
      return;
    }

    const variants = [
      {
        suffix: 'Panduan pemula',
        angle: 'Edukasi langkah demi langkah',
        problem: 'Audiens belum memahami dasar topik ini',
        hypothesis: `Konten panduan ringkas tentang ${cleanTopic} membantu audiens memahami langkah awal.`
      },
      {
        suffix: 'Kesalahan umum',
        angle: 'Problem-solution',
        problem: 'Audiens sering melakukan kesalahan saat mencoba topik ini',
        hypothesis: `Membahas tiga kesalahan umum terkait ${cleanTopic} dapat mendorong save dan share.`
      },
      {
        suffix: 'Mitos vs fakta',
        angle: 'Myth busting',
        problem: 'Audiens sulit membedakan informasi dan mitos',
        hypothesis: `Menguji mitos seputar ${cleanTopic} dapat meningkatkan rasa ingin tahu.`
      },
      {
        suffix: 'Perbandingan',
        angle: 'Side-by-side comparison',
        problem: 'Audiens belum tahu pilihan mana yang paling sesuai',
        hypothesis: `Membandingkan dua pendekatan untuk ${cleanTopic} membantu audiens mengambil keputusan.`
      },
      {
        suffix: 'Checklist praktis',
        angle: 'Actionable checklist',
        problem: 'Audiens tahu teorinya tetapi belum tahu cara menerapkan',
        hypothesis: `Checklist praktis ${cleanTopic} membuat audiens lebih mudah mulai bertindak.`
      }
    ];

    setIsGenerating(true);
    variants.forEach(variant => createIdea({
      brandId: activeBrand.id,
      title: `${cleanTopic}: ${variant.suffix}`,
      topic: cleanTopic,
      audienceProblem: variant.problem,
      objective: selectedObjective,
      tone: selectedTone,
      hypothesis: variant.hypothesis,
      funnelStage: selectedFunnel,
      format: selectedFormat,
      creativeAngle: variant.angle,
      targetAudience: activeBrand.personas[0]?.name || 'Target audiens brand',
      contentPillarId: activeBrand.pillars[0]?.id || 'pil_edukasi'
    }));
    setIsGenerating(false);
    showToast('5 draft ide berhasil dibuat dari template lokal. Periksa sebelum digunakan.');
  };

  const handleCreateManualIdea = () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      showToast('Isi topik terlebih dahulu.');
      return;
    }
    createIdea({
      brandId: activeBrand.id,
      title: cleanTopic,
      topic: cleanTopic,
      audienceProblem: 'Perlu dilengkapi berdasarkan masalah audiens.',
      objective: selectedObjective,
      tone: selectedTone,
      hypothesis: 'Ide manual — lengkapi hipotesis dan angle sebelum dijadikan brief.',
      funnelStage: selectedFunnel,
      format: selectedFormat,
      creativeAngle: 'Angle manual',
      targetAudience: activeBrand.personas[0]?.name || 'Target audiens brand',
      contentPillarId: activeBrand.pillars[0]?.id || 'pil_edukasi'
    });
    showToast('Ide manual ditambahkan.');
  };

  const [pillarFilter, setPillarFilter] = useState('all');
  const [isPillarDropdownOpen, setIsPillarDropdownOpen] = useState(false);

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#17191F] dark:text-[#E9EBF0] tracking-tight">
            Idea Lab
          </h1>
          <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">
            24 ide tersimpan · 11 terhubung ke campaign · 12 job generator bulan ini
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPillarDropdownOpen(!isPillarDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-[8px] text-xs font-medium text-[#17191F] dark:text-[#E9EBF0] cursor-pointer hover:border-[#5268D8]/50 shadow-2xs"
            >
              <span>{pillarFilter === 'all' ? 'Semua pillar' : pillarFilter}</span>
              <ChevronDown className="w-3 h-3 text-[#68717E]" />
            </button>

            {isPillarDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] rounded-xl shadow-xl z-20 p-1">
                <button
                  onClick={() => {
                    setPillarFilter('all');
                    setIsPillarDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                    pillarFilter === 'all' ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                  }`}
                >
                  Semua pillar
                </button>
                {activeBrand.pillars.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPillarFilter(p.name);
                      setIsPillarDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      pillarFilter === p.name ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]' : 'hover:bg-neutral-50 dark:hover:bg-[#20242D]'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleCreateManualIdea}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah ide</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Generator Ide Card (4.5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#1B1E25] rounded-[12px] border border-[#E7E9ED] dark:border-[#292E38] p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E9ED] dark:border-[#292E38]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5268D8] dark:text-[#8292F0]" />
              <h3 className="text-sm font-bold font-heading text-[#17191F] dark:text-[#E9EBF0]">
                Generator ide
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#5268D8]/10 text-[#5268D8] dark:text-[#8292F0] font-semibold">
              TEMPLATE LOKAL
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Topik */}
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1">
                TOPIK
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Masukkan topik ide"
                className="w-full p-2 rounded-[8px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] text-[#17191F] dark:text-[#E9EBF0]"
              />
            </div>

            {/* Target Audiens */}
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1">
                TARGET AUDIENS
              </label>
              <div className="flex items-center justify-between p-2 rounded-[8px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] text-[#17191F] dark:text-[#E9EBF0]">
                <span>Rani, 28 · persona utama</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#68717E]" />
              </div>
            </div>

            {/* Masalah Audiens */}
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1">
                MASALAH AUDIENS
              </label>
              <div className="flex items-center justify-between p-2 rounded-[8px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] text-[#17191F] dark:text-[#E9EBF0]">
                <span>Bingung membedakan profil sangrai</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#68717E]" />
              </div>
            </div>

            {/* Objective Pills */}
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1.5">
                OBJECTIVE
              </label>
              <div className="flex items-center gap-1.5">
                {['Awareness', 'Consideration', 'Conversion'].map(obj => (
                  <button
                    key={obj}
                    onClick={() => setSelectedObjective(obj)}
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                      selectedObjective === obj
                        ? 'bg-[#EEF2FF] dark:bg-[#252A38] text-[#5268D8] dark:text-[#8292F0] font-semibold border border-[#5268D8]/30'
                        : 'bg-neutral-100 dark:bg-[#20242D] text-[#68717E] hover:text-[#17191F]'
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </div>

            {/* Funnel Stage Pills */}
            <div>
              <div className="flex items-center gap-1.5">
                {(['TOFU', 'MOFU', 'BOFU'] as const).map(fun => (
                  <button
                    key={fun}
                    onClick={() => setSelectedFunnel(fun)}
                    className={`flex-1 py-1 rounded-[6px] text-xs font-mono font-medium transition-colors cursor-pointer ${
                      selectedFunnel === fun
                        ? 'bg-[#EEF2FF] dark:bg-[#252A38] text-[#5268D8] dark:text-[#8292F0] font-semibold border border-[#5268D8]/30'
                        : 'bg-neutral-100 dark:bg-[#20242D] text-[#68717E]'
                    }`}
                  >
                    {fun}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Pillar */}
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1">
                CONTENT PILLAR
              </label>
              <div className="flex items-center justify-between p-2 rounded-[8px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] text-[#17191F] dark:text-[#E9EBF0]">
                <span>Edukasi seduh</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#68717E]" />
              </div>
            </div>

            {/* Format Pills */}
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1.5">
                FORMAT
              </label>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'instagram_reel', label: 'Reel' },
                  { id: 'instagram_carousel', label: 'Carousel' },
                  { id: 'instagram_story', label: 'Story' },
                  { id: 'youtube_shorts', label: 'Shorts' }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id as any)}
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                      selectedFormat === fmt.id
                        ? 'bg-[#EEF2FF] dark:bg-[#252A38] text-[#5268D8] dark:text-[#8292F0] font-semibold border border-[#5268D8]/30'
                        : 'bg-neutral-100 dark:bg-[#20242D] text-[#68717E]'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Pills */}
            <div>
              <label className="block text-[9px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1.5">
                TONE
              </label>
              <div className="flex items-center gap-1.5">
                {['Hangat', 'Teknis', 'Jenaka'].map(tn => (
                  <button
                    key={tn}
                    onClick={() => setSelectedTone(tn)}
                    className={`px-3 py-1 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                      selectedTone === tn
                        ? 'bg-[#EEF2FF] dark:bg-[#252A38] text-[#5268D8] dark:text-[#8292F0] font-semibold border border-[#5268D8]/30'
                        : 'bg-neutral-100 dark:bg-[#20242D] text-[#68717E]'
                    }`}
                  >
                    {tn}
                  </button>
                ))}
              </div>
            </div>

            {/* Reference URL Input */}
            <div>
              <div className="flex items-center justify-between p-2 rounded-[8px] bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] text-[#68717E]">
                <span className="text-[11px]">Tambah referensi / URL (opsional)</span>
                <Link className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerateIdea}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-[8px] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
              <span>{isGenerating ? 'Menghasilkan ide...' : 'Generate 5 ide'}</span>
            </button>

            <p className="text-[10px] font-mono text-[#68717E] text-center">
              5 variasi draft dibuat dari template lokal · tinjau dan edit sebelum dijadikan brief
            </p>
          </div>
        </div>

        {/* Right Column: Idea Cards Grid (7.5 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Tabs & View Controls */}
          <div className="flex items-center justify-between text-xs pb-1">
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'Semua', count: brandIdeas.filter(idea => idea.status !== 'ARCHIVED').length },
                { id: 'new', label: 'Baru', count: brandIdeas.filter(idea => idea.status === 'NEW' || idea.status === 'IDEA').length },
                { id: 'saved', label: 'Disimpan', count: brandIdeas.filter(idea => idea.status === 'SAVED').length },
                { id: 'archived', label: 'Diarsipkan', count: brandIdeas.filter(idea => idea.status === 'ARCHIVED').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1 rounded-[6px] font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-neutral-100 dark:bg-[#20242D] text-[#17191F] dark:text-[#E9EBF0] font-semibold'
                      : 'text-[#68717E] hover:text-[#17191F]'
                  }`}
                >
                  {tab.label} <span className="font-mono text-[10px]">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[#68717E]">
              <LayoutGrid className="w-4 h-4 text-[#5268D8]" />
              <List className="w-4 h-4" />
              <span className="text-[10px] font-mono">{filteredIdeas.length} ide</span>
            </div>
          </div>

          {/* 2x2 Grid of Idea Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredIdeas.map(idea => (
              <div
                key={idea.id}
                className="p-4 rounded-[12px] bg-white dark:bg-[#1B1E25] border border-[#E7E9ED] dark:border-[#292E38] shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                        idea.status === 'NEW'
                          ? 'bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252A38] dark:text-[#8292F0]'
                          : 'bg-neutral-100 dark:bg-[#20242D] text-[#68717E]'
                      }`}>
                        {idea.status === 'NEW' || idea.status === 'IDEA' ? 'BARU' : idea.status === 'SAVED' ? 'DISIMPAN' : idea.status === 'ARCHIVED' ? 'ARSIP' : 'JADI BRIEF'}
                      </span>
                      <span className="text-[10px] font-mono text-[#68717E]">
                        Edukasi seduh
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateIdeaStatus(idea.id, 'ARCHIVED');
                        showToast('Ide dipindahkan ke arsip.');
                      }}
                      disabled={idea.status === 'CONVERTED' || idea.status === 'ARCHIVED'}
                      title={idea.status === 'CONVERTED' ? 'Ide sudah menjadi brief' : 'Arsipkan ide'}
                      aria-label={`Arsipkan ide ${idea.title}`}
                      className="p-1 rounded text-[#68717E] hover:bg-neutral-100 dark:hover:bg-[#292E38] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-xs font-bold text-[#17191F] dark:text-[#E9EBF0] mb-1 leading-snug">
                    {idea.title}
                  </h4>
                  <p className="text-[11px] text-[#68717E] dark:text-[#9BA3B2] leading-relaxed line-clamp-3">
                    {idea.hypothesis}
                  </p>

                  <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-[#68717E]">
                    <span className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-[#20242D] font-semibold">{idea.funnelStage}</span>
                    <span>{idea.format.includes('reel') ? 'Reel' : 'Carousel'}</span>
                  </div>

                  <p className="text-[10px] font-mono text-[#68717E] mt-1">
                    Angle: <span className="text-[#17191F] dark:text-[#E9EBF0] font-medium">{idea.creativeAngle}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E7E9ED]/60 dark:border-[#2E3442]">
                  <span className="text-[10px] font-mono text-[#68717E]">
                    2 Okt · Ayu
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextStatus = idea.status === 'SAVED' ? 'NEW' : 'SAVED';
                        updateIdeaStatus(idea.id, nextStatus);
                        showToast(nextStatus === 'SAVED' ? 'Ide disimpan.' : 'Ide dikeluarkan dari daftar simpan.');
                      }}
                      disabled={idea.status === 'CONVERTED' || idea.status === 'ARCHIVED'}
                      className="px-2.5 py-1 text-xs font-medium rounded-[6px] border border-[#E7E9ED] dark:border-[#383F4C] text-[#68717E] hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {idea.status === 'SAVED' ? 'Tersimpan' : 'Simpan'}
                    </button>
                    <button
                      onClick={() => convertIdeaToContentBrief(idea.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-[6px] bg-[#17191F] hover:bg-neutral-800 text-white flex items-center gap-1 shadow-2xs"
                    >
                      <span>Jadi konten</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
