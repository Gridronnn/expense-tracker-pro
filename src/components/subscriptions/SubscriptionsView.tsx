import React, { useState } from 'react';
import {
  Plus,
  Repeat,
  Trash2,
  X,
  Calendar,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, formatDate } from '../../utils/formatters';

const BENTO_SUB_COLORS = ['#EAF56D', '#D9CEFF', '#5B9E7C', '#F8DADD', '#111111'];

export const SubscriptionsView: React.FC = () => {
  const {
    subscriptions,
    categories,
    addSubscription,
    deleteSubscription,
    toggleSubscriptionStatus,
    currency,
    triggerCelebration,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'weekly' | 'daily'>('monthly');
  const [nextBillingDate, setNextBillingDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  );
  const [categoryName, setCategoryName] = useState(categories[0]?.name || 'Subscriptions');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');

  // Master metrics
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const monthlyBurn = activeSubs.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.amount;
    if (s.billingCycle === 'yearly') return sum + s.amount / 12;
    if (s.billingCycle === 'weekly') return sum + s.amount * 4.33;
    return sum + s.amount * 30;
  }, 0);

  const annualBurn = monthlyBurn * 12;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    const chosenColor = BENTO_SUB_COLORS[subscriptions.length % BENTO_SUB_COLORS.length];

    addSubscription({
      name: name.trim() || 'Service Subscription',
      amount: num,
      billingCycle,
      nextBillingDate,
      category: categoryName,
      paymentMethod,
      icon: 'Repeat',
      color: chosenColor,
      status: 'active',
    });

    setIsAddModalOpen(false);
    setName('');
    setAmount('');
    triggerCelebration();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-7xl mx-auto animate-in fade-in duration-300 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[10px] font-bold uppercase tracking-wider">
              Recurring Outflows
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] text-[10px] font-bold">
              {subscriptions.length} Tracked Plans
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            Recurring Subscriptions & SaaS
          </h1>
          <p className="text-xs text-[#111111]/70 mt-1">
            Automate renewals, audit unnecessary SaaS subscriptions, and forecast annual recurring burn.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="aura-btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Subscription</span>
        </button>
      </div>

      {/* =========================================================================
          BENTO COLLAGE OVERVIEW CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
        {/* Bento 1: Pale Lime Monthly Burn */}
        <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider block">
            Monthly Recurring Burn
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight my-2">
            {formatCurrency(monthlyBurn, currency)}
            <span className="text-xs font-semibold text-[#111111]/70 ml-1.5">/mo</span>
          </div>
          <span className="text-[11px] text-[#111111]/70">From {activeSubs.length} active recurring plans</span>
        </div>

        {/* Bento 2: Soft Lavender Annual Projection */}
        <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-[#111111]/80 uppercase tracking-wider block">
            Projected Annual SaaS Outflow
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight my-2">
            {formatCurrency(annualBurn, currency)}
            <span className="text-xs font-semibold text-[#111111]/70 ml-1.5">/yr</span>
          </div>
          <span className="text-[11px] text-[#111111]/70">Cumulative 12-month burn</span>
        </div>

        {/* Bento 3: Mint Active Count Card */}
        <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm min-h-[160px]">
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
            Active Subscriptions
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-2">
            {activeSubs.length} / {subscriptions.length}
          </div>
          <span className="text-[11px] text-white/80">
            {subscriptions.length - activeSubs.length} currently paused
          </span>
        </div>
      </div>

      {/* =========================================================================
          SUBSCRIPTION CARDS GRID
         ========================================================================= */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-20 rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 shadow-sm">
          <Repeat className="w-12 h-12 text-[#111111]/30 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#111111]">No Active Subscriptions</h3>
          <p className="text-xs text-[#111111]/60 mt-1 max-w-sm mx-auto mb-4">
            Track streaming memberships, gym passes, and SaaS software to eliminate unwanted charges.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="aura-btn-primary"
          >
            + Add First Subscription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
          {subscriptions.map((sub, idx) => {
            const cardAccent = BENTO_SUB_COLORS[idx % BENTO_SUB_COLORS.length];

            return (
              <div
                key={sub.id}
                className="rounded-[20px] bg-[#FCFBF8] border border-[#111111]/10 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#111111] font-bold shadow-xs"
                        style={{ backgroundColor: cardAccent === '#111111' ? '#EAF56D' : cardAccent }}
                      >
                        <CategoryIcon name="cat-subscriptions" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#111111]">{sub.name}</h4>
                        <span className="text-[11px] text-[#111111]/60 capitalize">
                          {sub.billingCycle} billing • {sub.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete subscription "${sub.name}"?`)) {
                          deleteSubscription(sub.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[#111111]/40 hover:text-rose-600 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1 mb-5">
                    <div className="text-2xl font-black text-[#111111] tracking-tight">
                      {formatCurrency(sub.amount, currency)}
                    </div>
                    <div className="text-[11px] text-[#111111]/60 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#111111]/40" />
                      <span>Renews on {formatDate(sub.nextBillingDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#111111]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#111111]/60 font-medium">{sub.paymentMethod}</span>

                  <button
                    onClick={() => toggleSubscriptionStatus(sub.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      sub.status === 'active'
                        ? 'bg-[#111111] text-[#FCFBF8] shadow-xs'
                        : 'bg-[#111111]/10 text-[#111111]/60 hover:text-[#111111]'
                    }`}
                  >
                    {sub.status === 'active' ? 'Active' : 'Paused'}
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
              <h3 className="font-extrabold text-[#111111] text-base">New Recurring Subscription</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#111111]/50 hover:text-[#111111]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#111111]/70 font-bold mb-1">Service / Merchant</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix / Spotify / Claude Pro"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="aura-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#111111]/70 font-bold mb-1">Cost ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.99"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="aura-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#111111]/70 font-bold mb-1">Frequency</label>
                  <select
                    value={billingCycle}
                    onChange={e => setBillingCycle(e.target.value as any)}
                    className="aura-input"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#111111]/70 font-bold mb-1">Category</label>
                <select
                  value={categoryName}
                  onChange={e => setCategoryName(e.target.value)}
                  className="aura-input"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#111111]/70 font-bold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="aura-input"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Apple Pay / Google Pay">Apple Pay / Google Pay</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-[#111111]/70 font-bold mb-1">Next Renewal Date</label>
                <input
                  type="date"
                  value={nextBillingDate}
                  onChange={e => setNextBillingDate(e.target.value)}
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
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
