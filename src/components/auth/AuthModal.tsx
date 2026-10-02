import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Shield, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, triggerCelebration } = useApp();
  const { login, register, resetPassword, loginWithGoogle, loginWithGithub } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(async () => {
      try {
        if (authModalMode === 'login') {
          await login(email, password);
        } else if (authModalMode === 'register') {
          await register(name || 'Account Holder', email, password);
        } else if (authModalMode === 'forgot') {
          await resetPassword(email);
          setSuccessMsg('Reset instructions sent to your email address!');
          setLoading(false);
          return;
        }
        setLoading(false);
        triggerCelebration();
        setIsAuthModalOpen(false);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Authentication failed. Please check your credentials.');
        setLoading(false);
      }
    }, 400);
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setTimeout(async () => {
      try {
        if (provider === 'google') await loginWithGoogle();
        else await loginWithGithub();
        setLoading(false);
        triggerCelebration();
        setIsAuthModalOpen(false);
      } catch (err: any) {
        setErrorMsg(err?.message || `${provider === 'google' ? 'Google' : 'GitHub'} sign-in is not configured.`);
        setLoading(false);
      }
    }, 400);
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-[#0E1524] dark:bg-[#0E1524] light:bg-white rounded-3xl border border-slate-800 light:border-slate-200 shadow-2xl overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-[1.5px] mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-[#0E1524] rounded-[14px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white light:text-slate-900">
              {authModalMode === 'login' && 'Welcome Back to Aura'}
              {authModalMode === 'register' && 'Create Your Wealth Vault'}
              {authModalMode === 'forgot' && 'Reset Security Credentials'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Bank-grade 256-bit encrypted financial management
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="py-2.5 px-3 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-semibold text-slate-300 light:text-slate-700 hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
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
              className="py-2.5 px-3 rounded-xl bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-300 text-xs font-semibold text-slate-300 light:text-slate-700 hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
            >
              <svg className="w-4 h-4 fill-current text-white light:text-slate-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800 light:border-slate-200" />
            </div>
            <span className="relative px-3 bg-[#0E1524] light:bg-white text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
              or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexandre Sterling"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-900/90 light:bg-slate-50 border border-slate-800 light:border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 light:bg-slate-50 border border-slate-800 light:border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-400">Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('forgot')}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-900/90 light:bg-slate-50 border border-slate-800 light:border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : authModalMode === 'login' ? 'Sign In to Dashboard' : authModalMode === 'register' ? 'Create Free Account' : 'Send Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between login / register */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthModalMode('register')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthModalMode('login')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
