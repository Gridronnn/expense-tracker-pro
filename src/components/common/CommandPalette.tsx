import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Sparkles,
  Repeat,
  Calendar,
  Settings,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { exportTransactionsToPdf } from '../../utils/exportPdf';
import { exportTransactionsToExcel } from '../../utils/exportExcel';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const {
    setActiveTab,
    setIsQuickActionOpen,
    setQuickActionType,
    transactions,
    currency,
  } = useApp();
  const { user } = useAuth();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const actions = [
    {
      id: 'add-expense',
      label: 'Record New Expense',
      shortcut: 'E',
      icon: Plus,
      run: () => {
        setQuickActionType('expense');
        setIsQuickActionOpen(true);
      },
    },
    {
      id: 'add-income',
      label: 'Deposit Income Funds',
      shortcut: 'I',
      icon: Plus,
      run: () => {
        setQuickActionType('income');
        setIsQuickActionOpen(true);
      },
    },
    {
      id: 'nav-dash',
      label: 'Go to Dashboard',
      shortcut: 'G D',
      icon: LayoutDashboard,
      run: () => setActiveTab('dashboard'),
    },
    {
      id: 'nav-tx',
      label: 'Go to Transactions Ledger',
      shortcut: 'G T',
      icon: ArrowLeftRight,
      run: () => setActiveTab('transactions'),
    },
    {
      id: 'nav-budgets',
      label: 'Go to Budgets & Ceilings',
      shortcut: 'G B',
      icon: PieChart,
      run: () => setActiveTab('budgets'),
    },
    {
      id: 'nav-vaults',
      label: 'Go to Savings Vaults',
      shortcut: 'G V',
      icon: Target,
      run: () => setActiveTab('goals'),
    },
    {
      id: 'nav-ai',
      label: 'Ask Aura AI Copilot',
      shortcut: 'G A',
      icon: Sparkles,
      run: () => setActiveTab('ai'),
    },
    {
      id: 'export-pdf',
      label: 'Export Statement PDF',
      shortcut: 'E P',
      icon: Download,
      run: () => exportTransactionsToPdf(transactions, user?.name || 'User', currency),
    },
    {
      id: 'export-excel',
      label: 'Export Ledger Excel (.xlsx)',
      shortcut: 'E X',
      icon: FileSpreadsheet,
      run: () => exportTransactionsToExcel(transactions),
    },
  ];

  const filteredActions = actions.filter(action =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 sm:p-6 pt-20 font-sans">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-xl bg-[#FCFBF8] rounded-[24px] border border-[#111111]/20 shadow-2xl overflow-hidden z-10 p-4"
        >
          <div className="flex items-center gap-3 px-3 py-2 border-b border-[#E6E2D8] mb-2">
            <Search className="w-4 h-4 text-[#666666]" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search action..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#111111] placeholder:text-[#666666] focus:outline-none"
            />
            <kbd className="px-2 py-0.5 rounded bg-[#F0EDE4] text-[10px] text-[#111111] font-mono border border-[#E6E2D8]">
              ESC
            </kbd>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 p-1">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#666666]">
                No matching actions found.
              </div>
            ) : (
              filteredActions.map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      a.run();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-[#111111] hover:bg-[#F0EDE4] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#F0EDE4] border border-[#E6E2D8] flex items-center justify-center text-[#111111]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{a.label}</span>
                    </div>
                    {a.shortcut && (
                      <kbd className="px-2 py-0.5 rounded bg-[#F0EDE4] text-[10px] text-[#666666] font-mono border border-[#E6E2D8]">
                        {a.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
