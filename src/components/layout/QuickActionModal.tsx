import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingDown,
  TrendingUp,
  Camera,
  Target,
  Sparkles,
  Check,
  Tag,
  MapPin,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, TransactionType } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency } from '../../utils/formatters';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    quickActionType,
    categories,
    goals,
    addTransaction,
    depositToGoal,
    currency,
    triggerCelebration,
  } = useApp();

  // Form State
  const [type, setType] = useState<TransactionType>(quickActionType === 'income' ? 'income' : 'expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');
  const [notes, setNotes] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || '');
  const [isScanningReceipt, setIsScanningReceipt] = useState<boolean>(false);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // Filter categories by type
  const availableCategories = categories.filter(c => c.type === (type === 'income' ? 'income' : 'expense'));

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSimulateScanReceipt = () => {
    setIsScanningReceipt(true);
    setTimeout(() => {
      setIsScanningReceipt(false);
      setAmount('184.50');
      setDescription('Store Purchase Receipt');
      const shopCat = categories.find(c => c.name.includes('Shopping'));
      if (shopCat) setCategoryId(shopCat.id);
      setLocation('Flagship Store');
      setTags(['Shopping', 'Receipt-Scanned']);
      setReceiptImage('https://images.unsplash.com/photo-1554415707-9e49016e7655?w=400&auto=format&fit=crop&q=80');
      triggerCelebration();
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (quickActionType === 'goal') {
      depositToGoal(selectedGoalId, numAmount);
    } else {
      const selectedCategory = categories.find(c => c.id === categoryId) || availableCategories[0];

      addTransaction({
        amount: numAmount,
        type,
        categoryId: selectedCategory?.id || 'cat-other',
        categoryName: selectedCategory?.name || 'Other',
        description: description.trim() || (type === 'income' ? 'Received Funds' : 'Expense Payment'),
        date,
        paymentMethod,
        notes: notes.trim() || undefined,
        location: location.trim() || undefined,
        receiptUrl: receiptImage || undefined,
        tags: tags.length > 0 ? tags : ['Direct Entry'],
      });
    }

    // Reset & Close
    setIsQuickActionOpen(false);
    setAmount('');
    setDescription('');
    setNotes('');
    setLocation('');
    setTags([]);
    setReceiptImage(null);
    triggerCelebration();
  };

  if (!isQuickActionOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsQuickActionOpen(false)}
          className="absolute inset-0 bg-[#111111]/70 backdrop-blur-sm"
        />

        {/* Right-Side Quick-Add Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[#FCFBF8] border-l border-[#E6E2D8] shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[#E6E2D8] flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-[#111111]">
                {quickActionType === 'goal' ? 'Deposit to Savings Vault' : 'Quick Add Transaction'}
              </h3>
              <p className="text-xs text-[#666666]">Instant ledger recording</p>
            </div>

            <button
              onClick={() => setIsQuickActionOpen(false)}
              className="p-2 rounded-2xl text-[#666666] hover:text-[#111111] hover:bg-[#F0EDE4]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-4 overflow-y-auto">
            {/* Quick AI Receipt Scan */}
            {quickActionType !== 'goal' && (
              <div className="p-3.5 rounded-2xl bg-[#F7F5F0] border border-[#E6E2D8] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#EAF56D] text-[#111111]">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111111] block">AI Receipt Scanner</span>
                    <p className="text-[10px] text-[#666666]">Auto-fill merchant & amount</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulateScanReceipt}
                  disabled={isScanningReceipt}
                  className="px-3 py-1.5 rounded-xl bg-[#111111] hover:bg-[#262626] text-[#FCFBF8] font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 text-[#EAF56D]" />
                  <span>{isScanningReceipt ? 'Scanning...' : 'Scan Receipt'}</span>
                </button>
              </div>
            )}

            {/* Type Selector */}
            {quickActionType !== 'goal' && (
              <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-[#F7F5F0] border border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'expense'
                      ? 'bg-[#111111] text-[#FCFBF8] shadow-xs'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <TrendingDown className="w-3.5 h-3.5 text-[#FF8F92]" />
                  <span>Expense</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'income'
                      ? 'bg-[#111111] text-[#FCFBF8] shadow-xs'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#58C875]" />
                  <span>Income</span>
                </button>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold text-[#111111]/70 mb-1.5">
                Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full text-3xl font-black bg-[#F7F5F0] border border-[#E6E2D8] rounded-2xl px-5 py-3 text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            {/* Vault selector if Goal */}
            {quickActionType === 'goal' && (
              <div>
                <label className="block text-xs font-bold text-[#111111]/70 mb-1.5">
                  Select Savings Vault
                </label>
                <select
                  value={selectedGoalId}
                  onChange={e => setSelectedGoalId(e.target.value)}
                  className="aura-input"
                >
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({formatCurrency(g.currentAmount, currency)} / {formatCurrency(g.targetAmount, currency)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Description & Category */}
            {quickActionType !== 'goal' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111111]/70 mb-1.5">
                      Description / Merchant
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coffee / Apple Store"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="aura-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111]/70 mb-1.5">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                      className="aura-input"
                    >
                      {availableCategories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date & Payment Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111111]/70 mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="aura-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111]/70 mb-1.5">
                      Payment Method
                    </label>
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
                      <option value="Crypto">Crypto</option>
                    </select>
                  </div>
                </div>

                {/* Location & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111111]/70 mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Location (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="aura-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111]/70 mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Tags
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Add tag + Enter"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1 aura-input"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-2 rounded-2xl bg-[#111111] text-xs font-bold text-[#FCFBF8]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(t => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full bg-[#EAF56D] text-[#111111] text-[11px] font-bold flex items-center gap-1"
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-[#111111]/60"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Submit Bar at bottom of drawer */}
            <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsQuickActionOpen(false)}
                className="aura-btn-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="aura-btn-primary flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{quickActionType === 'goal' ? 'Deposit to Vault' : 'Save Transaction'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
