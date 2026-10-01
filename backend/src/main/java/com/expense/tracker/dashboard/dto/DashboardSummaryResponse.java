package com.expense.tracker.dashboard.dto;

import com.expense.tracker.expense.dto.ExpenseResponse;
import com.expense.tracker.income.dto.IncomeResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal currentBalance;
    private BigDecimal netSavings;
    private BigDecimal monthlyIncome;
    private BigDecimal monthlyExpenses;
    private BigDecimal incomeChangePercentage;
    private BigDecimal expenseChangePercentage;
    private String highestSpendingCategory;
    private BigDecimal highestSpendingAmount;
    private BigDecimal averageTransaction;
    private List<ExpenseResponse> recentExpenses;
    private List<IncomeResponse> recentIncome;
}
