import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  ChevronDown,
  Globe,
  Plus,
  LogOut,
  User,
  Trash2,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SUPPORTED_CURRENCIES } from '../../data/mockData';
import { CurrencyCode } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const {
    currency,
    setCurrency,
    setIsQuickActionOpen,
    setQuickActionType,
    setActiveTab,
    clearAllData,
  } = useApp();

  const { user, logout } = useAuth();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const currencyRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = user?.name ? user.name.trim()[0].toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FCFBF8]/95 border-b border-[#E6E2D8] backdrop-blur-md px-4 sm:px-6 flex items-center justify-between font-sans">
      {/* Left side: Hamburger & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-[#111111] hover:bg-[#F0EDE4] focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveTab('transactions')}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F0EDE4] hover:bg-[#E6E2D8] text-xs text-[#666666] cursor-pointer transition-colors w-72"
        >
          <Search className="w-3.5 h-3.5 text-[#111111]" />
          <span className="font-medium">Search transactions, tags...</span>
          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-[#FCFBF8] border border-[#D5D0C5] text-[10px] text-[#111111] font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Currency Switcher */}
        <div className="relative" ref={currencyRef}>
          <button
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCFBF8] hover:bg-[#F0EDE4] border border-[#E6E2D8] text-xs font-bold text-[#111111] transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#666666]" />
            <span>{currency}</span>
            <ChevronDown className="w-3 h-3 text-[#666666]" />
          </button>

          {isCurrencyOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#FCFBF8] border border-[#E6E2D8] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1 text-[10px] font-bold text-[#666666] uppercase tracking-wider">
                Base Currency
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {Object.values(SUPPORTED_CURRENCIES).map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => {
                      setCurrency(curr.code as CurrencyCode);
                      setIsCurrencyOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      currency === curr.code
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-[#111111] hover:bg-[#F0EDE4]'
                    }`}
                  >
                    <span>{curr.name}</span>
                    <span className="font-mono">{curr.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            setQuickActionType('expense');
            setIsQuickActionOpen(true);
          }}
          className="aura-btn-primary flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Add Transaction</span>
        </button>

        {/* Polished User Profile Treatment */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[#FCFBF8] hover:bg-[#F0EDE4] border border-[#E6E2D8] transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[#111111] text-[#FCFBF8] flex items-center justify-center font-black text-xs">
              {userInitial}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#111111]">
              {user?.name || 'Account'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FCFBF8] border border-[#E6E2D8] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2.5 border-b border-[#E6E2D8] mb-1 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#111111] text-[#FCFBF8] flex items-center justify-center font-black text-xs">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#111111] truncate">{user?.name || 'User Account'}</p>
                  <p className="text-[11px] text-[#666666] truncate">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-[#F0EDE4] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Account Preferences</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Reset all transaction and financial records?')) {
                      clearAllData();
                      setIsProfileOpen(false);
                    }
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Local Data</span>
                </button>

                <div className="border-t border-[#E6E2D8] my-1" />

                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
