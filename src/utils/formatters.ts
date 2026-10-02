import { CurrencyCode, FinancialHealthBreakdown } from '../types';
import { SUPPORTED_CURRENCIES } from '../data/mockData';

export const formatCurrency = (
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  showSymbol: boolean = true
): string => {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const converted = amount * config.rate;

  const formatted = new Intl.NumberFormat(config.formatLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);

  return showSymbol ? `${config.symbol}${formatted}` : formatted;
};

export const formatCompactCurrency = (
  amount: number,
  currencyCode: CurrencyCode = 'USD'
): string => {
  const config = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const converted = amount * config.rate;

  if (Math.abs(converted) >= 1_000_000) {
    return `${config.symbol}${(converted / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(converted) >= 1_000) {
    return `${config.symbol}${(converted / 1_000).toFixed(1)}k`;
  }
  return `${config.symbol}${converted.toFixed(0)}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

export const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(d);
};

export const calculateFinancialHealthScore = (
  monthlyIncome: number,
  monthlyExpense: number,
  totalSavedInGoals: number,
  totalBudgetLimit: number
): FinancialHealthBreakdown => {
  const savings = Math.max(0, monthlyIncome - monthlyExpense);
  const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;
  
  // 1. Savings Rate Score (0-30 pts)
  let savingsRateScore = 15;
  if (savingsRate >= 50) savingsRateScore = 30;
  else if (savingsRate >= 30) savingsRateScore = 25;
  else if (savingsRate >= 20) savingsRateScore = 20;
  else if (savingsRate >= 10) savingsRateScore = 15;
  else savingsRateScore = 5;

  // 2. Budget Discipline Score (0-30 pts)
  let budgetDisciplineScore = 25;
  if (totalBudgetLimit > 0) {
    const budgetUtilization = (monthlyExpense / totalBudgetLimit) * 100;
    if (budgetUtilization <= 85) budgetDisciplineScore = 30;
    else if (budgetUtilization <= 100) budgetDisciplineScore = 22;
    else if (budgetUtilization <= 115) budgetDisciplineScore = 12;
    else budgetDisciplineScore = 5;
  }

  // 3. Emergency & Vault Health (0-25 pts)
  let emergencyFundScore = 15;
  const targetEmergencyFund = monthlyExpense * 3;
  if (targetEmergencyFund > 0) {
    const coverage = (totalSavedInGoals / targetEmergencyFund) * 100;
    if (coverage >= 100) emergencyFundScore = 25;
    else if (coverage >= 60) emergencyFundScore = 20;
    else if (coverage >= 30) emergencyFundScore = 12;
    else emergencyFundScore = 6;
  }

  // 4. Cashflow Net Ratio (0-15 pts)
  let cashFlowRatioScore = monthlyIncome > monthlyExpense * 1.3 ? 15 : (monthlyIncome > monthlyExpense ? 10 : 3);

  const totalScore = Math.min(100, Math.max(10, savingsRateScore + budgetDisciplineScore + emergencyFundScore + cashFlowRatioScore));

  let label: FinancialHealthBreakdown['label'] = 'Healthy';
  if (totalScore >= 88) label = 'Exceptional';
  else if (totalScore >= 75) label = 'Strong';
  else if (totalScore >= 60) label = 'Healthy';
  else if (totalScore >= 45) label = 'Moderate';
  else label = 'Critical';

  const suggestions: string[] = [];
  if (savingsRate < 20) suggestions.push('Aim to increase savings rate above 20% of net income.');
  if (monthlyExpense > totalBudgetLimit && totalBudgetLimit > 0) suggestions.push('You are currently exceeding your overall monthly budget cap.');
  if (emergencyFundScore < 20) suggestions.push('Boost your Emergency Vault to cover at least 3-6 months of living expenses.');
  if (suggestions.length === 0) suggestions.push('Your financial velocity is prime. Consider allocating surplus to index investments.');

  return {
    score: totalScore,
    label,
    savingsRateScore,
    budgetDisciplineScore,
    emergencyFundScore,
    cashFlowRatioScore,
    suggestions,
  };
};
