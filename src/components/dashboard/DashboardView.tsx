import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  Sparkles,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Heart,
  Clock,
  Plus,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, calculateFinancialHealthScore, formatDate } from '../../utils/formatters';

const BENTO_CATEGORY_COLORS = ['#5B9E7C', '#D9CEFF', '#EAF56D', '#F8DADD', '#111111', '#58C875'];

export const DashboardView: React.FC = () => {
  const {
    transactions,
    budgets,
    goals,
    subscriptions,
    currency,
    setIsQuickActionOpen,
    setQuickActionType,
    setActiveTab,
    setIsChatDrawerOpen,
    insights,
  } = useApp();

  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('This month');
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [selectedPillIndex, setSelectedPillIndex] = useState<number>(4); // Friday default
  const timeframeRef = useRef<HTMLDivElement>(null);

  // Close timeframe dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timeframeRef.current && !timeframeRef.current.contains(event.target as Node)) {
        setIsTimeframeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Financial Calculations
  const activeTransactions = transactions.filter(t => !t.isArchived);

  const totalIncome = activeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = activeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const totalGoalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const netWorth = currentBalance + totalGoalSavings;

  const monthlySavings = Math.max(0, totalIncome - totalExpense);
  const savingsRate = totalIncome > 0 ? (monthlySavings / totalIncome) * 100 : 0;

  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  const budgetUtilization = totalBudgetLimit > 0 ? (totalExpense / totalBudgetLimit) * 100 : 0;

  const healthBreakdown = calculateFinancialHealthScore(
    totalIncome,
    totalExpense,
    totalGoalSavings,
    totalBudgetLimit
  );

  // Trend data for Dominant Net Worth Spline Chart
  const trendData = [
    { date: 'Jan', val: Math.round(netWorth * 0.52) || 45000 },
    { date: 'Feb', val: Math.round(netWorth * 0.64) || 58000 },
    { date: 'Mar', val: Math.round(netWorth * 0.73) || 72000 },
    { date: 'Apr', val: Math.round(netWorth * 0.84) || 86000 },
    { date: 'May', val: Math.round(netWorth * 0.92) || 97000 },
    { date: 'Jun', val: netWorth || 115000 },
  ];

  // 7-day pill bars
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const pillData = dayLabels.map((day, idx) => {
    const baseHeight = [35, 50, 45, 60, 90, 55, 40][idx];
    return {
      day,
      height: `${baseHeight}%`,
      amount: (totalExpense / 7) * (baseHeight / 55),
    };
  });

  const recentTransactions = activeTransactions.slice(0, 5);

  // Single focused Money Insight
  const focusedInsight = insights[0]?.description || 'Dining & entertainment is 14% higher than your 30-day baseline.';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto bg-[#F7F5F0] text-[#111111] font-sans">
      {/* Top Header with Compact Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                Executive Wealth Ledger
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold">
                Realtime
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Welcome, {user?.name?.split(' ')[0] || 'User'}
            </h1>
          </div>

          {/* Compact "This month" Date-Range Selector */}
          <div className="relative mt-1 sm:mt-4" ref={timeframeRef}>
            <button
              onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FCFBF8] hover:bg-[#F0EDE4] border border-[#E6E2D8] text-xs font-bold text-[#111111] transition-all shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#666666]" />
              <span>{selectedTimeframe}</span>
              <ChevronDown className="w-3 h-3 text-[#666666]" />
            </button>

            {isTimeframeOpen && (
              <div className="absolute left-0 mt-1.5 w-44 rounded-2xl bg-[#FCFBF8] border border-[#E6E2D8] shadow-xl p-1 z-40 animate-in fade-in zoom-in-95">
                {['This month', 'Last 30 days', 'This quarter', 'This year'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => {
                      setSelectedTimeframe(tf);
                      setIsTimeframeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      selectedTimeframe === tf
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-[#111111] hover:bg-[#F0EDE4]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            setQuickActionType('expense');
            setIsQuickActionOpen(true);
          }}
          className="aura-btn-primary flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Transaction</span>
        </button>
      </div>

      {/* =========================================================================
          BENTO GRID: DOMINANT NET WORTH ANCHOR & FOCUSED SUPPORTING MODULES
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[10px]">
        
        {/* =========================================================================
            PRIMARY VISUAL ANCHOR: DOMINANT NET WORTH & VELOCITY CARD (8 Cols)
           ========================================================================= */}
        <div className="md:col-span-8 rounded-[22px] bg-[#FCFBF8] border border-[#E6E2D8] p-7 flex flex-col justify-between shadow-sm min-h-[380px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                    Total Net Capital & Velocity
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#58C875]/15 text-[#2E7D32] text-[11px] font-extrabold">
                    +8.4% vs last mo
                  </span>
                </div>
                <div className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight mt-1.5">
                  {formatCurrency(netWorth, currency)}
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0EDE4] text-[#111111] text-xs font-bold font-mono self-start">
                <Clock className="w-3.5 h-3.5 text-[#111111]" />
                <span>6-Month Trajectory</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#666666] mt-2 pb-2">
              <span>
                Liquid Balance: <strong className="text-[#111111]">{formatCurrency(currentBalance, currency)}</strong>
              </span>
              <span>•</span>
              <span>
                Vaulted Reserves: <strong className="text-[#111111]">{formatCurrency(totalGoalSavings, currency)}</strong>
              </span>
            </div>
          </div>

          {/* Prominent Large Spline Area Chart */}
          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="netWorthDominantSpline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#111111" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#111111',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#FCFBF8',
                  }}
                  formatter={((val: any) => [formatCurrency(Number(val) || 0, currency), 'Net Capital']) as any}
                />
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="#111111"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#netWorthDominantSpline)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-[11px] font-bold text-[#888888] pt-3 border-t border-[#E6E2D8]">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* =========================================================================
            SUPPORTING COLUMN (4 Cols): METRICS & FOCUSED MONEY INSIGHT
           ========================================================================= */}
        <div className="md:col-span-4 flex flex-col gap-[10px]">
          
          {/* Mint Card: Total Inflow */}
          <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm min-h-[120px] flex-1">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">
                Total Inflow
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                +12.5% vs last mo
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1">
              {formatCurrency(totalIncome, currency)}
            </div>
            <span className="text-[11px] text-white/80">+{savingsRate.toFixed(0)}% retention velocity</span>
          </div>

          {/* Pale Lime Card: Monthly Outflows */}
          <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[120px] flex-1">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider">
                Monthly Outflow
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#111111]/10 text-[#111111] text-[10px] font-bold">
                -4.2% vs last mo
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight my-1">
              {formatCurrency(totalExpense, currency)}
            </div>
            <span className="text-[11px] text-[#555555]">
              {activeTransactions.filter(t => t.type === 'expense').length} purchases recorded
            </span>
          </div>

          {/* REDESIGNED FOCUSED MONEY INSIGHT CARD */}
          <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-5 flex flex-col justify-between shadow-sm min-h-[120px] flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                <span className="text-[10px] font-extrabold text-[#111111] uppercase tracking-wider">
                  Money Insight
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/50 text-[#111111]">
                Active
              </span>
            </div>

            <p className="text-xs font-bold text-[#111111] leading-snug my-1.5">
              {focusedInsight}
            </p>

            <button
              onClick={() => setIsChatDrawerOpen(true)}
              className="text-xs font-extrabold text-[#111111] flex items-center gap-1 hover:underline self-start pt-1"
            >
              <span>View details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            ROW 2: RECENT TRANSACTIONS (7 Cols) & WEEKLY RADAR + GOALS (5 Cols)
           ========================================================================= */}

        {/* Recent Transactions with Small Refined Category Icons (7 Cols) */}
        <div className="md:col-span-7 rounded-[22px] bg-[#FCFBF8] border border-[#E6E2D8] p-6 sm:p-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-black text-[#111111]">Recent Activity</h4>
                <p className="text-[11px] text-[#666666]">Live financial transaction stream</p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-bold text-[#111111] hover:underline"
              >
                View All ({transactions.length}) →
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-[#F7F5F0] border border-[#E6E2D8] p-6">
                <Wallet className="w-8 h-8 text-[#888888] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#111111]">No transactions recorded yet</p>
                <p className="text-[11px] text-[#666666] mt-0.5 mb-3">Add your first income or expense to see live activity.</p>
                <button
                  onClick={() => {
                    setQuickActionType('expense');
                    setIsQuickActionOpen(true);
                  }}
                  className="aura-btn-primary py-1.5 px-3 text-xs inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Transaction</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map(tx => (
                  <div
                    key={tx.id}
                    onClick={() => setActiveTab('transactions')}
                    className="p-3 rounded-xl bg-[#F7F5F0] hover:bg-[#F0EDE4] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E6E2D8] flex items-center justify-center text-[#111111] shrink-0">
                        <CategoryIcon name={tx.categoryId} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#111111] block truncate">{tx.description}</span>
                        <span className="text-[10px] text-[#666666]">{tx.categoryName} • {formatDate(tx.date)}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black ${tx.type === 'income' ? 'text-[#58C875]' : 'text-[#111111]'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                      </span>
                      <span className="text-[9px] text-[#888888] block">{tx.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Radar & Savings Vaults Stack (5 Cols) */}
        <div className="md:col-span-5 flex flex-col gap-[10px]">
          
          {/* Weekly Outflow Radar */}
          <div className="rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] p-6 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#666666] uppercase tracking-wider block">
                  Weekly Outflow Radar
                </span>
                <div className="text-2xl font-black text-[#111111] mt-0.5">
                  {formatCurrency(totalExpense, currency)}
                </div>
              </div>
              <span className="text-xs font-mono text-[#666666]">
                {dayLabels[selectedPillIndex]}: {formatCurrency(pillData[selectedPillIndex].amount, currency)}
              </span>
            </div>

            {/* 7 Pill Bars */}
            <div className="mt-3 flex items-end justify-between gap-1.5 h-24 pt-1">
              {pillData.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPillIndex(idx)}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-full bg-[#F0EDE4] rounded-full h-full flex items-end p-0.5 overflow-hidden">
                    <div
                      className={`w-full rounded-full transition-all duration-200 ${
                        idx === selectedPillIndex
                          ? 'bg-[#111111]'
                          : 'bg-[#D5D0C5] hover:bg-[#111111]'
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-bold ${
                      idx === selectedPillIndex ? 'text-[#111111]' : 'text-[#888888]'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Vaults Snapshot */}
          <div className="rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] p-6 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black text-[#111111] uppercase tracking-wider">
                  Savings Vaults
                </h4>
                <button
                  onClick={() => setActiveTab('goals')}
                  className="text-xs font-bold text-[#111111] hover:underline"
                >
                  Manage →
                </button>
              </div>

              {goals.length === 0 ? (
                <div className="text-center py-4 text-[#888888]">
                  <p className="text-xs font-semibold">No active vaults</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {goals.slice(0, 2).map(g => {
                    const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                    return (
                      <div key={g.id} className="p-3 rounded-xl bg-[#F7F5F0]">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-[#111111]">{g.title}</span>
                          <span className="font-mono">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E6E2D8] overflow-hidden">
                          <div className="h-full rounded-full bg-[#111111]" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#666666] mt-1">
                          <span>{formatCurrency(g.currentAmount, currency)}</span>
                          <span>Target: {formatCurrency(g.targetAmount, currency)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
