package com.expense.tracker.report.service;

import com.expense.tracker.expense.dto.ExpenseResponse;
import com.expense.tracker.expense.repository.ExpenseRepository;
import com.expense.tracker.income.dto.IncomeResponse;
import com.expense.tracker.income.repository.IncomeRepository;
import com.expense.tracker.report.dto.ReportSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    @Transactional(readOnly = true)
    public ReportSummaryResponse generateSummaryReport(UUID userId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now();

        BigDecimal totalIncome = incomeRepository.sumTotalByUserIdAndDateRange(userId, startDate, endDate);
        BigDecimal totalExpenses = expenseRepository.sumTotalByUserIdAndDateRange(userId, startDate, endDate);
        BigDecimal netCashFlow = totalIncome.subtract(totalExpenses);

        BigDecimal savingsRate = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netCashFlow.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        List<ExpenseResponse> expenses = expenseRepository.findWithFilters(userId, null, null, startDate, endDate, null, null, Pageable.unpaged())
                .getContent().stream().map(ExpenseResponse::fromEntity).collect(Collectors.toList());

        List<IncomeResponse> income = incomeRepository.findWithFilters(userId, null, startDate, endDate, Pageable.unpaged())
                .getContent().stream().map(IncomeResponse::fromEntity).collect(Collectors.toList());

        return ReportSummaryResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netCashFlow(netCashFlow)
                .savingsRatePercentage(savingsRate)
                .totalExpenseTransactions(expenses.size())
                .totalIncomeTransactions(income.size())
                .expenses(expenses)
                .income(income)
                .build();
    }
}
