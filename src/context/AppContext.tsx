import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Transaction,
  Category,
  Budget,
  SavingsGoal,
  Subscription,
  AIInsight,
  AppNotification,
  CurrencyCode,
} from '../types';
import {
  DEFAULT_CATEGORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_INSIGHTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type NavigationTab =
  | 'landing'
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'goals'
  | 'analytics'
  | 'ai'
  | 'subscriptions'
  | 'calendar'
  | 'settings';

interface AppContextType {
  // Navigation & Modals
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  quickActionType: 'expense' | 'income' | 'scan' | 'goal' | 'transfer' | null;
  setQuickActionType: (type: 'expense' | 'income' | 'scan' | 'goal' | 'transfer' | null) => void;
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;

  // Preferences
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  bentoStyle: 'dark' | 'pastel';
  setBentoStyle: (style: 'dark' | 'pastel') => void;
  toggleBentoStyle: () => void;

  // Data Collections
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: SavingsGoal[];
  subscriptions: Subscription[];
  insights: AIInsight[];
  notifications: AppNotification[];

  // CRUD Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;
  archiveTransaction: (id: string) => void;
  bulkDeleteTransactions: (ids: string[]) => void;

  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBudget: (budget: Omit<Budget, 'id' | 'spentAmount'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  addGoal: (goal: Omit<SavingsGoal, 'id' | 'isCompleted'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  depositToGoal: (id: string, amount: number) => void;
  withdrawFromGoal: (id: string, amount: number) => void;

  addSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscriptionStatus: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;

  markInsightRead: (id: string) => void;
  dismissInsight: (id: string) => void;

  // System
  clearAllData: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonString: string) => boolean;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState<boolean>(false);
  const [quickActionType, setQuickActionType] = useState<'expense' | 'income' | 'scan' | 'goal' | 'transfer' | null>(null);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);

  // Settings
  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('aura_currency_v2') as CurrencyCode) || 'USD';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('aura_theme_v2') as 'dark' | 'light') || 'dark';
  });

  // Apply dark/light class to root document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('aura_theme_v2', theme);
  }, [theme]);

  const [bentoStyle, setBentoStyle] = useState<'dark' | 'pastel'>(() => {
    return (localStorage.getItem('aura_bento_style_v1') as 'dark' | 'pastel') || 'pastel';
  });

  useEffect(() => {
    localStorage.setItem('aura_bento_style_v1', bentoStyle);
  }, [bentoStyle]);

  const toggleBentoStyle = () => {
    setBentoStyle(prev => (prev === 'dark' ? 'pastel' : 'dark'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('aura_currency_v2', currency);
  }, [currency]);

  // Clean empty-by-default collections
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('aura_transactions_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('aura_categories_v2');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('aura_budgets_v2');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('aura_goals_v2');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('aura_subscriptions_v2');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [insights, setInsights] = useState<AIInsight[]>(() => {
    const saved = localStorage.getItem('aura_insights_v2');
    return saved ? JSON.parse(saved) : INITIAL_INSIGHTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('aura_notifications_v2');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('aura_categories_v2', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('aura_budgets_v2', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('aura_goals_v2', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('aura_subscriptions_v2', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('aura_insights_v2', JSON.stringify(insights));
  }, [insights]);

  useEffect(() => {
    localStorage.setItem('aura_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  // Recalculate spent amounts on budgets whenever transactions change
  useEffect(() => {
    const categorySpends: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && !t.isArchived)
      .forEach(t => {
        categorySpends[t.categoryId] = (categorySpends[t.categoryId] || 0) + t.amount;
      });

    setBudgets(prev =>
      prev.map(b => ({
        ...b,
        spentAmount: categorySpends[b.categoryId] || 0,
      }))
    );
  }, [transactions]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#E4E4E7', '#A1A1AA', '#71717A'],
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  // Transaction CRUD
  const addTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);

    // Check if budget exceeded notification should trigger
    if (newTx.type === 'expense') {
      const relatedBudget = budgets.find(b => b.categoryId === newTx.categoryId);
      if (relatedBudget && (relatedBudget.spentAmount + newTx.amount) > relatedBudget.monthlyLimit) {
        const notif: AppNotification = {
          id: 'notif-' + Date.now(),
          title: `Budget Limit Exceeded: ${relatedBudget.categoryName}`,
          message: `Your spending on ${relatedBudget.categoryName} has reached ${((relatedBudget.spentAmount + newTx.amount) / relatedBudget.monthlyLimit * 100).toFixed(0)}% of your limit.`,
          type: 'budget_alert',
          timestamp: 'Just now',
          read: false,
        };
        setNotifications(prev => [notif, ...prev]);
      }
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const duplicateTransaction = (id: string) => {
    const original = transactions.find(t => t.id === id);
    if (!original) return;
    const duplicated: Transaction = {
      ...original,
      id: 'tx-' + Date.now(),
      description: `${original.description} (Copy)`,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [duplicated, ...prev]);
  };

  const archiveTransaction = (id: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, isArchived: !t.isArchived } : t))
    );
  };

  const bulkDeleteTransactions = (ids: string[]) => {
    setTransactions(prev => prev.filter(t => !ids.includes(t.id)));
  };

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: 'cat-' + Date.now(),
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Budget CRUD
  const addBudget = (budgetData: Omit<Budget, 'id' | 'spentAmount'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: 'bgt-' + Date.now(),
      spentAmount: 0,
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Goals CRUD
  const addGoal = (goalData: Omit<SavingsGoal, 'id' | 'isCompleted'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: 'goal-' + Date.now(),
      isCompleted: goalData.currentAmount >= goalData.targetAmount,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates };
        updated.isCompleted = updated.currentAmount >= updated.targetAmount;
        return updated;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const depositToGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const newTotal = g.currentAmount + amount;
        const reached = newTotal >= g.targetAmount;
        if (reached && !g.isCompleted) {
          triggerCelebration();
          const notif: AppNotification = {
            id: 'notif-' + Date.now(),
            title: `Goal Accomplished! 🎉`,
            message: `You fully reached the target for "${g.title}"!`,
            type: 'goal_reached',
            timestamp: 'Just now',
            read: false,
          };
          setNotifications(n => [notif, ...n]);
        }
        return {
          ...g,
          currentAmount: newTotal,
          isCompleted: reached,
        };
      })
    );
  };

  const withdrawFromGoal = (id: string, amount: number) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const newTotal = Math.max(0, g.currentAmount - amount);
        return {
          ...g,
          currentAmount: newTotal,
          isCompleted: newTotal >= g.targetAmount,
        };
      })
    );
  };

  // Subscriptions CRUD
  const addSubscription = (subData: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...subData,
      id: 'sub-' + Date.now(),
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  const toggleSubscriptionStatus = (id: string) => {
    setSubscriptions(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
      )
    );
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Insights
  const markInsightRead = (id: string) => {
    setInsights(prev => prev.map(i => (i.id === id ? { ...i, read: true } : i)));
  };

  const dismissInsight = (id: string) => {
    setInsights(prev => prev.filter(i => i.id !== id));
  };

  // Clear all data
  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setSubscriptions([]);
    setInsights([]);
    setNotifications([]);
    localStorage.removeItem('aura_transactions_v2');
    localStorage.removeItem('aura_budgets_v2');
    localStorage.removeItem('aura_goals_v2');
    localStorage.removeItem('aura_subscriptions_v2');
    localStorage.removeItem('aura_insights_v2');
    localStorage.removeItem('aura_notifications_v2');
  };

  const exportDatabaseJson = () => {
    const data = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      transactions,
      categories,
      budgets,
      goals,
      subscriptions,
      insights,
      notifications,
      currency,
      theme,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aura_Finance_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        setTransactions(parsed.transactions);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
      }
      if (parsed.budgets && Array.isArray(parsed.budgets)) {
        setBudgets(parsed.budgets);
      }
      if (parsed.goals && Array.isArray(parsed.goals)) {
        setGoals(parsed.goals);
      }
      if (parsed.subscriptions && Array.isArray(parsed.subscriptions)) {
        setSubscriptions(parsed.subscriptions);
      }
      if (parsed.currency) {
        setCurrency(parsed.currency);
      }
      triggerCelebration();
      return true;
    } catch (e) {
      console.error('Failed to import JSON backup', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isQuickActionOpen,
        setIsQuickActionOpen,
        quickActionType,
        setQuickActionType,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        currency,
        setCurrency,
        theme,
        setTheme,
        toggleTheme,
        bentoStyle,
        setBentoStyle,
        toggleBentoStyle,
        transactions,
        categories,
        budgets,
        goals,
        subscriptions,
        insights,
        notifications,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        archiveTransaction,
        bulkDeleteTransactions,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        depositToGoal,
        withdrawFromGoal,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleSubscriptionStatus,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        markInsightRead,
        dismissInsight,
        clearAllData,
        exportDatabaseJson,
        importDatabaseJson,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
