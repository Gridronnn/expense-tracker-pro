import { Transaction, Budget, SavingsGoal, Subscription, CurrencyCode } from '../types';
import { formatCurrency } from './formatters';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  metricsPreview?: { label: string; value: string; trend?: 'up' | 'down' }[];
}

export const generateAIResponse = (
  query: string,
  transactions: Transaction[],
  budgets: Budget[],
  goals: SavingsGoal[],
  subscriptions: Subscription[],
  currency: CurrencyCode
): AIMessage => {
  const normalizedQuery = query.toLowerCase();
  const id = 'msg-' + Date.now();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Calculate live financial statistics
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = incomeTotal - expenseTotal;
  const savingsRate = incomeTotal > 0 ? ((netSavings / incomeTotal) * 100).toFixed(1) : '0';

  // Category totals
  const categoryExpenses: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryExpenses[t.categoryName] = (categoryExpenses[t.categoryName] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0] || ['None', 0];

  // Highest transaction
  const expensesOnly = transactions.filter(t => t.type === 'expense');
  const biggestExpense = expensesOnly.reduce(
    (max, t) => (t.amount > (max?.amount || 0) ? t : max),
    expensesOnly[0]
  );

  // Subscriptions total
  const monthlySubTotal = subscriptions.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.amount;
    if (s.billingCycle === 'yearly') return sum + s.amount / 12;
    if (s.billingCycle === 'weekly') return sum + s.amount * 4.33;
    return sum;
  }, 0);

  // 1. Food / Dining queries
  if (normalizedQuery.includes('food') || normalizedQuery.includes('dining') || normalizedQuery.includes('eat') || normalizedQuery.includes('restaurant')) {
    const foodSpend = categoryExpenses['Food & Dining'] || 0;
    const grocerySpend = categoryExpenses['Groceries'] || 0;
    const totalFood = foodSpend + grocerySpend;
    const foodPct = expenseTotal > 0 ? ((totalFood / expenseTotal) * 100).toFixed(0) : '0';

    return {
      id,
      sender: 'assistant',
      text: `Based on your live statements, your total culinary expenditure is **${formatCurrency(totalFood, currency)}** (${foodPct}% of all expenses). This breaks down into:\n\n• **Dining Out & Restaurants:** ${formatCurrency(foodSpend, currency)}\n• **Home Groceries:** ${formatCurrency(grocerySpend, currency)}\n\n💡 **Optimization Opportunity:** Reducing luxury restaurant dining by just 25% could add **${formatCurrency(foodSpend * 0.25, currency)}** directly into your savings vaults each month.`,
      timestamp,
      metricsPreview: [
        { label: 'Food & Dining', value: formatCurrency(foodSpend, currency), trend: 'up' },
        { label: 'Groceries', value: formatCurrency(grocerySpend, currency) },
        { label: 'Potential Savings', value: `+${formatCurrency(foodSpend * 0.25, currency)}/mo` },
      ],
      suggestedActions: [
        { label: 'Set Food Budget Cap to $600', action: 'set_food_budget' },
        { label: 'View Dining Transactions', action: 'filter_dining' }
      ]
    };
  }

  // 2. Savings / How to save / Wealth queries
  if (normalizedQuery.includes('save') || normalizedQuery.includes('savings') || normalizedQuery.includes('wealth') || normalizedQuery.includes('invest')) {
    return {
      id,
      sender: 'assistant',
      text: `Your current net savings velocity is **${formatCurrency(netSavings, currency)}** with a strong **${savingsRate}% savings rate**.\n\nHere is your custom 3-step wealth acceleration formula:\n1. **Trim Low-Utility Subscriptions:** You currently spend ${formatCurrency(monthlySubTotal, currency)}/month on recurring digital services.\n2. **Automate DCA Transfers:** Set up bi-weekly automatic transfers into your highest priority vault (*${goals[0]?.title || 'Emergency Vault'}*).\n3. **Dining Cap:** Cap discretionary weekend dining to recover ~$200-$300 monthly.`,
      timestamp,
      metricsPreview: [
        { label: 'Monthly Surplus', value: formatCurrency(netSavings, currency) },
        { label: 'Savings Rate', value: `${savingsRate}%`, trend: 'up' },
        { label: 'Active Vaults', value: `${goals.length} Goals` },
      ],
      suggestedActions: [
        { label: 'Deposit $250 to Emergency Vault', action: 'boost_emergency' },
        { label: 'Run Automated Budget Forecast', action: 'view_forecast' }
      ]
    };
  }

  // 3. Subscriptions queries
  if (normalizedQuery.includes('sub') || normalizedQuery.includes('recurring') || normalizedQuery.includes('netflix') || normalizedQuery.includes('spotify') || normalizedQuery.includes('bill')) {
    return {
      id,
      sender: 'assistant',
      text: `You currently have **${subscriptions.length} active recurring subscriptions** costing an estimated **${formatCurrency(monthlySubTotal, currency)}/month** (${formatCurrency(monthlySubTotal * 12, currency)}/year).\n\nKey breakdown:\n${subscriptions.map(s => `• **${s.name}**: ${formatCurrency(s.amount, currency)} (${s.billingCycle})`).join('\n')}`,
      timestamp,
      metricsPreview: [
        { label: 'Monthly Burn', value: formatCurrency(monthlySubTotal, currency) },
        { label: 'Annual Total', value: formatCurrency(monthlySubTotal * 12, currency) },
        { label: 'Active Subs', value: `${subscriptions.length}` },
      ],
      suggestedActions: [
        { label: 'Review Subscriptions', action: 'view_subscriptions' },
        { label: 'Cancel Unused Services', action: 'audit_subs' }
      ]
    };
  }

  // 4. Highest / Top / Biggest expense queries
  if (normalizedQuery.includes('highest') || normalizedQuery.includes('biggest') || normalizedQuery.includes('top') || normalizedQuery.includes('most')) {
    return {
      id,
      sender: 'assistant',
      text: `Your biggest single expenditure in this cycle was **"${biggestExpense?.description || 'N/A'}"** for **${formatCurrency(biggestExpense?.amount || 0, currency)}** on ${biggestExpense?.date || 'N/A'}.\n\nOverall, your highest spending category across all transactions is **${topCategory[0]}** at **${formatCurrency(topCategory[1] as number, currency)}** (${expenseTotal > 0 ? (((topCategory[1] as number) / expenseTotal) * 100).toFixed(0) : 0}% of total outflows).`,
      timestamp,
      metricsPreview: [
        { label: 'Top Category', value: topCategory[0] },
        { label: 'Category Total', value: formatCurrency(topCategory[1] as number, currency) },
        { label: 'Single Max', value: formatCurrency(biggestExpense?.amount || 0, currency) },
      ]
    };
  }

  // 5. Forecast / Future Net Worth
  if (normalizedQuery.includes('forecast') || normalizedQuery.includes('future') || normalizedQuery.includes('predict') || normalizedQuery.includes('net worth')) {
    const projected6Mo = netSavings * 6;
    const projected12Mo = netSavings * 12;

    return {
      id,
      sender: 'assistant',
      text: `✨ **Aura Predictive Cash Flow Modeling:**\n\nMaintaining your current monthly surplus of **${formatCurrency(netSavings, currency)}**:\n\n• **In 6 Months:** Projected liquid accumulation of **+${formatCurrency(projected6Mo, currency)}**\n• **In 12 Months:** Projected liquid accumulation of **+${formatCurrency(projected12Mo, currency)}**\n• **With 7% Index Yield:** Estimated 5-year wealth milestone: **${formatCurrency(netSavings * 60 * 1.2, currency)}**.\n\nYour financial health is in the top decile for disciplined capital preservation.`,
      timestamp,
      metricsPreview: [
        { label: '6-Month Projection', value: formatCurrency(projected6Mo, currency), trend: 'up' },
        { label: '1-Year Projection', value: formatCurrency(projected12Mo, currency), trend: 'up' },
        { label: 'Status', value: 'High Growth Velocity' },
      ],
      suggestedActions: [
        { label: 'Simulate Compound Growth', action: 'open_analytics' }
      ]
    };
  }

  // Generic intelligent summary
  return {
    id,
    sender: 'assistant',
    text: `Here is your current Executive Financial Overview:\n\n• **Total Inflows:** ${formatCurrency(incomeTotal, currency)}\n• **Total Outflows:** ${formatCurrency(expenseTotal, currency)}\n• **Net Monthly Surplus:** ${formatCurrency(netSavings, currency)} (${savingsRate}% savings rate)\n• **Top Outflow Sector:** ${topCategory[0]} (${formatCurrency(topCategory[1] as number, currency)})\n\nHow else can I assist your wealth strategy today? You can ask me to analyze specific categories, audit subscriptions, or simulate budget cuts.`,
    timestamp,
    metricsPreview: [
      { label: 'Net Cash Flow', value: formatCurrency(netSavings, currency), trend: netSavings >= 0 ? 'up' : 'down' },
      { label: 'Top Spend', value: topCategory[0] },
      { label: 'Savings Rate', value: `${savingsRate}%` }
    ],
    suggestedActions: [
      { label: 'Analyze Dining Expenses', action: 'ask_dining' },
      { label: 'Forecast 1-Year Net Worth', action: 'ask_forecast' },
      { label: 'Audit Subscriptions', action: 'ask_subs' }
    ]
  };
};
