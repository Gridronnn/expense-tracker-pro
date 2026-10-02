import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  FileSpreadsheet,
  FileText,
  Trash2,
  Copy,
  ArrowUpDown,
  CheckSquare,
  Square,
  X,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Transaction, PaymentMethod } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportTransactionsToPdf } from '../../utils/exportPdf';
import { exportTransactionsToExcel, exportTransactionsToCsv } from '../../utils/exportExcel';

export const TransactionsView: React.FC = () => {
  const {
    transactions,
    categories,
    deleteTransaction,
    duplicateTransaction,
    bulkDeleteTransactions,
    setIsQuickActionOpen,
    setQuickActionType,
    currency,
  } = useApp();

  const { user } = useAuth();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        if (t.isArchived) return false;
        if (selectedType !== 'all' && t.type !== selectedType) return false;
        if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false;
        if (selectedMethod !== 'all' && t.paymentMethod !== selectedMethod) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesDesc = t.description.toLowerCase().includes(q);
          const matchesCat = t.categoryName.toLowerCase().includes(q);
          const matchesNotes = t.notes?.toLowerCase().includes(q) || false;
          const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(q));
          if (!matchesDesc && !matchesCat && !matchesNotes && !matchesTags) {
            return false;
          }
        }

        if (selectedDateFilter !== 'all') {
          const txDate = new Date(t.date);
          const now = new Date();
          if (selectedDateFilter === 'today') {
            if (txDate.toDateString() !== now.toDateString()) return false;
          } else if (selectedDateFilter === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (txDate < oneWeekAgo) return false;
          } else if (selectedDateFilter === 'month') {
            if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
          } else if (selectedDateFilter === 'year') {
            if (txDate.getFullYear() !== now.getFullYear()) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, selectedType, selectedCategory, selectedMethod, searchQuery, selectedDateFilter, sortOrder]);

  const totalInflow = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOutflow = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netDelta = totalInflow - totalOutflow;

  const handleSelectAll = () => {
    if (selectedTxIds.length === filteredTransactions.length) {
      setSelectedTxIds([]);
    } else {
      setSelectedTxIds(filteredTransactions.map(t => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedTxIds.includes(id)) {
      setSelectedTxIds(selectedTxIds.filter(i => i !== id));
    } else {
      setSelectedTxIds([...selectedTxIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTxIds.length} transactions?`)) {
      bulkDeleteTransactions(selectedTxIds);
      setSelectedTxIds([]);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto bg-[#F7F5F0] text-[#111111] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
              Financial Ledger
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#D9CEFF] text-[#111111] text-[10px] font-bold">
              {filteredTransactions.length} Records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
            Transactions & Activity Trail
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setQuickActionType('expense');
              setIsQuickActionOpen(true);
            }}
            className="aura-btn-primary flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP BENTO STAT CARDS
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[10px]">
        {/* Mint Inflow */}
        <div className="rounded-[20px] bg-[#5B9E7C] text-white p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider block">
            Filtered Inflow
          </span>
          <div className="text-3xl font-black text-white">
            +{formatCurrency(totalInflow, currency)}
          </div>
          <span className="text-xs text-white/80">From {filteredTransactions.filter(t => t.type === 'income').length} deposits</span>
        </div>

        {/* Pale Lime Outflow */}
        <div className="rounded-[20px] bg-[#EAF56D] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider block">
            Filtered Outflow
          </span>
          <div className="text-3xl font-black text-[#111111]">
            -{formatCurrency(totalOutflow, currency)}
          </div>
          <span className="text-xs text-[#666666]">From {filteredTransactions.filter(t => t.type === 'expense').length} expenses</span>
        </div>

        {/* Lavender Net Delta */}
        <div className="rounded-[20px] bg-[#D9CEFF] text-[#111111] p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider block">
            Net Cash Retained
          </span>
          <div className="text-3xl font-black text-[#111111]">
            {formatCurrency(netDelta, currency)}
          </div>
          <span className="text-xs font-semibold text-purple-950">Active balance delta</span>
        </div>

        {/* Soft White Export Deck */}
        <div className="rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] p-6 flex flex-col justify-between shadow-sm min-h-[150px]">
          <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block">
            Certified Statements
          </span>
          <div className="flex gap-2 my-auto">
            <button
              onClick={() => exportTransactionsToPdf(filteredTransactions, user?.name || 'User', currency)}
              className="flex-1 py-2 rounded-lg bg-[#111111] hover:bg-[#262626] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => exportTransactionsToExcel(filteredTransactions)}
              className="flex-1 py-2 rounded-lg bg-[#F0EDE4] hover:bg-[#E6E2D8] text-[#111111] font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportTransactionsToCsv(filteredTransactions)}
              className="flex-1 py-2 rounded-lg bg-[#F0EDE4] hover:bg-[#E6E2D8] text-[#111111] font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
          <span className="text-[10px] text-[#888888]">Direct offline download</span>
        </div>
      </div>

      {/* =========================================================================
          FILTERS & SEARCH BAR
         ========================================================================= */}
      <div className="p-5 rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search description, category, tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E6E2D8] rounded-xl pl-10 pr-4 py-2 text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Type selector */}
            <div className="inline-flex p-1 rounded-xl bg-[#F0EDE4] text-xs">
              {(['all', 'expense', 'income'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-all ${
                    selectedType === type
                      ? 'bg-[#FCFBF8] text-[#111111] shadow-sm'
                      : 'text-[#666666] hover:text-[#111111]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-[#FCFBF8] border border-[#E6E2D8] rounded-xl px-3 py-1.5 text-xs text-[#111111] font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Timeframe Filter */}
            <select
              value={selectedDateFilter}
              onChange={e => setSelectedDateFilter(e.target.value as any)}
              className="bg-[#FCFBF8] border border-[#E6E2D8] rounded-xl px-3 py-1.5 text-xs text-[#111111] font-medium focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Past 7 Days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
              className="p-2 rounded-xl bg-[#FCFBF8] border border-[#E6E2D8] text-[#666666] hover:text-[#111111]"
              title={`Sort (${sortOrder.toUpperCase()})`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedTxIds.length > 0 && (
          <div className="p-3 rounded-xl bg-[#F8DADD] text-[#111111] flex items-center justify-between">
            <span className="text-xs font-bold">
              {selectedTxIds.length} transaction(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg bg-[#FF8F92] hover:bg-rose-400 text-[#111111] font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          TRANSACTIONS TABLE
         ========================================================================= */}
      <div className="rounded-[20px] bg-[#FCFBF8] border border-[#E6E2D8] shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-[#888888]">
            <Layers className="w-10 h-10 mx-auto mb-2 text-[#CCCCCC]" />
            <h3 className="text-sm font-bold text-[#111111]">No Transactions Found</h3>
            <p className="text-xs text-[#666666] mt-1 max-w-sm mx-auto mb-4">
              Try adjusting your search query or filters, or record a new transaction.
            </p>
            <button
              onClick={() => {
                setQuickActionType('expense');
                setIsQuickActionOpen(true);
              }}
              className="aura-btn-primary inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Transaction</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E6E2D8] text-[11px] font-bold text-[#666666] uppercase tracking-wider bg-[#F7F5F0]">
                  <th className="p-4 w-12 text-center">
                    <button onClick={handleSelectAll} className="text-[#666666] hover:text-[#111111]">
                      {selectedTxIds.length === filteredTransactions.length ? (
                        <CheckSquare className="w-4 h-4 text-[#111111]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Transaction</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Method</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8] text-xs">
                {filteredTransactions.map(tx => {
                  const isSelected = selectedTxIds.includes(tx.id);
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-[#F7F5F0] transition-colors group ${
                        isSelected ? 'bg-[#F0EDE4]' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(tx.id)}
                          className="text-[#888888] hover:text-[#111111]"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#111111]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E6E2D8] text-[#111111] flex items-center justify-center flex-shrink-0">
                            <CategoryIcon name={tx.categoryId} />
                          </div>
                          <div>
                            <span className="font-bold text-[#111111] block">{tx.description}</span>
                            {tx.notes && <span className="text-[10px] text-[#666666] block truncate max-w-xs">{tx.notes}</span>}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-[#F0EDE4] text-[11px] text-[#111111] font-semibold">
                          {tx.categoryName}
                        </span>
                      </td>

                      <td className="p-4 text-[#666666] font-mono text-[11px]">
                        {formatDate(tx.date)}
                      </td>

                      <td className="p-4 text-[#666666] text-[11px]">
                        {tx.paymentMethod}
                      </td>

                      <td className="p-4 text-right font-black">
                        <span className={tx.type === 'income' ? 'text-[#58C875]' : 'text-[#111111]'}>
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => duplicateTransaction(tx.id)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-[#111111]"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 rounded-lg text-[#666666] hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
