import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  X,
  Target,
  Calendar,
  Coins,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const BENTO_GOAL_COLORS = ['#5B9E7C', '#D9CEFF', '#EAF56D', '#F8DADD', '#111111'];

export const GoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    deleteGoal,
    depositToGoal,
    currency,
    triggerCelebration,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('General Savings Vault');

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const tNum = parseFloat(targetAmount);
    const cNum = parseFloat(currentAmount) || 0;
    if (isNaN(tNum) || tNum <= 0) return;

    const chosenColor = BENTO_GOAL_COLORS[goals.length % BENTO_GOAL_COLORS.length];

    addGoal({
      title: title.trim() || 'New Savings Vault',
      targetAmount: tNum,
      currentAmount: cNum,
      deadline,
      notes,
      color: chosenColor,
      icon: 'Target',
    });

    setIsAddModalOpen(false);
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('0');
    triggerCelebration();
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId) return;
    const num = parseFloat(depositAmount);
    if (isNaN(num) || num <= 0) return;

    depositToGoal(depositGoalId, num);
    setDepositGoalId(null);
    setDepositAmount('');
    triggerCelebration();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold uppercase tracking-wider">
              Capital Reserve
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] text-[10px] font-bold">
              {goals.length} Dedicated Vaults
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Savings Vaults & Milestones
          </h1>
          <p className="text-xs text-[#111111]/70 mt-1">
            Lock liquidity into isolated vaults for real estate, emergency runway, and strategic milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="aura-btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Vault</span>
        </button>
      </div>

      {/* =========================================================================
          BENTO COLLAGE OVERVIEW CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
        {/* Bento 1: Mint Green Total Vaulted */}
        <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
              Total Vaulted Capital
            </span>
            <ShieldCheck className="w-4 h-4 text-white/80" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
            {formatCurrency(totalSaved, currency)}
          </div>
          <span className="text-[11px] text-white/80">Accumulated across all milestones</span>
        </div>

        {/* Bento 2: Pale Lime Target Milestone Volume */}
        <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider block">
            Aggregated Target Goal
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight my-2">
            {formatCurrency(totalTarget, currency)}
          </div>
          <span className="text-[11px] text-[#111111]/70">Required portfolio allocation</span>
        </div>

        {/* Bento 3: Lavender Completion Progress */}
        <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider">
              Overall Completion
            </span>
            <span className="text-xs font-black text-[#111111]">{overallProgress.toFixed(0)}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/60 overflow-hidden my-3 p-0.5">
            <div
              className="h-full rounded-full bg-[#111111] transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>

          <span className="text-[11px] text-[#111111]/80 font-medium">
            {formatCurrency(Math.max(0, totalTarget - totalSaved), currency)} left to complete all targets
          </span>
        </div>
      </div>

      {/* =========================================================================
          VAULT CARDS GRID
         ========================================================================= */}
      {goals.length === 0 ? (
        <div className="text-center py-20 rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 shadow-sm">
          <Target className="w-12 h-12 text-[#111111]/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#111111]">No Savings Vaults Active</h3>
          <p className="text-xs text-[#111111]/60 mt-1 max-w-sm mx-auto mb-4">
            Build your financial freedom step-by-step by creating milestone vaults.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="aura-btn-primary"
          >
            + Create First Vault
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
          {goals.map((g, idx) => {
            const pct = Math.min(100, Math.round((g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0)));
            const cardAccent = BENTO_GOAL_COLORS[idx % BENTO_GOAL_COLORS.length];

            return (
              <div
                key={g.id}
                className="rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#111111] font-bold shadow-xs"
                        style={{ backgroundColor: cardAccent === '#111111' ? '#EAF56D' : cardAccent }}
                      >
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#111111]">{g.title}</h4>
                        <span className="text-[11px] text-[#111111]/60">{g.notes || 'Savings Goal'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete vault "${g.title}"?`)) {
                          deleteGoal(g.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#111111]/40 hover:text-rose-600 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-black text-[#111111] tracking-tight">
                        {formatCurrency(g.currentAmount, currency)}
                      </span>
                      <span className="text-xs text-[#111111]/60 font-semibold font-mono">
                        / {formatCurrency(g.targetAmount, currency)}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#111111]/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-[#111111]"
                        style={{
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#111111]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#111111]/60 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(g.deadline)}</span>
                  </span>

                  <button
                    onClick={() => setDepositGoalId(g.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-[#FCFBF8] font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5 text-[#EAF56D]" />
                    <span>Deposit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-[#FCFBF8] rounded-[22px] border border-[#111111]/20 p-6 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#111111]/10 pb-3">
              <h3 className="font-extrabold text-[#111111] text-base">New Savings Vault</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#111111]/50 hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#111111]/70 font-bold mb-1">Vault Purpose / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emergency Reserve / Real Estate"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="aura-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#111111]/70 font-bold mb-1">Target ({currency})</label>
                  <input
                    type="number"
                    step="1"
                    required
                    placeholder="10000"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    className="aura-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#111111]/70 font-bold mb-1">Initial Deposit ({currency})</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="0"
                    value={currentAmount}
                    onChange={e => setCurrentAmount(e.target.value)}
                    className="aura-input font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#111111]/70 font-bold mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="aura-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#111111]/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="aura-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="aura-btn-primary"
                >
                  Create Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Deposit Modal */}
      {depositGoalId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setDepositGoalId(null)} className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#FCFBF8] rounded-[22px] border border-[#111111]/20 p-6 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#111111]/10 pb-3">
              <h3 className="font-extrabold text-[#111111] text-sm">Deposit into Vault</h3>
              <button onClick={() => setDepositGoalId(null)} className="text-[#111111]/50 hover:text-[#111111]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#111111]/70 font-bold mb-1">Contribution Amount ({currency})</label>
                <input
                  type="number"
                  step="1"
                  autoFocus
                  required
                  placeholder="500"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  className="aura-input font-black text-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#111111]/10">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="aura-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="aura-btn-primary"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
