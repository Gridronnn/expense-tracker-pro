import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  PieChart as PieIcon,
  BarChart2,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

const BENTO_ANALYTICS_PALETTE = ['#111111', '#5B9E7C', '#D9CEFF', '#EAF56D', '#F8DADD', '#8D7AFF'];

export const AnalyticsView: React.FC = () => {
  const { transactions, currency } = useApp();
  const [timeframe, setTimeframe] = useState<'30D' | '90D' | '1Y'>('30D');

  const activeTransactions = transactions.filter(t => !t.isArchived);

  // Totals
  const totalIncome = activeTransactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = activeTransactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const avgTxSize = activeTransactions.length > 0 ? (totalExpense / Math.max(1, activeTransactions.filter(t => t.type === 'expense').length)) : 0;

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  activeTransactions.filter(t => t.type === 'expense').forEach(t => {
    categoryMap[t.categoryName] = (categoryMap[t.categoryName] || 0) + t.amount;
  });

  const categoryData = Object.entries(categoryMap).map(([name, val], idx) => ({
    name,
    amount: val,
    color: BENTO_ANALYTICS_PALETTE[idx % BENTO_ANALYTICS_PALETTE.length],
  }));

  // Payment methods breakdown
  const methodMap: Record<string, number> = {};
  activeTransactions.filter(t => t.type === 'expense').forEach(t => {
    methodMap[t.paymentMethod] = (methodMap[t.paymentMethod] || 0) + t.amount;
  });

  const methodData = Object.entries(methodMap).map(([name, val], idx) => ({
    name,
    amount: val,
    color: BENTO_ANALYTICS_PALETTE[idx % BENTO_ANALYTICS_PALETTE.length],
  }));

  // 28-day activity matrix (grid of days)
  const heatmapDays = Array.from({ length: 28 }).map((_, i) => {
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - (27 - i));
    const dateStr = dayDate.toISOString().split('T')[0];
    const daySpend = activeTransactions
      .filter(t => t.type === 'expense' && t.date.startsWith(dateStr))
      .reduce((s, t) => s + t.amount, 0);

    return {
      day: i + 1,
      date: dateStr,
      spend: daySpend,
    };
  });

  const maxHeatmapSpend = Math.max(1, ...heatmapDays.map(d => d.spend));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] text-[10px] font-bold uppercase tracking-wider">
              Deep Telemetry
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold">
              Heuristic Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Wealth & Expense Analytics
          </h1>
          <p className="text-xs text-[#111111]/70 mt-1">
            28-day spending density heatmaps, payment channel concentration, and capital velocity.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FCFBF8] p-1 rounded-2xl border border-[#111111]/10 shadow-xs self-start sm:self-auto">
          {(['30D', '90D', '1Y'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeframe === tf
                  ? 'bg-[#111111] text-[#FCFBF8] shadow-xs'
                  : 'text-[#111111]/60 hover:text-[#111111]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          TOP BENTO METRICS COLLAGE
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {/* Bento 1: Mint Inflows */}
        <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
            Aggregated Inflows
          </span>
          <div className="text-3xl font-black text-white tracking-tight my-2">
            {formatCurrency(totalIncome, currency)}
          </div>
          <span className="text-[11px] text-white/80">Gross capital injected</span>
        </div>

        {/* Bento 2: Pale Lime Outflows */}
        <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider block">
            Total Burn Outflows
          </span>
          <div className="text-3xl font-black text-[#111111] tracking-tight my-2">
            {formatCurrency(totalExpense, currency)}
          </div>
          <span className="text-[11px] text-[#111111]/70">Gross operational expenditures</span>
        </div>

        {/* Bento 3: Lavender Net Savings */}
        <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider block">
            Net Savings Rate
          </span>
          <div className="text-3xl font-black text-[#111111] tracking-tight my-2">
            {savingsRate.toFixed(1)}%
          </div>
          <span className="text-[11px] text-[#111111]/80 font-medium">{formatCurrency(netSavings, currency)} retained</span>
        </div>

        {/* Bento 4: Soft White Average Ticket */}
        <div className="rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-[#111111]/70 uppercase tracking-wider block">
            Average Ticket Size
          </span>
          <div className="text-3xl font-black text-[#111111] tracking-tight my-2">
            {formatCurrency(avgTxSize, currency)}
          </div>
          <span className="text-[11px] text-[#111111]/60">Per purchase transaction</span>
        </div>
      </div>

      {/* =========================================================================
          28-DAY SPENDING HEATMAP & CATEGORY BREAKDOWN
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[10px]">
        {/* 28-Day Heatmap (Span 2) */}
        <div className="lg:col-span-2 rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 sm:p-7 flex flex-col justify-between shadow-sm min-h-[320px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#111111]">28-Day Activity Heatmap</h4>
                <p className="text-[11px] text-[#111111]/60">Daily spending concentration matrix</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#111111]/5 text-[#111111] font-semibold border border-[#111111]/10">
                Peak: {formatCurrency(maxHeatmapSpend, currency)}
              </span>
            </div>

            {/* 28 Day Grid */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {heatmapDays.map((d, i) => {
                const intensity = d.spend / maxHeatmapSpend;
                let bgStyle = 'bg-[#111111]/5 border border-[#111111]/10 text-[#111111]/50';
                if (d.spend > 0) {
                  if (intensity > 0.7) {
                    bgStyle = 'bg-[#111111] text-[#FCFBF8] font-bold shadow-xs';
                  } else if (intensity > 0.4) {
                    bgStyle = 'bg-[#5B9E7C] text-white font-bold';
                  } else {
                    bgStyle = 'bg-[#D9CEFF] text-[#111111] font-semibold';
                  }
                }

                return (
                  <div
                    key={i}
                    title={`${d.date}: ${formatCurrency(d.spend, currency)}`}
                    className={`h-12 rounded-xl flex flex-col items-center justify-center text-xs transition-all hover:scale-105 cursor-pointer ${bgStyle}`}
                  >
                    <span>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#111111]/10 text-[11px] text-[#111111]/60 mt-4">
            <span>Low Spend</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded bg-[#111111]/5 border border-[#111111]/10" />
              <div className="w-3.5 h-3.5 rounded bg-[#D9CEFF]" />
              <div className="w-3.5 h-3.5 rounded bg-[#5B9E7C]" />
              <div className="w-3.5 h-3.5 rounded bg-[#111111]" />
            </div>
            <span>High Concentration</span>
          </div>
        </div>

        {/* Payment Channels Card (Span 1) */}
        <div className="rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 sm:p-7 flex flex-col justify-between shadow-sm min-h-[320px]">
          <div>
            <h4 className="text-sm font-bold text-[#111111]">Payment Channels</h4>
            <p className="text-[11px] text-[#111111]/60 mb-4">Channel volume concentration</p>

            {methodData.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-xs text-[#111111]/50">
                No payment data available
              </div>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={methodData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#111111" fontSize={11} width={80} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111111', borderColor: '#111111', color: '#FCFBF8', borderRadius: '12px' }}
                      formatter={((val: any) => [formatCurrency(Number(val) || 0, currency), 'Volume']) as any}
                    />
                    <Bar dataKey="amount" fill="#111111" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#111111]/10 text-[11px] text-[#111111]/60 text-center">
            Detected payment instruments
          </div>
        </div>
      </div>
    </div>
  );
};
