import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  X,
  Layers,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Budget } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency } from '../../utils/formatters';

const BENTO_ACCENTS = ['#D9CEFF', '#F8DADD', '#EAF56D', '#5B9E7C', '#FF8F92'];

export const BudgetsView: React.FC = () => {
  const {
    budgets,
    categories,
    transactions,
    addBudget,
    deleteBudget,
    currency,
    triggerCelebration,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [warningThreshold, setWarningThreshold] = useState(80);

  // Calculate actual spending per budget
  const budgetData = budgets.map(b => {
    const spent = transactions
      .filter(t => t.categoryId === b.categoryId && t.type === 'expense' && !t.isArchived)
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
    const remaining = Math.max(0, b.monthlyLimit - spent);
    return {
      ...b,
      spentAmount: spent,
      percentage,
      remaining,
    };
  });

  const totalLimit = budgetData.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalSpent = budgetData.reduce((acc, b) => acc + b.spentAmount, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallUtilization = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(monthlyLimit);
    if (isNaN(num) || num <= 0) return;

    const cat = categories.find(c => c.id === selectedCategory);
    const chosenColor = BENTO_ACCENTS[budgets.length % BENTO_ACCENTS.length];

    addBudget({
      categoryId: selectedCategory,
      categoryName: cat?.name || 'Category',
      monthlyLimit: num,
      period,
      warningThreshold,
      color: chosenColor,
    });

    setIsAddModalOpen(false);
    setMonthlyLimit('');
    triggerCelebration();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto bg-[#F7F5F0] text-[#111111] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              Category Guardrails
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold">
              {budgets.length} Active Caps
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Spending Budgets & Ceilings
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#262626] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Budget Cap</span>
        </button>
      </div>

      {/* =========================================================================
          TOP BENTO OVERVIEW CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[10px]">
        {/* Pale Lime Total Limit */}
        <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider block">
            Total Monthly Cap
          </span>
          <div className="text-3xl font-black text-[#111111]">
            {formatCurrency(totalLimit, currency)}
          </div>
          <span className="text-xs text-[#666666]">Across {budgets.length} spending categories</span>
        </div>

        {/* Blush Total Spent */}
        <div className="rounded-[20px] bg-[#F8DADD] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">
            Current Spend
          </span>
          <div className="text-3xl font-black text-[#111111]">
            {formatCurrency(totalSpent, currency)}
          </div>
          <span className="text-xs text-[#666666]">{overallUtilization.toFixed(0)}% of ceiling utilized</span>
        </div>

        {/* Mint Remaining Buffer */}
        <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
            Safe-to-Spend Buffer
          </span>
          <div className="text-3xl font-black text-white">
            {formatCurrency(totalRemaining, currency)}
          </div>
          <span className="text-xs text-white/80">Available unspent headroom</span>
        </div>

        {/* Lavender Utilization Progress */}
        <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider">
              Cap Status
            </span>
            <span className="text-xs font-black text-[#111111]">{overallUtilization.toFixed(0)}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden my-auto">
            <div
              className="h-full rounded-full bg-[#111111] transition-all duration-500"
              style={{ width: `${Math.min(100, overallUtilization)}%` }}
            />
          </div>

          <span className="text-xs font-semibold text-purple-950">
            {overallUtilization > 90 ? '⚠️ Approaching limits' : '✓ Spending within safe targets'}
          </span>
        </div>
      </div>

      {/* =========================================================================
          BUDGET GUARDRAIL CARDS
         ========================================================================= */}
      {budgetData.length === 0 ? (
        <div className="text-center py-16 rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] shadow-sm">
          <Layers className="w-10 h-10 text-[#CCCCCC] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#111111]">No Budget Guardrails Configured</h3>
          <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto mb-4">
            Set spending ceilings for food, travel, groceries, and shopping to automate financial discipline.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#262626] text-white font-bold text-xs"
          >
            + Create First Budget Cap
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
          {budgetData.map((b, idx) => {
            const isExceeded = b.percentage > 100;

            return (
              <div
                key={b.id}
                className="rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] p-6 flex flex-col justify-between shadow-sm relative group hover:border-[#111111] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F0EDE4] flex items-center justify-center text-[#111111]">
                        <CategoryIcon name={b.categoryId} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111111]">{b.categoryName}</h4>
                        <span className="text-[10px] text-[#666666] capitalize">{b.period} Target</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete budget for "${b.categoryName}"?`)) {
                          deleteBudget(b.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#888888] hover:text-rose-600 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-black text-[#111111]">
                        {formatCurrency(b.spentAmount, currency)}
                      </span>
                      <span className="text-xs text-[#666666] font-mono">
                        / {formatCurrency(b.monthlyLimit, currency)}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#F0EDE4] overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isExceeded ? 'bg-[#FF8F92]' : 'bg-[#111111]'
                        }`}
                        style={{ width: `${Math.min(100, b.percentage)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between text-xs">
                  <span className="text-[#666666]">
                    Remaining: <strong className="text-[#111111]">{formatCurrency(b.remaining, currency)}</strong>
                  </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-lg text-[10px] ${
                      isExceeded
                        ? 'bg-[#FF8F92]/20 text-[#B91C1C]'
                        : 'bg-[#F0EDE4] text-[#111111]'
                    }`}
                  >
                    {b.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#FCFBF8] rounded-[20px] border border-[#E6E2D8] p-6 z-10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
              <h3 className="font-bold text-[#111111] text-base">New Spending Guardrail</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#666666] hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#111111] font-bold mb-1">Target Category</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#111111]"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#111111] font-bold mb-1">Spending Limit ({currency})</label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 5000"
                  value={monthlyLimit}
                  onChange={e => setMonthlyLimit(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#111111] font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#666666] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#111111] hover:bg-[#262626] text-white font-bold"
                >
                  Save Guardrail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
