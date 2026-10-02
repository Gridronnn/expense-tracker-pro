import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  BarChart3,
  Bot,
  Repeat,
  Star,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { BentoGridShowcase } from '../common/BentoGridShowcase';

export const LandingPage: React.FC = () => {
  const { setActiveTab, currency } = useApp();
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [savingsSlider, setSavingsSlider] = useState<number>(3500);

  const handleLaunchApp = () => {
    setActiveTab('dashboard');
  };

  const calculated5YearGrowth = savingsSlider * 12 * 5 * 1.35;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#111111] selection:bg-[#111111] selection:text-[#FCFBF8] overflow-x-hidden font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-20 bg-[#F7F5F0]/80 backdrop-blur-md border-b border-[#111111]/10 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#111111] text-[#FCFBF8] flex items-center justify-center font-black text-xs shadow-sm">
            A
          </div>
          <span className="font-extrabold text-base tracking-tight text-[#111111]">
            AURA <span className="text-[#111111]/50 font-medium">PRO</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#111111]/70">
          <a href="#bento-preview" className="hover:text-[#111111] transition-colors">Bento Architecture</a>
          <a href="#wealth-engine" className="hover:text-[#111111] transition-colors">Capital Velocity</a>
          <a href="#pricing" className="hover:text-[#111111] transition-colors">Pricing Plans</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLaunchApp}
            className="aura-btn-primary flex items-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF56D] border border-[#111111]/10 text-[#111111] text-xs font-bold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
          <span>Editorial Bento-Grid Fintech Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.12]">
          Intelligent Expense Tracking in a{' '}
          <span className="text-[#111111]/60">Pure Bento Grid</span>
        </h1>

        <p className="text-[#111111]/70 text-base sm:text-lg max-w-2xl mx-auto mt-5 leading-relaxed font-normal">
          Tactile pastel cards, 28-day activity matrices, AI receipt scanners, and zero clutter. Crafted for disciplined operators, founders, and modern builders.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={handleLaunchApp}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#111111] hover:bg-[#222222] text-[#FCFBF8] font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xl active:scale-98 transition-all"
          >
            <span>Open Live App</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </section>

      {/* Bento Grid Architecture Showcase (Direct recreation of user design) */}
      <section id="bento-preview" className="py-8 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold text-[#111111]/60 uppercase tracking-wider block">
            Visual Grid Interface
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
            Modular Bento Financial Ecosystem
          </h2>
        </div>

        {/* The Live Bento Grid Showcase */}
        <BentoGridShowcase />
      </section>

      {/* Interactive Compound Calculator Preview */}
      <section id="wealth-engine" className="py-20 px-6 lg:px-12 bg-[#FCFBF8] border-y border-[#111111]/10 my-12">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Simulate 5-Year Capital Velocity
          </h2>
          <p className="text-[#111111]/70 text-xs sm:text-sm mt-2">
            See how automated budgeting, SaaS pruning, and disciplined milestone savings compound over time.
          </p>
        </div>

        <div className="max-w-3xl mx-auto p-8 rounded-[24px] bg-[#F7F5F0] border border-[#111111]/10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[#111111]">
                  Target Monthly Savings Allocation
                </label>
                <span className="text-lg font-black text-[#111111]">
                  {formatCurrency(savingsSlider, currency)}/mo
                </span>
              </div>

              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={savingsSlider}
                onChange={e => setSavingsSlider(Number(e.target.value))}
                className="w-full h-2 bg-[#111111]/20 rounded-lg appearance-none cursor-pointer accent-[#111111]"
              />
            </div>

            <div className="w-full md:w-72 p-6 rounded-[20px] bg-[#111111] text-[#FCFBF8] text-center shadow-md">
              <span className="text-[11px] font-bold text-[#EAF56D] uppercase tracking-wider block">
                Projected 5-Year Capital
              </span>
              <div className="text-3xl font-black text-[#FCFBF8] mt-2">
                {formatCurrency(calculated5YearGrowth, currency)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Transparent, Value-Driven Plans
          </h2>
          <p className="text-[#111111]/70 text-xs sm:text-sm mt-2">
            Start free with full local persistence, upgrade for real-time multi-currency syncing.
          </p>

          <div className="mt-6 inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[#FCFBF8] border border-[#111111]/10 shadow-xs">
            <button
              onClick={() => setPricingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pricingCycle === 'monthly'
                  ? 'bg-[#111111] text-[#FCFBF8]'
                  : 'text-[#111111]/60 hover:text-[#111111]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPricingCycle('yearly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pricingCycle === 'yearly'
                  ? 'bg-[#111111] text-[#FCFBF8]'
                  : 'text-[#111111]/60 hover:text-[#111111]'
              }`}
            >
              Yearly (Save 25%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px] max-w-5xl mx-auto">
          {/* Starter */}
          <div className="rounded-[22px] bg-[#FCFBF8] border border-[#111111]/10 p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold text-[#111111]/60 uppercase tracking-wider">Starter</span>
              <div className="text-3xl font-black text-[#111111] mt-2">$0</div>
              <p className="text-xs text-[#111111]/60 mt-2">Essential personal expense tracking.</p>

              <ul className="mt-6 space-y-3 text-xs text-[#111111]/80 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> Unlimited Transactions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> 3 Category Budgets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> 2 Savings Vaults
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> JSON Snapshot Export
                </li>
              </ul>
            </div>

            <button
              onClick={handleLaunchApp}
              className="mt-8 aura-btn-secondary w-full text-center"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Wealth */}
          <div className="rounded-[22px] bg-[#FCFBF8] border-2 border-[#111111] p-8 shadow-xl relative flex flex-col justify-between">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#111111] text-[#EAF56D] font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
              Most Popular
            </span>
            <div>
              <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">Pro Wealth</span>
              <div className="text-3xl font-black text-[#111111] mt-2">
                {pricingCycle === 'yearly' ? '$12' : '$16'}
                <span className="text-xs font-normal text-[#111111]/60">/month</span>
              </div>
              <p className="text-xs text-[#111111]/60 mt-2">For disciplined investors & high earners.</p>

              <ul className="mt-6 space-y-3 text-xs text-[#111111] font-semibold">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> Everything in Starter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> Aura AI Copilot Heuristics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> Unlimited Vaults & Budgets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> AI Receipt OCR Scanner
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> 28-Day Activity Matrix
                </li>
              </ul>
            </div>

            <button
              onClick={handleLaunchApp}
              className="mt-8 aura-btn-primary w-full text-center"
            >
              Get Started with Pro
            </button>
          </div>

          {/* Enterprise */}
          <div className="rounded-[22px] bg-[#FCFBF8] border border-[#111111]/10 p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold text-[#111111]/60 uppercase tracking-wider">Enterprise Elite</span>
              <div className="text-3xl font-black text-[#111111] mt-2">
                {pricingCycle === 'yearly' ? '$39' : '$49'}
                <span className="text-xs font-normal text-[#111111]/60">/month</span>
              </div>
              <p className="text-xs text-[#111111]/60 mt-2">For family offices, founders & teams.</p>

              <ul className="mt-6 space-y-3 text-xs text-[#111111]/80 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> Everything in Pro Wealth
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> Multi-Entity Portfolio Consolidation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#111111]" /> Dedicated CPA & Tax Export Pack
                </li>
              </ul>
            </div>

            <button
              onClick={handleLaunchApp}
              className="mt-8 aura-btn-secondary w-full text-center"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 px-6 lg:px-12 border-t border-[#111111]/10 bg-[#FCFBF8] text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF56D] border border-[#111111]/10 mx-auto mb-4 flex items-center justify-center text-[#111111] shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-black text-[#111111] mb-2">Ready to Master Your Capital Velocity?</h3>
          <p className="text-[#111111]/70 text-xs max-w-md mx-auto mb-6">
            Join thousands building sustainable wealth with Aura Finance Pro today.
          </p>

          <button
            onClick={handleLaunchApp}
            className="aura-btn-primary"
          >
            Launch Bento Expense Tracker →
          </button>

          <p className="text-[11px] text-[#111111]/50 mt-12">
            © {new Date().getFullYear()} Aura Finance Pro. Editorial Bento-Grid Fintech Architecture.
          </p>
        </div>
      </footer>
    </div>
  );
};
