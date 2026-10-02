export type TransactionType = 'expense' | 'income' | 'transfer';

export type PaymentMethod = 
  | 'Credit Card' 
  | 'Debit Card' 
  | 'Bank Transfer' 
  | 'UPI' 
  | 'Apple Pay / Google Pay' 
  | 'Cash' 
  | 'Crypto';

export interface SplitMember {
  id: string;
  name: string;
  amount: number;
  isPaid: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  location?: string;
  receiptUrl?: string;
  tags: string[];
  isArchived?: boolean;
  splitWith?: SplitMember[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string; // Lucide icon identifier
  color: string; // Hex or CSS color
  budgetLimit?: number;
  isDefault?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  monthlyLimit: number;
  spentAmount: number;
  period: 'monthly' | 'weekly';
  color: string;
  warningThreshold: number; // e.g. 0.8 for 80%
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  icon: string;
  color: string;
  autoContributeAmount?: number;
  autoContributeFrequency?: 'weekly' | 'monthly';
  notes?: string;
  isCompleted: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily';
  nextBillingDate: string; // YYYY-MM-DD
  category: string;
  paymentMethod: PaymentMethod;
  status: 'active' | 'paused' | 'canceled';
  icon: string;
  color: string;
  websiteUrl?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'saving' | 'budget' | 'warning' | 'forecast' | 'habit';
  impactAmount?: number;
  actionLabel?: string;
  actionType?: 'set_budget' | 'cancel_subscription' | 'boost_goal';
  timestamp: string;
  read: boolean;
  scoreImpact?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'budget_alert' | 'bill_due' | 'goal_reached' | 'income' | 'security';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD' | 'SGD' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // Relative to USD = 1.0
  formatLocale: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  tier: 'Free Starter' | 'Pro Wealth' | 'Enterprise Elite';
  currency: CurrencyCode;
  theme: 'dark' | 'light';
  soundEffects: boolean;
  biometricLock: boolean;
}

export interface FinancialHealthBreakdown {
  score: number; // 0 - 100
  label: 'Exceptional' | 'Strong' | 'Healthy' | 'Moderate' | 'Critical';
  savingsRateScore: number;
  budgetDisciplineScore: number;
  emergencyFundScore: number;
  cashFlowRatioScore: number;
  suggestions: string[];
}
