import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const CalendarView: React.FC = () => {
  const { transactions, currency } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayTransactions, setSelectedDayTransactions] = useState<{
    date: string;
    transactions: Transaction[];
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Month stats
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === year && d.getMonth() === month && !t.isArchived;
  });

  const monthInflow = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const monthOutflow = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-6xl mx-auto animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold uppercase tracking-wider">
              Time Map
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] text-[10px] font-bold">
              {monthNames[month]} {year}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Financial Ledger Calendar
          </h1>
          <p className="text-xs text-[#111111]/70 mt-1">
            Map out daily cash inflows, payment dates, and auto-debits across the month.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={prevMonth}
            className="p-2.5 rounded-2xl bg-[#FCFBF8] hover:bg-[#F2EFE9] text-[#111111] border border-[#111111]/10 shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 rounded-2xl bg-[#FCFBF8] border border-[#111111]/10 text-xs font-bold text-[#111111] shadow-xs">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2.5 rounded-2xl bg-[#FCFBF8] hover:bg-[#F2EFE9] text-[#111111] border border-[#111111]/10 shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bento Month Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
        <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm min-h-[140px]">
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
            Month Inflow
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1">
            +{formatCurrency(monthInflow, currency)}
          </div>
          <span className="text-[11px] text-white/80">Total received</span>
        </div>

        <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[140px]">
          <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider block">
            Month Outflow
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight my-1">
            -{formatCurrency(monthOutflow, currency)}
          </div>
          <span className="text-[11px] text-[#111111]/70">Total expenditures</span>
        </div>

        <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[140px]">
          <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider block">
            Net Month Delta
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight my-1">
            {formatCurrency(monthInflow - monthOutflow, currency)}
          </div>
          <span className="text-[11px] text-[#111111]/70">Retained capital</span>
        </div>
      </div>

      {/* Calendar Bento Grid */}
      <div className="rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#111111]/60 mb-3 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[85px] rounded-2xl bg-[#111111]/[0.02]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayTxs = transactions.filter(t => t.date.startsWith(dateStr) && !t.isArchived);
            const dayIn = dayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const dayOut = dayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

            const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();

            return (
              <div
                key={`day-${dayNum}`}
                onClick={() => {
                  if (dayTxs.length > 0) {
                    setSelectedDayTransactions({ date: dateStr, transactions: dayTxs });
                  }
                }}
                className={`min-h-[85px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                  isToday
                    ? 'bg-[#EAF56D]/40 border-[#111111] shadow-xs'
                    : 'bg-[#F7F5F0]/80 border-[#111111]/5 hover:border-[#111111]/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${isToday ? 'text-[#111111] font-black' : 'text-[#111111]'}`}>
                    {dayNum}
                  </span>
                  {dayTxs.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                  )}
                </div>

                <div className="space-y-0.5 text-[10px] font-mono text-right font-semibold">
                  {dayIn > 0 && <div className="text-[#58C875]">+{formatCurrency(dayIn, currency, false)}</div>}
                  {dayOut > 0 && <div className="text-[#111111]">-{formatCurrency(dayOut, currency, false)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Modal */}
      {selectedDayTransactions && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSelectedDayTransactions(null)} className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#FCFBF8] rounded-[22px] border border-[#111111]/20 p-6 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#111111]/10 pb-3">
              <div>
                <h3 className="font-extrabold text-[#111111] text-base">Ledger for {formatDate(selectedDayTransactions.date)}</h3>
                <span className="text-[11px] text-[#111111]/60">{selectedDayTransactions.transactions.length} entries recorded</span>
              </div>
              <button onClick={() => setSelectedDayTransactions(null)} className="text-[#111111]/50 hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedDayTransactions.transactions.map(tx => (
                <div key={tx.id} className="p-3 rounded-2xl bg-[#F7F5F0] border border-[#111111]/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#111111] block">{tx.description}</span>
                    <span className="text-[10px] text-[#111111]/60">{tx.categoryName} • {tx.paymentMethod}</span>
                  </div>
                  <span className={`font-black ${tx.type === 'income' ? 'text-[#58C875]' : 'text-[#111111]'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
