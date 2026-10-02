import React, { useState } from 'react';
import {
  User,
  Globe,
  Database,
  Download,
  Upload,
  Trash2,
  Check,
  Palette,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_CURRENCIES } from '../../data/mockData';
import { CurrencyCode } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    currency,
    setCurrency,
    categories,
    addCategory,
    deleteCategory,
    exportDatabaseJson,
    importDatabaseJson,
    clearAllData,
    triggerCelebration,
  } = useApp();

  const { user, updateUserProfile } = useAuth();

  // Profile Form
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // JSON Import Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: userName, email: userEmail });
    setIsSavedNotice(true);
    triggerCelebration();
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importDatabaseJson(content);
        triggerCelebration();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-5xl mx-auto animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold uppercase tracking-wider">
              System Matrix
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] text-[10px] font-bold">
              Preferences & Data
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Preferences & Data Studio
          </h1>
          <p className="text-xs text-[#111111]/70 mt-1">
            Configure default currency units, account identity, and export secure offline JSON snapshots.
          </p>
        </div>
      </div>

      {/* =========================================================================
          BENTO SETTINGS COLLAGE
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
        {/* Bento 1: User Profile & Security Card */}
        <div className="rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 sm:p-7 flex flex-col justify-between shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-[#111111]/10 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF56D] text-[#111111] font-black text-lg flex items-center justify-center shadow-xs">
              {userName ? userName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-[#111111] text-sm">Account Identity</h3>
              <p className="text-[11px] text-[#111111]/60">Personalized statement profile</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#111111]/70 font-bold mb-1">Legal / Display Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="aura-input"
              />
            </div>

            <div>
              <label className="block text-[#111111]/70 font-bold mb-1">Primary Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="aura-input"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-[#111111] hover:bg-[#222222] text-[#FCFBF8] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              {isSavedNotice ? <Check className="w-4 h-4 text-[#58C875]" /> : <Sparkles className="w-3.5 h-3.5 text-[#EAF56D]" />}
              <span>{isSavedNotice ? 'Profile Updated!' : 'Save Account Identity'}</span>
            </button>
          </form>
        </div>

        {/* Bento 2: Currency Selection Card */}
        <div className="rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 sm:p-7 flex flex-col justify-between shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#111111]/10 pb-4">
            <div className="p-2 rounded-xl bg-[#D9CEFF] text-[#111111]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#111111] text-sm">Default Currency Matrix</h3>
              <p className="text-[11px] text-[#111111]/60">Recalculates ledger across all views</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.values(SUPPORTED_CURRENCIES).map(curr => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code as CurrencyCode)}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  currency === curr.code
                    ? 'bg-[#111111] text-[#FCFBF8] border-[#111111] shadow-xs font-bold'
                    : 'bg-[#F7F5F0] border-[#111111]/10 text-[#111111]/70 hover:text-[#111111] hover:bg-[#F2EFE9]'
                }`}
              >
                <span className="text-base font-black block">{curr.symbol}</span>
                <span className="text-[10px] block font-mono font-bold">{curr.code}</span>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#111111]/60 text-center font-medium">Active: {SUPPORTED_CURRENCIES[currency]?.name}</p>
        </div>

        {/* Bento 3: Data Management & Snapshots Card */}
        <div className="md:col-span-2 rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 sm:p-7 flex flex-col justify-between shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#111111]/10 pb-4">
            <div className="p-2 rounded-xl bg-[#5B9E7C] text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#111111] text-sm">Local Persistence & Data Backups</h3>
              <p className="text-[11px] text-[#111111]/60">Your private financial records are stored securely on your device</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={exportDatabaseJson}
              className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#111111]/10 hover:border-[#111111]/30 hover:bg-[#F2EFE9] text-[#111111] text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Download className="w-5 h-5 text-[#111111]" />
              <span>Export JSON Snapshot</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl bg-[#F7F5F0] border border-[#111111]/10 hover:border-[#111111]/30 hover:bg-[#F2EFE9] text-[#111111] text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Upload className="w-5 h-5 text-[#111111]" />
              <span>Restore JSON Snapshot</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => {
                if (window.confirm('Clear all local data? This will reset all transactions, budgets, and goals.')) {
                  clearAllData();
                }
              }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:border-rose-400 text-rose-700 text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Reset All Records</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
