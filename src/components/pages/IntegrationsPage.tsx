import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronDown,
  Plus,
  RefreshCw,
  Instagram,
  Facebook,
  Youtube,
  Music,
  Bookmark,
  MoreHorizontal,
  Check,
  X as XIcon
} from 'lucide-react';

interface IntegrationAccount {
  id: string;
  name: string;
  handle: string;
  apiSpec: string;
  icon: React.ReactNode;
  publish: boolean;
  analytics: boolean;
  refreshToken: boolean;
  idempotency: boolean;
  supportedFormats: string;
  tokenExpiresIn: string;
  status: 'Aktif' | 'Segera habis' | 'Belum';
  permissions: string;
  limits: string;
  quotaUsed: number;
  quotaTotal: number;
}

export const IntegrationsPage: React.FC = () => {
  const { activeBrand, activeBrandId, switchBrand, brands } = useApp();
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ig_arunika');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);

  const [accounts] = useState<IntegrationAccount[]>([
    {
      id: 'ig_arunika',
      name: 'Instagram',
      handle: '@arunika.coffee',
      apiSpec: 'Meta Graph API v21',
      icon: <Instagram className="w-4 h-4 text-[#E1306C]" />,
      publish: true,
      analytics: true,
      refreshToken: true,
      idempotency: false,
      supportedFormats: 'Reel · Carousel · Story',
      tokenExpiresIn: '52 j',
      status: 'Aktif',
      permissions: 'instagram_content_publish, instagram_manage_insights, pages_show_list, business_management',
      limits: 'Reel maks 90 detik; carousel maks 10 item; 25 post / 24 jam.',
      quotaUsed: 142,
      quotaTotal: 200,
    },
    {
      id: 'fb_arunika',
      name: 'Facebook',
      handle: 'Arunika Coffee Page',
      apiSpec: 'Meta Graph API v21',
      icon: <Facebook className="w-4 h-4 text-[#1877F2]" />,
      publish: true,
      analytics: true,
      refreshToken: true,
      idempotency: true,
      supportedFormats: 'Post · Reel',
      tokenExpiresIn: '52 j',
      status: 'Aktif',
      permissions: 'pages_read_engagement, pages_manage_posts, publish_video',
      limits: 'Video maks 240 menit; 50 post / 24 jam.',
      quotaUsed: 84,
      quotaTotal: 200,
    },
    {
      id: 'tiktok_arunika',
      name: 'TikTok',
      handle: '@arunikacoffee',
      apiSpec: 'TikTok Content Posting API v2',
      icon: <Music className="w-4 h-4 text-[#111318] dark:text-white" />,
      publish: true,
      analytics: true,
      refreshToken: true,
      idempotency: true,
      supportedFormats: 'Video · Photo',
      tokenExpiresIn: '48 j',
      status: 'Aktif',
      permissions: 'video.upload, video.publish, user.info.basic',
      limits: 'Video 15s-10m; maks resolusi 1080p; foto maks 35 foto.',
      quotaUsed: 62,
      quotaTotal: 150,
    },
    {
      id: 'yt_arunika',
      name: 'YouTube',
      handle: 'Arunika Coffee',
      apiSpec: 'YouTube Data API v3',
      icon: <Youtube className="w-4 h-4 text-[#FF0000]" />,
      publish: true,
      analytics: true,
      refreshToken: false,
      idempotency: true,
      supportedFormats: 'Video · Shorts',
      tokenExpiresIn: '3 j',
      status: 'Segera habis',
      permissions: 'https://www.googleapis.com/auth/youtube.upload, youtube.readonly',
      limits: 'Kuota harian 10.000 unit; upload video membutuhkan ~1.600 unit.',
      quotaUsed: 7200,
      quotaTotal: 10000,
    },
    {
      id: 'pin_arunika',
      name: 'Pinterest',
      handle: 'belum terhubung',
      apiSpec: 'Pinterest API v5',
      icon: <Bookmark className="w-4 h-4 text-[#BD081C]" />,
      publish: true,
      analytics: false,
      refreshToken: false,
      idempotency: false,
      supportedFormats: 'Pin · Idea Pin',
      tokenExpiresIn: '—',
      status: 'Belum',
      permissions: 'boards:read, pins:read, pins:write',
      limits: 'Perlu otorisasi ulang OAuth token.',
      quotaUsed: 0,
      quotaTotal: 100,
    },
  ]);

  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const showIntegrationNotice = (message: string) => {
    setToastMsg(message);
    window.setTimeout(() => setToastMsg(null), 4000);
  };

  const handleSync = () => {
    showIntegrationNotice(`Sync ${selectedAccount.name} belum dijalankan: OAuth dan API platform belum dikonfigurasi. Tidak ada data atau token yang diubah.`);
  };

  const handleReauth = () => {
    showIntegrationNotice(`Re-authorize ${selectedAccount.name} belum tersedia. Hubungkan OAuth resmi setelah konfigurasi Client ID, Secret, callback URL, dan scopes.`);
  };

  const handleDisconnect = () => {
    showIntegrationNotice(`Tidak ada token ${selectedAccount.name} yang tersimpan di backend saat ini, jadi tidak ada koneksi yang diputus.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#111318] text-white dark:bg-white dark:text-[#111318] text-xs font-medium rounded-xl shadow-lg animate-in fade-in duration-200">
          {toastMsg}
        </div>
      )}

      {/* Title & Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Integrations
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            5 platform tersedia · OAuth belum dikonfigurasi · akun di bawah hanya data contoh UI
          </p>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Brand dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              className="px-3 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1.5 shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeBrand.themeColor || '#B85D2A' }}
              />
              <span>{activeBrand.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>

            {isBrandDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl shadow-xl z-30 p-1">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      switchBrand(b.id);
                      setIsBrandDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors ${
                      b.id === activeBrandId
                        ? 'bg-[#EEF2FF] text-[#5268D8] font-bold dark:bg-[#202534]'
                        : 'hover:bg-neutral-50 dark:hover:bg-[#222630]'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Connection button */}
          <button
            onClick={() => {
              showIntegrationNotice('OAuth belum tersedia. Konfigurasikan credentials dan callback platform sebelum akun bisa dihubungkan.');
            }}
            className="px-3.5 py-1.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah koneksi</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#E4A44A]/40 bg-[#FEF3C7]/40 dark:bg-[#382D1B]/30 px-4 py-3 text-xs text-[#8A5A12] dark:text-[#FBBF24]">
        Data akun, status token, dan kuota pada halaman ini masih placeholder tampilan. Tombol tidak akan mengubah status palsu atau mengklaim sinkronisasi berhasil sampai OAuth/API resmi disambungkan.
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table: Akun terhubung (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6">
            <div className="mb-5">
              <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                Akun terhubung
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
                kapabilitas mengikuti API resmi tiap platform
              </p>
            </div>

            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#272B35] text-[10px] font-mono uppercase text-[#9CA3AF] dark:text-[#6B7280]">
                    <th className="pb-3 font-medium">AKUN</th>
                    <th className="pb-3 font-medium">PUBLISH</th>
                    <th className="pb-3 font-medium">ANALYTICS</th>
                    <th className="pb-3 font-medium">FORMAT DIDUKUNG</th>
                    <th className="pb-3 font-medium">TOKEN</th>
                    <th className="pb-3 font-medium">STATUS</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F3F5] dark:divide-[#222630]">
                  {accounts.map((acc) => {
                    const isSelected = acc.id === selectedAccount.id;
                    return (
                      <tr
                        key={acc.id}
                        onClick={() => setSelectedAccountId(acc.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#EEF2FF]/60 dark:bg-[#202638]'
                            : 'hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24]'
                        }`}
                      >
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] dark:bg-[#222630] flex items-center justify-center shrink-0">
                              {acc.icon}
                            </div>
                            <div>
                              <div className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                                {acc.name}
                              </div>
                              <div className="text-[11px] font-mono text-[#9CA3AF]">
                                {acc.handle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          {acc.publish ? (
                            <Check className="w-4 h-4 text-[#21A68A]" />
                          ) : (
                            <XIcon className="w-4 h-4 text-[#DC6470]" />
                          )}
                        </td>
                        <td className="py-3.5">
                          {acc.analytics ? (
                            <Check className="w-4 h-4 text-[#21A68A]" />
                          ) : (
                            <XIcon className="w-4 h-4 text-[#9CA3AF]" />
                          )}
                        </td>
                        <td className="py-3.5 font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                          {acc.supportedFormats}
                        </td>
                        <td className="py-3.5 font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                          {acc.tokenExpiresIn}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                              acc.status === 'Aktif'
                                ? 'bg-[#ECFDF5] text-[#059669] dark:bg-[#132E24] dark:text-[#34D399]'
                                : acc.status === 'Segera habis'
                                ? 'bg-[#FFFBEB] text-[#D97706] dark:bg-[#342714] dark:text-[#FBBF24]'
                                : 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#222630] dark:text-[#9CA3AF]'
                            }`}
                          >
                            ● {acc.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAccountId(acc.id);
                            }}
                            className="p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#272B35] text-[#9CA3AF]"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Native Connected Accounts List (matching Mobile_Integrations_b2cb7a68.png) */}
            <div className="sm:hidden divide-y divide-[#F1F3F5] dark:divide-[#222630]">
              {accounts.map((acc) => {
                const isSelected = acc.id === selectedAccount.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`py-3.5 px-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EEF2FF]/60 dark:bg-[#202638]'
                        : 'hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#222630] flex items-center justify-center shrink-0">
                        {acc.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#111318] dark:text-[#F3F4F6] truncate">
                          {acc.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#9CA3AF] truncate">
                          {acc.handle} · {acc.tokenExpiresIn !== '—' ? `Token: ${acc.tokenExpiresIn}` : 'Belum terhubung'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-medium shrink-0 ${
                        acc.status === 'Aktif'
                          ? 'bg-[#ECFDF5] text-[#059669] dark:bg-[#132E24] dark:text-[#34D399]'
                          : acc.status === 'Segera habis'
                          ? 'bg-[#FFFBEB] text-[#D97706] dark:bg-[#342714] dark:text-[#FBBF24]'
                          : 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#222630] dark:text-[#9CA3AF]'
                      }`}
                    >
                      ● {acc.status}
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
            {/* Account Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] dark:bg-[#222630] flex items-center justify-center shrink-0">
                  {selectedAccount.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
                    {selectedAccount.name}
                  </h3>
                  <p className="text-[11px] font-mono text-[#9CA3AF]">
                    {selectedAccount.handle} · {selectedAccount.apiSpec}
                  </p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${
                  selectedAccount.status === 'Aktif'
                    ? 'bg-[#ECFDF5] text-[#059669] dark:bg-[#132E24] dark:text-[#34D399]'
                    : selectedAccount.status === 'Segera habis'
                    ? 'bg-[#FFFBEB] text-[#D97706] dark:bg-[#342714] dark:text-[#FBBF24]'
                    : 'bg-[#F3F4F6] text-[#6B7280] dark:bg-[#222630] dark:text-[#9CA3AF]'
                }`}
              >
                ● {selectedAccount.status.toUpperCase()}
              </span>
            </div>

            {/* 4 Capabilities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F1F3F5] dark:border-[#222630] text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#9CA3AF] block">Publish</span>
                <span className="font-semibold text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-[#21A68A]" /> Ya
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#9CA3AF] block">Analytics</span>
                <span className="font-semibold text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1 mt-0.5">
                  {selectedAccount.analytics ? (
                    <>
                      <Check className="w-3 h-3 text-[#21A68A]" /> Ya
                    </>
                  ) : (
                    <>
                      <XIcon className="w-3 h-3 text-[#DC6470]" /> Tidak
                    </>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#9CA3AF] block">Refresh token</span>
                <span className="font-semibold text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1 mt-0.5">
                  {selectedAccount.refreshToken ? (
                    <>
                      <Check className="w-3 h-3 text-[#21A68A]" /> Ya
                    </>
                  ) : (
                    <>
                      <XIcon className="w-3 h-3 text-[#DC6470]" /> Tidak
                    </>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#9CA3AF] block">Idempotency</span>
                <span className="font-semibold text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1 mt-0.5">
                  {selectedAccount.idempotency ? (
                    <>
                      <Check className="w-3 h-3 text-[#21A68A]" /> Ya
                    </>
                  ) : (
                    <>
                      <XIcon className="w-3 h-3 text-[#DC6470]" /> Tidak
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Izin Section */}
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-1">
                IZIN
              </span>
              <p className="font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF] bg-[#F9FAFB] dark:bg-[#1A1D24] p-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#272B35] leading-relaxed break-all">
                {selectedAccount.permissions}
              </p>
            </div>

            {/* Batasan Section */}
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-1">
                BATASAN
              </span>
              <p className="text-xs text-[#111318] dark:text-[#F3F4F6] leading-relaxed">
                {selectedAccount.limits}
              </p>
            </div>

            {/* Kuota API Section */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF]">
                  KUOTA API
                </span>
                <span className="font-mono text-xs text-[#111318] dark:text-[#F3F4F6]">
                  {selectedAccount.quotaUsed} / {selectedAccount.quotaTotal} per jam{' '}
                  <span className="font-bold text-[#E65100]">
                    {Math.round((selectedAccount.quotaUsed / selectedAccount.quotaTotal) * 100)}%
                  </span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#F3F4F6] dark:bg-[#222630] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E65100] rounded-full"
                  style={{
                    width: `${Math.round(
                      (selectedAccount.quotaUsed / selectedAccount.quotaTotal) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full py-2.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-70"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sync now'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleReauth}
                  className="py-2 px-3 border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24] transition-colors cursor-pointer"
                >
                  Otorisasi ulang
                </button>
                <button
                  onClick={handleDisconnect}
                  className="py-2 px-3 border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#DC6470] hover:bg-[#FEF2F2] dark:hover:bg-[#321B1F] transition-colors cursor-pointer"
                >
                  Putuskan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
