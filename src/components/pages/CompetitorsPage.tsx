import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
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
  postPerWeek: string;
  dominantTheme: string;
  lastSnapshot: string;
  status: 'Terpantau' | 'Perlu' | 'Arsip';
  location: string;
  profileUrl: string;
  manualNotes: { date: string; note: string }[];
  snapshotHistory: { date: string; count: number; tag: string }[];
}

export const CompetitorsPage: React.FC = () => {
  const { activeBrand, competitors: storedCompetitors, addCompetitor, addCompetitorSnapshot, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua kategori');
  const [selectedCompId, setSelectedCompId] = useState<string>('cmp_tuku');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [newSnapshotNote, setNewSnapshotNote] = useState('');

  const brandCompetitors = storedCompetitors.filter(competitor => competitor.brandId === activeBrand.id);
  const competitors: CompetitorRow[] = brandCompetitors.map(competitor => {
    const snapshots = [...competitor.snapshots].sort((a, b) =>
      new Date(b.snapshotDate || b.date || 0).getTime() - new Date(a.snapshotDate || a.date || 0).getTime()
    );
    const noteRows = snapshots
      .filter(snapshot => Boolean(snapshot.postSnippet))
      .map(snapshot => ({
        date: snapshot.snapshotDate || snapshot.date || 'Tanggal tidak dicatat',
        note: snapshot.postSnippet || ''
      }));
    if (!noteRows.length && competitor.manualNotes) {
      noteRows.push({ date: competitor.lastObservedAt || 'Tanggal tidak dicatat', note: competitor.manualNotes });
    }

    const status = competitor.status === 'ARCHIVED'
      ? 'Arsip'
      : competitor.status === 'NEEDS_REFRESH'
        ? 'Perlu'
        : 'Terpantau';

    return {
      id: competitor.id,
      name: competitor.name,
      handle: competitor.handle || '',
      avatar: competitor.name.charAt(0).toUpperCase(),
      category: competitor.category || competitor.platform,
      postPerWeek: competitor.postFrequency || 'Belum dicatat',
      dominantTheme: (competitor.dominantThemes || competitor.topPublicThemes || []).join(' · ') || 'Belum dicatat',
      lastSnapshot: snapshots[0]?.snapshotDate || snapshots[0]?.date || competitor.lastObservedAt || 'Belum ada',
      status,
      location: competitor.category || competitor.platform,
      profileUrl: competitor.profileUrl,
      manualNotes: noteRows,
      snapshotHistory: snapshots.map(snapshot => ({
        date: snapshot.snapshotDate || snapshot.date || 'Tanggal tidak dicatat',
        count: snapshot.postSnippet ? 1 : 0,
        tag: snapshot.verifiedPublic ? 'Terverifikasi' : 'Manual'
      }))
    };
  });

  // Form states for new competitor
  const [formName, setFormName] = useState('');
  const [formHandle, setFormHandle] = useState('');
  const [formCategory, setFormCategory] = useState('F&B lokal');
  const [formTheme, setFormTheme] = useState('');

  const categories = Array.from(new Set(competitors.map(competitor => competitor.category).filter(Boolean)));
  const filteredCompetitors = selectedCategory === 'Semua kategori'
    ? competitors
    : competitors.filter(competitor => competitor.category === selectedCategory);
  const selectedComp = filteredCompetitors.find(competitor => competitor.id === selectedCompId) || filteredCompetitors[0] || {
    id: '',
    name: '',
    handle: '',
    avatar: '',
    category: '',
    postPerWeek: 'Belum dicatat',
    dominantTheme: 'Belum dicatat',
    lastSnapshot: 'Belum ada',
    status: 'Perlu' as const,
    location: '',
    profileUrl: '',
    manualNotes: [],
    snapshotHistory: []
  };

  useEffect(() => {
    if (selectedComp && selectedComp.id !== selectedCompId) setSelectedCompId(selectedComp.id);
  }, [selectedComp?.id]);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName.trim();
    const handle = formHandle.trim().replace(/^@/, '');
    if (!name || !handle) {
      showToast('Nama dan handle/profile URL kompetitor wajib diisi.');
      return;
    }

    const id = addCompetitor({
      brandId: activeBrand.id,
      name,
      handle: `@${handle}`,
      platform: 'instagram',
      profileUrl: `https://instagram.com/${handle}`,
      category: formCategory,
      dominantThemes: formTheme.trim() ? [formTheme.trim()] : [],
      whitespaceOpportunity: '',
      status: 'ACTIVE'
    });
    setSelectedCompId(id);
    setIsAddModalOpen(false);
    setFormName('');
    setFormHandle('');
    setFormTheme('');
    showToast('Kompetitor ditambahkan. Data performa belum diisi.');
  };

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComp || !newSnapshotNote.trim()) {
      showToast('Pilih kompetitor dan isi catatan observasi terlebih dahulu.');
      return;
    }

    const competitor = brandCompetitors.find(item => item.id === selectedComp.id);
    if (!competitor) {
      showToast('Kompetitor tidak ditemukan.');
      return;
    }

    const observedAt = new Date().toISOString();
    addCompetitorSnapshot(selectedComp.id, {
      date: observedAt.slice(0, 10),
      snapshotDate: observedAt,
      postSnippet: newSnapshotNote.trim(),
      sourceUrl: competitor.profileUrl,
      verifiedPublic: false
    });
    setNewSnapshotNote('');
    setIsSnapshotModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Competitor intelligence
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            {competitors.length} kompetitor · {activeBrand.name} · observasi manual
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Filter kategori kompetitor"
            value={selectedCategory}
            onChange={event => setSelectedCategory(event.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6]"
          >
            <option value="Semua kategori">Semua kategori</option>
            {categories.map(category => <option key={category} value={category}>{category}</option>)}
          </select>

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
                {filteredCompetitors.length} kompetitor
              </span>
            </div>

            {/* Desktop Table (hidden on mobile) */}
            {!filteredCompetitors.length && (
            <p className="py-10 text-center text-xs text-[#68717E]">
              Belum ada kompetitor untuk brand ini. Tambahkan kompetitor pertama untuk mulai mencatat observasi.
            </p>
          )}
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
          {selectedComp ? (
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
              href={selectedComp.profileUrl.startsWith('http') ? selectedComp.profileUrl : `https://${selectedComp.profileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] text-xs font-mono text-[#5268D8] dark:text-[#8292F0] flex items-center justify-between hover:underline group"
            >
              <span className="truncate">{selectedComp.profileUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
            </a>}

            {/* Catatan Manual Section */}
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-2">
                CATATAN MANUAL
              </span>
              <div className="space-y-3">
                {selectedComp.manualNotes.length ? selectedComp.manualNotes.map((note, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <span className="text-[10px] font-mono text-[#9CA3AF] block">
                      {note.date}
                    </span>
                    <p className="text-[#111318] dark:text-[#F3F4F6] leading-relaxed">
                      {note.note}
                    </p>
                  </div>
                )) : <p className="text-xs text-[#9CA3AF]">Belum ada catatan. Tambahkan snapshot untuk menyimpan observasi.</p>}
              </div>
            </div>

            {/* Riwayat Snapshot Section */}
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-2">
                RIWAYAT SNAPSHOT
              </span>
              <div className="space-y-2">
                {selectedComp.snapshotHistory.length ? selectedComp.snapshotHistory.map((snap, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                        {snap.date}
                      </span>
                      <span className="text-[#111318] dark:text-[#F3F4F6]">
                        Snapshot tersimpan
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-[#F3F4F6] dark:bg-[#222630] text-[10px] font-mono text-[#9CA3AF]">
                      {snap.tag}
                    </span>
                  </div>
                )) : <p className="text-xs text-[#9CA3AF]">Belum ada snapshot.</p>}
              </div>
            </div>

            {/* Snapshot Baru Button */}
            <div className="pt-2">
              <button
                disabled={!selectedComp.id}
                onClick={() => setIsSnapshotModalOpen(true)}
                className="w-full py-2.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snapshot baru</span>
              </button>
            </div>
          </div>
          ) : (
            <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] bg-white dark:bg-[#161922] p-6 text-center space-y-3">
              <p className="text-xs text-[#68717E]">Belum ada kompetitor pada brand ini.</p>
              <button type="button" onClick={() => setIsAddModalOpen(true)} className="px-3 py-2 rounded-lg bg-[#5268D8] text-white text-xs font-semibold">Tambah kompetitor</button>
            </div>
          )}
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
