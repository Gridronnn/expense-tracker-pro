import { Category, Transaction, Budget, SavingsGoal, Subscription, AIInsight, AppNotification, CurrencyConfig, UserProfile } from '../types';

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1.0, formatLocale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92, formatLocale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79, formatLocale: 'en-GB' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5, formatLocale: 'en-IN' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 155.0, formatLocale: 'ja-JP' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.36, formatLocale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52, formatLocale: 'en-AU' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.35, formatLocale: 'en-SG' },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 3.67, formatLocale: 'ar-AE' },
};

// Bento Design Palette (Electric Lime, Iris Purple, Pastel Pink, Cyan Sky)
export const DEFAULT_CATEGORIES: Category[] = [
  // Expense Categories
  { id: 'cat-food', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#D4FF00', isDefault: true },
  { id: 'cat-groceries', name: 'Groceries', type: 'expense', icon: 'ShoppingBag', color: '#8B5CF6', isDefault: true },
  { id: 'cat-transport', name: 'Transportation', type: 'expense', icon: 'Car', color: '#FF94C2', isDefault: true },
  { id: 'cat-fuel', name: 'Fuel & EV Charging', type: 'expense', icon: 'Fuel', color: '#38BDF8', isDefault: true },
  { id: 'cat-shopping', name: 'Shopping & Electronics', type: 'expense', icon: 'Shirt', color: '#D4FF00', isDefault: true },
  { id: 'cat-entertainment', name: 'Entertainment & Gaming', type: 'expense', icon: 'Film', color: '#A78BFA', isDefault: true },
  { id: 'cat-health', name: 'Health & Fitness', type: 'expense', icon: 'HeartPulse', color: '#FF94C2', isDefault: true },
  { id: 'cat-education', name: 'Education & Courses', type: 'expense', icon: 'GraduationCap', color: '#38BDF8', isDefault: true },
  { id: 'cat-utilities', name: 'Utilities & Bills', type: 'expense', icon: 'Zap', color: '#FCD34D', isDefault: true },
  { id: 'cat-rent', name: 'Rent & Mortgage', type: 'expense', icon: 'Home', color: '#8B5CF6', isDefault: true },
  { id: 'cat-insurance', name: 'Insurance', type: 'expense', icon: 'ShieldCheck', color: '#34D399', isDefault: true },
  { id: 'cat-travel', name: 'Travel & Flights', type: 'expense', icon: 'Plane', color: '#38BDF8', isDefault: true },
  { id: 'cat-subscriptions', name: 'Subscriptions', type: 'expense', icon: 'Repeat', color: '#FF94C2', isDefault: true },
  { id: 'cat-investments', name: 'Investments', type: 'expense', icon: 'TrendingUp', color: '#D4FF00', isDefault: true },

  // Income Categories
  { id: 'cat-salary', name: 'Monthly Salary', type: 'income', icon: 'Briefcase', color: '#D4FF00', isDefault: true },
  { id: 'cat-freelance', name: 'Freelance & Consulting', type: 'income', icon: 'Laptop', color: '#8B5CF6', isDefault: true },
  { id: 'cat-business', name: 'Business Revenue', type: 'income', icon: 'Building', color: '#38BDF8', isDefault: true },
  { id: 'cat-dividends', name: 'Stock Dividends', type: 'income', icon: 'Coins', color: '#FF94C2', isDefault: true },
  { id: 'cat-interest', name: 'Yield & Interest', type: 'income', icon: 'Percent', color: '#FCD34D', isDefault: true },
  { id: 'cat-rental-income', name: 'Rental Property Income', type: 'income', icon: 'Key', color: '#A78BFA', isDefault: true },
  { id: 'cat-other-income', name: 'Other Income', type: 'income', icon: 'PlusCircle', color: '#34D399', isDefault: true },
];

export const INITIAL_USER: UserProfile | null = null;
export const INITIAL_TRANSACTIONS: Transaction[] = [];
export const INITIAL_BUDGETS: Budget[] = [];
export const INITIAL_GOALS: SavingsGoal[] = [];
export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];
export const INITIAL_INSIGHTS: AIInsight[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
