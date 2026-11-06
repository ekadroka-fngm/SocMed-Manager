import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import {
  Video,
  Layers,
  CircleDot,
  Calendar,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Music,
  CheckCircle2,
  AlertTriangle,
  Send
} from 'lucide-react';
import { SocialPlatform } from '../../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContentId?: string;
}

export type SchedulingFormat = 'video' | 'carousel' | 'story';

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  defaultContentId
}) => {
  const {
    activeBrand,
    contentItems,
    scheduleContentItem,
    approveContentItem,
    showToast
  } = useApp();

  const brandItems = contentItems.filter((c) => c.brandId === activeBrand.id);
  const [selectedContentId, setSelectedContentId] = useState<string>(
    defaultContentId || brandItems[0]?.id || ''
  );

  // Requirement: Opsi format (video, carousel, story) HANYA berbentuk icon
  const [selectedFormat, setSelectedFormat] = useState<SchedulingFormat>('video');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [scheduleDate, setScheduleDate] = useState<string>('2025-10-03');
  const [scheduleTime, setScheduleTime] = useState<string>('18:30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem =
    contentItems.find((c) => c.id === selectedContentId) || brandItems[0];

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) {
      showToast('Pilih konten yang ingin dijadwalkan.');
      return;
    }

    setIsSubmitting(true);

    // If not approved, auto-approve for convenience or ensure approval
    if (selectedItem.status !== 'APPROVED') {
      approveContentItem(selectedItem.id);
    }

    const scheduledDateTime = `${scheduleDate}T${scheduleTime}:00`;
    scheduleContentItem(selectedItem.id, scheduledDateTime, selectedPlatform);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        `Jadwal posting "${selectedItem.title}" berhasil diatur untuk ${scheduleDate} ${scheduleTime} WIB.`
      );
      onClose();
    }, 400);
  };

  const platformsList: { id: SocialPlatform; name: string; icon: React.ReactNode }[] = [
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-4 h-4 text-[#E1306C]" /> },
    { id: 'tiktok', name: 'TikTok', icon: <Music className="w-4 h-4 text-[#111318] dark:text-white" /> },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-4 h-4 text-[#FF0000]" /> },
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-4 h-4 text-[#1877F2]" /> }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Jadwalkan Konten untuk Posting"
      subtitle={`${activeBrand.name} · Pengaturan antrean publikasi otomatis`}
      maxWidth="md"
    >
      <form onSubmit={handleConfirmSchedule} className="space-y-4 text-xs">
        {/* 1. Pilih Konten */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1.5 font-medium">
            PILIH KONTEN BRIEF
          </label>
          <select
            value={selectedContentId}
            onChange={(e) => setSelectedContentId(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-xl text-xs text-[#17191F] dark:text-[#E9EBF0] focus:ring-1 focus:ring-[#5268D8] focus:outline-none"
          >
            {brandItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.status}) · v{item.currentVersion}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Format Selector - REQ: "ada opsi apakah konten ini akan berbentuk video, carousel, atau story dan semuanya hanya berbentuk icon" */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] font-medium">
              FORMAT KONTEN (ICON)
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Video Icon Button */}
            <button
              type="button"
              onClick={() => setSelectedFormat('video')}
              title="Video"
              aria-label="Format Video"
              className={`h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                selectedFormat === 'video'
                  ? 'bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] shadow-sm ring-2 ring-[#5268D8]'
                  : 'bg-neutral-50 dark:bg-[#20242D] text-[#68717E] hover:text-[#17191F] dark:hover:text-[#E9EBF0] border border-[#E7E9ED] dark:border-[#2E3442]'
              }`}
            >
              <Video className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Carousel Icon Button */}
            <button
              type="button"
              onClick={() => setSelectedFormat('carousel')}
              title="Carousel"
              aria-label="Format Carousel"
              className={`h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                selectedFormat === 'carousel'
                  ? 'bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] shadow-sm ring-2 ring-[#5268D8]'
                  : 'bg-neutral-50 dark:bg-[#20242D] text-[#68717E] hover:text-[#17191F] dark:hover:text-[#E9EBF0] border border-[#E7E9ED] dark:border-[#2E3442]'
              }`}
            >
              <Layers className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Story Icon Button */}
            <button
              type="button"
              onClick={() => setSelectedFormat('story')}
              title="Story"
              aria-label="Format Story"
              className={`h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                selectedFormat === 'story'
                  ? 'bg-[#17191F] dark:bg-white text-white dark:text-[#17191F] shadow-sm ring-2 ring-[#5268D8]'
                  : 'bg-neutral-50 dark:bg-[#20242D] text-[#68717E] hover:text-[#17191F] dark:hover:text-[#E9EBF0] border border-[#E7E9ED] dark:border-[#2E3442]'
              }`}
            >
              <CircleDot className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* 3. Platform Akun Tujuan */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1.5 font-medium">
            AKUN & PLATFORM TUJUAN
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {platformsList.map((p) => {
              const isSelected = selectedPlatform === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#5268D8] bg-[#EEF2FF] dark:bg-[#22283A] text-[#5268D8] dark:text-[#8292F0] font-semibold'
                      : 'border-[#E7E9ED] dark:border-[#2E3442] bg-neutral-50/70 dark:bg-[#20242D] text-[#68717E] hover:border-neutral-400'
                  }`}
                >
                  <div className="shrink-0">{p.icon}</div>
                  <span className="truncate text-xs">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Jadwal Tanggal & Jam (WIB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1 font-medium">
              TANGGAL PUBLIKASI
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-xl text-xs font-mono text-[#17191F] dark:text-[#E9EBF0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#68717E] dark:text-[#9BA3B2] mb-1 font-medium">
              JAM TAYANG (WIB)
            </label>
            <div className="relative">
              <input
                type="time"
                required
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] rounded-xl text-xs font-mono text-[#17191F] dark:text-[#E9EBF0]"
              />
            </div>
          </div>
        </div>

        {/* Status Info / Warning */}
        {selectedItem && (
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#20242D] border border-[#E7E9ED] dark:border-[#2E3442] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              {selectedItem.status === 'APPROVED' ? (
                <CheckCircle2 className="w-4 h-4 text-[#1E8E3E] shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
              )}
              <span className="truncate text-[#17191F] dark:text-[#E9EBF0]">
                Status konten:{' '}
                <strong className="font-mono">{selectedItem.status}</strong>
              </span>
            </div>
            {selectedItem.status !== 'APPROVED' && (
              <span className="text-[10px] text-[#5268D8] dark:text-[#8292F0] font-semibold shrink-0">
                Otomatis disetujui saat jadwal dibuat
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E7E9ED] dark:border-[#292E38]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#E7E9ED] dark:border-[#2E3442] rounded-xl text-xs font-medium text-[#68717E] dark:text-[#9BA3B2] hover:bg-neutral-50 dark:hover:bg-[#20242D] cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#5268D8] hover:bg-[#4357C5] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-70"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Menjadwalkan...' : 'Konfirmasi Jadwalkan'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
