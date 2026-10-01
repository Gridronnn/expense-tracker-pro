package com.expense.tracker.report.dto;

import com.expense.tracker.expense.dto.ExpenseResponse;
import com.expense.tracker.income.dto.IncomeResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netCashFlow;
    private BigDecimal savingsRatePercentage;
    private long totalExpenseTransactions;
    private long totalIncomeTransactions;
    private List<ExpenseResponse> expenses;
    private List<IncomeResponse> income;
}
