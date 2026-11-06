import React, { useState } from 'react';
import {
  ChevronDown,
  Plus,
  ExternalLink,
  Camera,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

interface CompetitorRow {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  avatarBg?: string;
  category: string;
  postPerWeek: number;
  dominantTheme: string;
  lastSnapshot: string;
  status: 'Terpantau' | 'Perlu' | 'Arsip';
  location: string;
  profileUrl: string;
  manualNotes: { date: string; note: string }[];
  snapshotHistory: { date: string; count: number; tag: string }[];
}

export const CompetitorsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua kategori');
  const [selectedCompId, setSelectedCompId] = useState<string>('comp_tuku');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [newSnapshotNote, setNewSnapshotNote] = useState('');

  const [competitors, setCompetitors] = useState<CompetitorRow[]>([
    {
      id: 'comp_tuku',
      name: 'Rumah Kopi Tuku',
      handle: '@rumahkopituku',
      avatar: 'R',
      category: 'F&B lokal',
      postPerWeek: 12,
      dominantTheme: 'Edukasi + promo',
      lastSnapshot: '28 Sep',
      status: 'Terpantau',
      location: 'F&B lokal · Yogyakarta',
      profileUrl: 'instagram.com/rumahkopituku',
      manualNotes: [
        {
          date: '28 Sep 2025',
          note: 'Narasi "ngopi murah" konsisten. Hook 3 detik pertama selalu pertanyaan harga.',
        },
        {
          date: '21 Sep 2025',
          note: 'Mulai eksperimen carousel edukasi; engagement naik dari 1,8% ke 2,6%.',
        },
      ],
      snapshotHistory: [
        { date: '28 Sep', count: 3, tag: 'manual' },
        { date: '21 Sep', count: 5, tag: 'manual' },
        { date: '14 Sep', count: 4, tag: 'manual' },
      ],
    },
    {
      id: 'comp_kenangan',
      name: 'Kopi Kenangan Rumah',
      handle: '@kenanganrumah',
      avatar: 'K',
      category: 'F&B chain',
      postPerWeek: 18,
      dominantTheme: 'Promo + humor',
      lastSnapshot: '28 Sep',
      status: 'Terpantau',
      location: 'F&B chain · Nasional',
      profileUrl: 'instagram.com/kenanganrumah',
      manualNotes: [
        {
          date: '28 Sep 2025',
          note: 'Menggunakan creator mikro lokal untuk promo bundling pagi.',
        },
      ],
      snapshotHistory: [
        { date: '28 Sep', count: 6, tag: 'manual' },
        { date: '20 Sep', count: 4, tag: 'manual' },
      ],
    },
    {
      id: 'comp_selaras_nat',
      name: 'Selaras Naturals',
      handle: '@selarasnaturals',
      avatar: 'S',
      category: 'Beauty',
      postPerWeek: 9,
      dominantTheme: 'Edukasi bahan',
      lastSnapshot: '28 Sep',
      status: 'Terpantau',
      location: 'Beauty · Bandung',
      profileUrl: 'instagram.com/selarasnaturals',
      manualNotes: [
        {
          date: '28 Sep 2025',
          note: 'Post carousel breakdown ingredients aktif setiap hari Selasa.',
        },
      ],
      snapshotHistory: [
        { date: '28 Sep', count: 4, tag: 'manual' },
        { date: '21 Sep', count: 3, tag: 'manual' },
      ],
    },
    {
      id: 'comp_titik_kumpul',
      name: 'Titik Kumpul Coffee',
      handle: '@titikkumpul',
      avatar: 'T',
      category: 'F&B lokal',
      postPerWeek: 6,
      dominantTheme: 'Komunitas',
      lastSnapshot: '21 Sep',
      status: 'Perlu',
      location: 'F&B lokal · Sleman',
      profileUrl: 'instagram.com/titikkumpul',
      manualNotes: [
        {
          date: '21 Sep 2025',
          note: 'Aktivasi event manual brewing setiap akhir pekan.',
        },
      ],
      snapshotHistory: [
        { date: '21 Sep', count: 2, tag: 'manual' },
        { date: '14 Sep', count: 3, tag: 'manual' },
      ],
    },
    {
      id: 'comp_barista_lokal',
      name: 'Barista Lokal ID',
      handle: '@baristalokal',
      avatar: 'B',
      category: 'Kreator',
      postPerWeek: 21,
      dominantTheme: 'Tutorial',
      lastSnapshot: '14 Sep',
      status: 'Arsip',
      location: 'Kreator · Jakarta',
      profileUrl: 'instagram.com/baristalokal',
      manualNotes: [
        {
          date: '14 Sep 2025',
          note: 'Fokus tutorial latte art dan kalibrasi gilingan biji.',
        },
      ],
      snapshotHistory: [
        { date: '14 Sep', count: 5, tag: 'manual' },
      ],
    },
  ]);

  // Form states for new competitor
  const [formName, setFormName] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formCategory, setFormCategory] = useState('F&B lokal');
  const [formTheme, setFormTheme] = useState('');

  const selectedComp =
    competitors.find((c) => c.id === selectedCompId) || competitors[0];

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newComp: CompetitorRow = {
      id: `comp_${Date.now()}`,
      name: formName.trim(),
      handle: formHandle.trim().startsWith('@') ? formHandle.trim() : `@${formHandle.trim()}`,
      avatar: formName.trim().charAt(0).toUpperCase(),
      category: formCategory,
      postPerWeek: 8,
      dominantTheme: formTheme.trim() || 'Umum',
      lastSnapshot: 'Hari ini',
      status: 'Terpantau',
      location: `${formCategory} · Indonesia`,
      profileUrl: `instagram.com/${formHandle.replace('@', '')}`,
      manualNotes: [
        {
          date: 'Hari ini',
          note: 'Baru ditambahkan ke daftar pengamatan kompetitor.',
        },
      ],
      snapshotHistory: [{ date: 'Hari ini', count: 1, tag: 'manual' }],
    };

    setCompetitors([newComp, ...competitors]);
    setSelectedCompId(newComp.id);
    setIsAddModalOpen(false);
    setFormName('');
    setFormHandle('');
    setFormTheme('');
  };

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapshotNote.trim()) return;

    setCompetitors((prev) =>
      prev.map((c) => {
        if (c.id === selectedComp.id) {
          return {
            ...c,
            lastSnapshot: 'Hari ini',
            manualNotes: [
              { date: 'Hari ini', note: newSnapshotNote.trim() },
              ...c.manualNotes,
            ],
            snapshotHistory: [
              { date: 'Hari ini', count: 3, tag: 'manual' },
              ...c.snapshotHistory,
            ],
          };
        }
        return c;
      })
    );

    setNewSnapshotNote('');
    setIsSnapshotModalOpen(false);
  };

  const filteredCompetitors =
    selectedCategory === 'Semua kategori'
      ? competitors
      : competitors.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Title & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Competitor intelligence
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            6 kompetitor dipantau · data publik & observasi manual · snapshot terakhir 28 Sep 2025
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Dropdown */}
          <button
            onClick={() =>
              setSelectedCategory(
                selectedCategory === 'Semua kategori' ? 'F&B lokal' : 'Semua kategori'
              )
            }
            className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1.5 shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer"
          >
            <span>{selectedCategory}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>

          {/* Add Competitor Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah kompetitor</span>
          </button>
        </div>
      </div>

      {/* Amber Disclaimer Banner */}
      <div className="p-3.5 rounded-xl bg-[#FFFBEB] dark:bg-[#2A2318] border border-[#FDE68A] dark:border-[#54411C] flex items-start sm:items-center gap-2.5 text-xs text-[#92400E] dark:text-[#FCD34D]">
        <Info className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0 text-[#D97706]" />
        <p className="leading-relaxed">
          Hanya data publik. Reach, retensi, dan konversi privat kompetitor tidak diambil maupun diklaim — setiap snapshot mencatat sumber dan waktu pengambilan.
        </p>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table: Daftar kompetitor (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                Daftar kompetitor
              </h2>
              <span className="text-xs font-mono text-[#9CA3AF]">
                {filteredCompetitors.length} dari 6 · diurutkan snapshot terbaru
              </span>
            </div>

            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#272B35] text-[10px] font-mono uppercase text-[#9CA3AF] dark:text-[#6B7280]">
                    <th className="pb-3 font-medium">KOMPETITOR</th>
                    <th className="pb-3 font-medium">KATEGORI</th>
                    <th className="pb-3 font-medium">POST/MGG</th>
                    <th className="pb-3 font-medium">TEMA DOMINAN</th>
                    <th className="pb-3 font-medium">SNAPSHOT</th>
                    <th className="pb-3 font-medium">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5] dark:divide-[#222630]">
                  {filteredCompetitors.map((comp) => {
                    const isSelected = comp.id === selectedComp.id;
                    return (
                      <tr
                        key={comp.id}
                        onClick={() => setSelectedCompId(comp.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#EEF2FF]/60 dark:bg-[#202638]'
                            : 'hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24]'
                        }`}
                      >
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] font-bold text-xs flex items-center justify-center shrink-0">
                              {comp.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                                {comp.name}
                              </div>
                              <div className="text-[11px] font-mono text-[#9CA3AF]">
                                {comp.handle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                          {comp.category}
                        </td>
                        <td className="py-3.5 font-mono text-[#111318] dark:text-[#F3F4F6] font-bold tabular-nums">
                          {comp.postPerWeek}
                        </td>
                        <td className="py-3.5 text-[#111318] dark:text-[#F3F4F6]">
                          {comp.dominantTheme}
                        </td>
                        <td className="py-3.5 font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                          {comp.lastSnapshot}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                              comp.status === 'Terpantau'
                                ? 'bg-[#ECFDF5] text-[#059669] dark:bg-[#132E24] dark:text-[#34D399]'
                                : comp.status === 'Perlu'
                                ? 'bg-[#FFFBEB] text-[#D97706] dark:bg-[#342714] dark:text-[#FBBF24]'
                                : 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#222630] dark:text-[#9CA3AF]'
                            }`}
                          >
                            {comp.status === 'Terpantau' && '● '}
                            {comp.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Native Competitor List (matching Mobile_Competitors_32ae228d.png) */}
            <div className="sm:hidden divide-y divide-[#F1F3F5] dark:divide-[#222630]">
              {filteredCompetitors.map((comp) => {
                const isSelected = comp.id === selectedComp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`py-3.5 px-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EEF2FF]/60 dark:bg-[#202638]'
                        : 'hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] font-bold text-xs flex items-center justify-center shrink-0">
                        {comp.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#111318] dark:text-[#F3F4F6] truncate">
                          {comp.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#9CA3AF] truncate">
                          {comp.handle} · {comp.postPerWeek} post/mgg
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-medium shrink-0 ${
                        comp.status === 'Terpantau'
                          ? 'bg-[#ECFDF5] text-[#059669] dark:bg-[#132E24] dark:text-[#34D399]'
                          : comp.status === 'Perlu'
                          ? 'bg-[#FFFBEB] text-[#D97706] dark:bg-[#342714] dark:text-[#FBBF24]'
                          : 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#222630] dark:text-[#9CA3AF]'
                      }`}
                    >
                      {comp.status === 'Terpantau' && '● '}
                      {comp.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Detail Card (lg:col-span-4) */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6 space-y-5">
            {/* Competitor Header */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#222630] text-[#111318] dark:text-[#F3F4F6] font-bold text-base flex items-center justify-center shrink-0">
                {selectedComp.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6] truncate">
                  {selectedComp.name}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                  {selectedComp.location}
                </p>
              </div>
            </div>

            {/* Profile URL Box */}
            <a
              href={`https://${selectedComp.profileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] text-xs font-mono text-[#5268D8] dark:text-[#8292F0] flex items-center justify-between hover:underline group"
            >
              <span className="truncate">{selectedComp.profileUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
            </a>

            {/* Catatan Manual Section */}
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-2">
                CATATAN MANUAL
              </span>
              <div className="space-y-3">
                {selectedComp.manualNotes.map((note, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <span className="text-[10px] font-mono text-[#9CA3AF] block">
                      {note.date}
                    </span>
                    <p className="text-[#111318] dark:text-[#F3F4F6] leading-relaxed">
                      {note.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Riwayat Snapshot Section */}
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-2">
                RIWAYAT SNAPSHOT
              </span>
              <div className="space-y-2">
                {selectedComp.snapshotHistory.map((snap, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                        {snap.date}
                      </span>
                      <span className="text-[#111318] dark:text-[#F3F4F6]">
                        {snap.count} post diamati
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#F3F4F6] dark:bg-[#222630] text-[10px] font-mono text-[#9CA3AF]">
                      {snap.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Snapshot Baru Button */}
            <div className="pt-2">
              <button
                onClick={() => setIsSnapshotModalOpen(true)}
                className="w-full py-2.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snapshot baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Tambah Kompetitor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                Tambah kompetitor baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#6B7280] hover:text-[#111318] dark:text-[#9CA3AF] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCompetitor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#111318] dark:text-[#F3F4F6] mb-1 font-medium">
                  Nama Brand / Usaha *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Filosofi Kopi Jogja"
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[#111318] dark:text-[#F3F4F6] mb-1 font-medium">
                  Akun Instagram
                </label>
                <input
                  type="text"
                  value={formHandle}
                  onChange={(e) => setFormHandle(e.target.value)}
                  placeholder="@filosofikopi"
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#111318] dark:text-[#F3F4F6] mb-1 font-medium">
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs"
                >
                  <option value="F&B lokal">F&B lokal</option>
                  <option value="F&B chain">F&B chain</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Kreator">Kreator</option>
                </select>
              </div>

              <div>
                <label className="block text-[#111318] dark:text-[#F3F4F6] mb-1 font-medium">
                  Tema Dominan yang Teramati
                </label>
                <input
                  type="text"
                  value={formTheme}
                  onChange={(e) => setFormTheme(e.target.value)}
                  placeholder="e.g. Edukasi seduh + promo mingguan"
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F3F5] dark:border-[#222630]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium"
                >
                  Simpan Kompetitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Snapshot Baru */}
      {isSnapshotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                Catat snapshot manual: {selectedComp.name}
              </h3>
              <button
                onClick={() => setIsSnapshotModalOpen(false)}
                className="p-1 text-[#6B7280] hover:text-[#111318] dark:text-[#9CA3AF] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSnapshot} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#111318] dark:text-[#F3F4F6] mb-1 font-medium">
                  Observasi Konten & Pola Baru
                </label>
                <textarea
                  required
                  rows={4}
                  value={newSnapshotNote}
                  onChange={(e) => setNewSnapshotNote(e.target.value)}
                  placeholder="Tuliskan temuan hook, tema dominan, atau angle promosi baru dari postingan publik mereka..."
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F3F5] dark:border-[#222630]">
                <button
                  type="button"
                  onClick={() => setIsSnapshotModalOpen(false)}
                  className="px-3.5 py-1.5 border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
