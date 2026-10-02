import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  Clock,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { login, register, resetPassword, loginWithGoogle, loginWithGithub } = useAuth();
  const { setActiveTab, triggerCelebration } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    setTimeout(async () => {
      try {
        if (mode === 'login') {
          if (!email.trim() || !password.trim()) {
            setErrorMsg('Please enter both your email address and password.');
            setLoading(false);
            return;
          }
          await login(email, password);
        } else if (mode === 'register') {
          if (!name.trim() || !email.trim() || !password.trim()) {
            setErrorMsg('Please complete all registration fields.');
            setLoading(false);
            return;
          }
          await register(name, email, password);
        } else if (mode === 'forgot') {
          if (!email.trim()) {
            setErrorMsg('Please enter your email address.');
            setLoading(false);
            return;
          }
          await resetPassword(email);
          setSuccessMsg('Password reset instructions sent to your email.');
          setLoading(false);
          return;
        }

        setLoading(false);
        triggerCelebration();
      } catch (err: any) {
        setErrorMsg(err?.message || 'Authentication failed. Please verify your credentials.');
        setLoading(false);
      }
    }, 300);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    setTimeout(async () => {
      try {
        if (provider === 'google') await loginWithGoogle();
        else await loginWithGithub();
        setLoading(false);
        triggerCelebration();
      } catch (err: any) {
        setErrorMsg(err?.message || `${provider === 'google' ? 'Google' : 'GitHub'} sign-in is not configured.`);
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] flex flex-col justify-between selection:bg-[#EAF56D] selection:text-[#111111] font-sans">
      {/* Clean Top Navigation Bar */}
      <header className="px-6 py-5 max-w-6xl mx-auto w-full flex items-center justify-between border-b border-[#E6E2D8]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center font-black text-sm shadow-sm">
            A
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-[#111111]">AURA PRO</span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] font-bold">
              Fintech Bento
            </span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('landing')}
          className="px-4 py-2 rounded-xl bg-[#FCFBF8] hover:bg-[#F0EDE4] border border-[#E6E2D8] text-xs font-bold text-[#111111] transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Product Overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Main Centered 2-Column Bento Layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-[10px] items-stretch">
          
          {/* =========================================================================
              LEFT COLUMN: WELCOMING AUTHENTICATION CARD (7 Cols)
             ========================================================================= */}
          <div className="lg:col-span-7 rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] p-7 sm:p-9 shadow-sm flex flex-col justify-between">
            <div>
              {/* Intro */}
              <div className="mb-6">
                <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-1">
                  Private Wealth Command
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                  {mode === 'login' && 'Sign in to Aura Pro'}
                  {mode === 'register' && 'Create your account'}
                  {mode === 'forgot' && 'Reset your password'}
                </h1>
                <p className="text-xs sm:text-sm text-[#666666] mt-1 leading-relaxed">
                  {mode === 'login' && 'Track cash flows, automated budgets, and savings vaults with real-time intelligence.'}
                  {mode === 'register' && 'Start fresh with dedicated user isolation and bank-grade privacy.'}
                  {mode === 'forgot' && 'Enter your email to receive secure recovery instructions.'}
                </p>
              </div>

              {/* Mode Tabs */}
              {mode !== 'forgot' && (
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F0EDE4] border border-[#E6E2D8] mb-5">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'login'
                        ? 'bg-[#FCFBF8] text-[#111111] shadow-sm'
                        : 'text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'register'
                        ? 'bg-[#FCFBF8] text-[#111111] shadow-sm'
                        : 'text-[#666666] hover:text-[#111111]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  className="py-2.5 px-3 rounded-xl bg-[#FCFBF8] border border-[#E6E2D8] hover:bg-[#F0EDE4] text-xs font-bold text-[#111111] flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                    <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuth('github')}
                  className="py-2.5 px-3 rounded-xl bg-[#FCFBF8] border border-[#E6E2D8] hover:bg-[#F0EDE4] text-xs font-bold text-[#111111] flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4 fill-current text-[#111111]" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="relative mb-5 flex items-center justify-center">
                <div className="w-full border-t border-[#E6E2D8]" />
                <span className="absolute px-3 bg-[#FCFBF8] text-[10px] text-[#888888] font-bold uppercase tracking-wider">
                  or email address
                </span>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1">Full Legal Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alexandre Sterling"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#E6E2D8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#FFFFFF] border border-[#E6E2D8] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#111111]">Password</label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          className="text-xs text-[#666666] hover:text-[#111111] font-medium"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-[#FFFFFF] border border-[#E6E2D8] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-[#888888] hover:text-[#111111]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-[#FF8F92]/20 text-[#B91C1C] border border-[#FF8F92] text-xs font-bold">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-[#58C875]/20 text-[#15803D] border border-[#58C875] text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#111111] hover:bg-[#262626] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all mt-3"
                >
                  <span>
                    {loading
                      ? 'Authenticating...'
                      : mode === 'login'
                      ? 'Sign In to Dashboard'
                      : mode === 'register'
                      ? 'Complete Registration'
                      : 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {mode === 'forgot' && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setMode('login')}
                    className="text-xs text-[#666666] hover:text-[#111111] font-bold"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: DECORATIVE BENTO PREVIEW PANEL (5 Cols)
             ========================================================================= */}
          <div className="lg:col-span-5 hidden lg:flex flex-col gap-[10px]">
            {/* Mint Balance Card */}
            <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm flex-1 min-h-[160px]">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
                  Net Capital Velocity
                </span>
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-white">₹4,87,500</div>
                <span className="text-xs font-bold text-white/90 block mt-0.5">
                  +12.4% retention this quarter
                </span>
              </div>
            </div>

            {/* Split row of two cards: Blush Safe-to-Spend & Lavender Minimal Spline */}
            <div className="grid grid-cols-2 gap-[10px]">
              {/* Blush Budget Card */}
              <div className="rounded-[20px] bg-[#F8DADD] text-[#111111] p-5 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                  Safe-to-Spend
                </span>
                <div className="my-2">
                  <span className="text-2xl font-black text-[#111111]">75%</span>
                  <span className="text-[10px] text-[#666666] block font-medium">Under Budget Cap</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E6C6C9] overflow-hidden">
                  <div className="h-full rounded-full bg-[#111111]" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Lavender Minimal Spline Wave */}
              <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-5 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold text-purple-950 uppercase tracking-wider block">
                  Forecast Wave
                </span>
                <div className="text-2xl font-black text-[#111111] my-1">4.93%</div>
                <div className="w-full h-8 flex items-end">
                  <svg viewBox="0 0 100 25" className="w-full h-full stroke-[#111111] fill-none stroke-[2.5]">
                    <path d="M0,20 Q25,5 50,15 T100,8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pale Lime Trust Card */}
            <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-black block">Bank-Grade Precision</span>
                <span className="text-[10px] text-[#555555]">RLS Data Isolation • Encrypted Cloud</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                PRO
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#666666] border-t border-[#E6E2D8]/60">
        <span>© {new Date().getFullYear()} Aura Finance Pro. Editorial Bento Design.</span>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Encrypted Cloud Database</span>
          <span>Row-Level Security Isolation</span>
        </div>
      </footer>
    </div>
  );
};
