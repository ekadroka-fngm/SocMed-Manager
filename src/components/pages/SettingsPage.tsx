import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Check,
  Shield,
  Sun,
  Moon,
  Monitor,
  Users,
  Sparkles,
  Share2,
  Bell,
  Palette,
  Clock,
  Settings as SettingsIcon,
  ChevronDown
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { workspace, theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState<string>('workspace');
  const [workspaceName, setWorkspaceName] = useState('Nusantara Studio');
  const [timezone, setTimezone] = useState('Asia/Jakarta (WIB)');
  const [language, setLanguage] = useState('Bahasa Indonesia');
  const [dataRetention, setDataRetention] = useState('12 bulan lalu agregasi');
  const [bgGenProvider, setBgGenProvider] = useState('Gemini adapter');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const navItems = [
    { id: 'workspace', label: 'Workspace', icon: <SettingsIcon className="w-4 h-4" /> },
    { id: 'users', label: 'Users & access', icon: <Users className="w-4 h-4" /> },
    { id: 'ai', label: 'AI providers', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'integrations', label: 'Social integrations', icon: <Share2 className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit logs', icon: <Clock className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {savedToast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#111318] text-white dark:bg-white dark:text-[#111318] text-xs font-medium rounded-xl shadow-lg flex items-center gap-1.5 animate-in fade-in duration-200">
          <Check className="w-3.5 h-3.5 text-[#21A68A]" />
          <span>Pengaturan berhasil disimpan</span>
        </div>
      )}

      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Settings
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-0.5">
            Workspace, akses dua pengguna, provider AI, tampilan, dan keamanan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setWorkspaceName('Nusantara Studio');
              setTimezone('Asia/Jakarta (WIB)');
              setLanguage('Bahasa Indonesia');
            }}
            className="px-3.5 py-1.5 bg-white dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6] shadow-xs hover:bg-[#F9FAFB] dark:hover:bg-[#222630] cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#5268D8] hover:bg-[#4154B8] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan perubahan</span>
          </button>
        </div>
      </div>

      {/* Mobile Settings View (matching Mobile_Settings_e374f76b.png) */}
      <div className="sm:hidden space-y-4">
        {/* 1. Workspace Card */}
        <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
              Workspace
            </h2>
            <button
              onClick={() => handleSave()}
              className="text-xs text-[#5268D8] dark:text-[#8292F0] font-semibold"
            >
              Edit
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#9CA3AF]">Nama</span>
              <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">{workspaceName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#9CA3AF]">Zona waktu</span>
              <span className="font-medium text-[#111318] dark:text-[#F3F4F6]">{timezone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#9CA3AF]">Retensi</span>
              <span className="font-medium text-[#111318] dark:text-[#F3F4F6]">12 bulan</span>
            </div>
          </div>
        </div>

        {/* 2. Users & Access Card */}
        <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
              Users & access
            </h2>
            <span className="text-[11px] font-mono text-[#9CA3AF]">2/2</span>
          </div>

          <div className="space-y-3">
            {/* User 1: Ayu */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-xs shrink-0">
                AP
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6] truncate">
                    Ayu Prameswari
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252B3B] dark:text-[#8292F0] font-semibold">
                    Owner
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#6B7280] dark:text-[#9CA3AF] truncate">
                  ayu@nusantara.studio
                </p>
              </div>
            </div>

            {/* User 2: Bagas */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#F1F3F5] dark:border-[#222630]">
              <div className="w-9 h-9 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-xs shrink-0">
                BW
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6] truncate">
                    Bagas Wirawan
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#F3F4F6] text-[#6B7280] dark:bg-[#222630] dark:text-[#9CA3AF] font-semibold">
                    Editor
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#68717E] dark:text-[#9BA3B2] truncate">
                  bagas@nusantara.studio
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Grouped Navigation Links with Chevrons */}
        <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs divide-y divide-[#F1F3F5] dark:divide-[#222630] overflow-hidden">
          {[
            { label: 'AI providers', icon: <Sparkles className="w-4 h-4 text-[#5268D8]" />, value: 'GPT · Gemini' },
            { label: 'Appearance', icon: <Palette className="w-4 h-4 text-[#E4A44A]" />, value: theme === 'light' ? 'Light' : 'Dark' },
            { label: 'Notifications', icon: <Bell className="w-4 h-4 text-[#21A68A]" />, value: 'Aktif' },
            { label: 'Security', icon: <Shield className="w-4 h-4 text-[#16A34A]" />, value: '2FA' },
            { label: 'Audit logs', icon: <Clock className="w-4 h-4 text-[#68717E]" />, value: '1.284' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 flex items-center justify-between text-xs cursor-pointer hover:bg-neutral-50 dark:hover:bg-[#1A1D24] transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                <span>{item.value}</span>
                <span className="text-[#9CA3AF]">›</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout with Left Nav and Stacked Settings Cards */}
      <div className="hidden sm:grid sm:grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Vertical Navigation (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] p-2 shadow-xs space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF2FF] text-[#5268D8] dark:bg-[#22283A] dark:text-[#8292F0]'
                      : 'text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F9FAFB] dark:hover:bg-[#1A1D24] hover:text-[#111318] dark:hover:text-[#F3F4F6]'
                  }`}
                >
                  <span className={isActive ? 'text-[#5268D8] dark:text-[#8292F0]' : 'text-[#9CA3AF]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area (lg:col-span-9 space-y-6) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Card 1: Workspace */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                  Workspace
                </h2>
                <p className="text-xs text-[#9CA3AF]">satu private workspace</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-1.5">
                  NAMA WORKSPACE
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-1.5">
                  ZONA WAKTU
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-1.5">
                  BAHASA
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] block mb-1.5">
                  RETENSI DATA ANALITIK
                </label>
                <input
                  type="text"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#E5E7EB] dark:border-[#272B35] rounded-xl text-xs font-medium text-[#111318] dark:text-[#F3F4F6]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#F1F3F5] dark:border-[#222630]">
              <span className="text-[11px] font-mono text-[#9CA3AF]">
                Workspace ID {workspace.id} · dibuat 14 Mar 2025 · D1 primary
              </span>
            </div>
          </div>

          {/* Card 2: Users & access */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                Users & access
              </h2>
              <p className="text-xs text-[#9CA3AF]">tepat 2 pengguna terotorisasi</p>
            </div>

            <div className="space-y-3.5">
              {/* User 1: Ayu */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    AP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6]">
                        Ayu Prameswari
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252B3B] dark:text-[#8292F0]">
                        Owner
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                      ayu@nusantara.studio · Cloudflare Access · login terakhir Hari ini 09:02
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-[11px] font-mono text-[#21A68A]">● 2FA aktif</span>
                  <button className="px-3 py-1 bg-white dark:bg-[#222630] border border-[#E5E7EB] dark:border-[#272B35] rounded-lg text-xs font-medium text-[#111318] dark:text-[#F3F4F6] hover:bg-[#F3F4F6] cursor-pointer">
                    Kelola
                  </button>
                </div>
              </div>

              {/* User 2: Bagas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#111318] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    BW
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6]">
                        Bagas Wirawan
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F3F4F6] text-[#6B7280] dark:bg-[#222630] dark:text-[#9CA3AF]">
                        Editor
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                      bagas@nusantara.studio · Cloudflare Access · login terakhir Kemarin 18:40
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-[11px] font-mono text-[#21A68A]">● 2FA aktif</span>
                  <button className="px-3 py-1 bg-white dark:bg-[#222630] border border-[#E5E7EB] dark:border-[#272B35] rounded-lg text-xs font-medium text-[#111318] dark:text-[#F3F4F6] hover:bg-[#F3F4F6] cursor-pointer">
                    Kelola
                  </button>
                </div>
              </div>

              {/* Allowlist Shield Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F0FDF4] dark:bg-[#12241B] border border-[#DCFCE7] dark:border-[#1E3A2C]">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#166534] dark:text-[#86EFAC]">
                      Allowlist email aktif — tidak ada public registration atau undangan terbuka.
                    </h4>
                    <p className="text-[10px] font-mono text-[#15803D] dark:text-[#4ADE80] mt-0.5">
                      cloudflare-access: policy nusantara-2-users · 2 email
                    </p>
                  </div>
                </div>

                <button className="px-3 py-1 bg-white dark:bg-[#1A1D24] border border-[#DCFCE7] dark:border-[#1E3A2C] rounded-lg text-xs font-medium text-[#166534] dark:text-[#86EFAC] hover:bg-[#DCFCE7]/40 cursor-pointer self-start sm:self-auto shrink-0">
                  Kelola policy
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: AI providers */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                AI providers
              </h2>
              <p className="text-xs text-[#9CA3AF]">
                assistant wajib GPT · background boleh provider lain
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Box A: AI Assistant */}
              <div className="p-4 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6]">
                    AI Assistant
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EEF2FF] text-[#5268D8] dark:bg-[#252B3B] dark:text-[#8292F0]">
                    ● GPT-5
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  Request melalui backend Worker · API key tidak pernah di frontend.
                </p>
              </div>

              {/* Box B: Background generation */}
              <div className="p-4 rounded-xl bg-[#F9FAFB] dark:bg-[#1A1D24] border border-[#F1F3F5] dark:border-[#222630] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111318] dark:text-[#F3F4F6]">
                    Background generation
                  </span>
                  <button
                    onClick={() =>
                      setBgGenProvider(
                        bgGenProvider === 'Gemini adapter'
                          ? 'Anthropic adapter'
                          : 'Gemini adapter'
                      )
                    }
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-white dark:bg-[#222630] border border-[#E5E7EB] dark:border-[#272B35] text-[#111318] dark:text-[#F3F4F6] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{bgGenProvider}</span>
                    <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                  </button>
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  Key di Worker Secrets · output divalidasi sebelum disimpan.
                </p>
              </div>
            </div>

            {/* Token Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[11px] text-[#6B7280] dark:text-[#9CA3AF]">
                  Pemakaian bulan ini
                </span>
                <span className="font-mono text-[11px] text-[#111318] dark:text-[#F3F4F6]">
                  1,24 jt / 2 jt token
                </span>
              </div>
              <div className="w-full h-2 bg-[#F3F4F6] dark:bg-[#222630] rounded-full overflow-hidden">
                <div className="h-full bg-[#5268D8] rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
          </div>

          {/* Card 4: Appearance */}
          <div className="bg-white dark:bg-[#161922] rounded-2xl border border-[#E5E7EB] dark:border-[#272B35] shadow-xs p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                Appearance
              </h2>
              <p className="text-xs text-[#9CA3AF]">tema & aksesibilitas</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Theme Segmented */}
              <div className="p-1 bg-[#F3F4F6] dark:bg-[#222630] rounded-xl flex items-center gap-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white dark:bg-[#161922] text-[#111318] dark:text-[#F3F4F6] shadow-xs'
                      : 'text-[#6B7280] dark:text-[#9CA3AF]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white dark:bg-[#161922] text-[#111318] dark:text-[#F3F4F6] shadow-xs'
                      : 'text-[#6B7280] dark:text-[#9CA3AF]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1.5 hover:text-[#111318] cursor-pointer"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>System</span>
                </button>
              </div>

              {/* Accent Color Swatches */}
              <div className="flex items-center gap-2 pl-2">
                {['#F7F7F4', '#E5E7EB', '#111318', '#0D9488', '#5268D8', '#EA580C', '#DC2626'].map(
                  (c, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 rounded-full border border-black/10 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Accessibility Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-[#111318] dark:text-[#F3F4F6]">
                  Kurangi animasi (prefers-reduced-motion)
                </span>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    reducedMotion ? 'bg-[#21A68A]' : 'bg-[#E5E7EB] dark:bg-[#272B35]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                      reducedMotion ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-[#111318] dark:text-[#F3F4F6]">
                  Fokus keyboard selalu terlihat
                </span>
                <button
                  onClick={() => setFocusVisible(!focusVisible)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    focusVisible ? 'bg-[#21A68A]' : 'bg-[#E5E7EB] dark:bg-[#272B35]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                      focusVisible ? 'left-5.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
