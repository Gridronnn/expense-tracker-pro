package com.expense.tracker.dashboard.service;

import com.expense.tracker.category.entity.Category;
import com.expense.tracker.category.repository.CategoryRepository;
import com.expense.tracker.dashboard.dto.CategoryBreakdownResponse;
import com.expense.tracker.dashboard.dto.DashboardSummaryResponse;
import com.expense.tracker.dashboard.dto.MonthlyTrendResponse;
import com.expense.tracker.expense.dto.ExpenseResponse;
import com.expense.tracker.expense.entity.Expense;
import com.expense.tracker.expense.repository.ExpenseRepository;
import com.expense.tracker.income.dto.IncomeResponse;
import com.expense.tracker.income.entity.Income;
import com.expense.tracker.income.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(UUID userId) {
        LocalDate now = LocalDate.now();
        YearMonth currentYearMonth = YearMonth.from(now);
        LocalDate startCurrentMonth = currentYearMonth.atDay(1);
        LocalDate endCurrentMonth = currentYearMonth.atEndOfMonth();

        YearMonth prevYearMonth = currentYearMonth.minusMonths(1);
        LocalDate startPrevMonth = prevYearMonth.atDay(1);
        LocalDate endPrevMonth = prevYearMonth.atEndOfMonth();

        BigDecimal totalIncome = incomeRepository.sumTotalByUserId(userId);
        BigDecimal totalExpenses = expenseRepository.sumTotalByUserId(userId);
        BigDecimal currentBalance = totalIncome.subtract(totalExpenses);

        BigDecimal currentMonthIncome = incomeRepository.sumTotalByUserIdAndDateRange(userId, startCurrentMonth, endCurrentMonth);
        BigDecimal currentMonthExpenses = expenseRepository.sumTotalByUserIdAndDateRange(userId, startCurrentMonth, endCurrentMonth);

        BigDecimal prevMonthIncome = incomeRepository.sumTotalByUserIdAndDateRange(userId, startPrevMonth, endPrevMonth);
        BigDecimal prevMonthExpenses = expenseRepository.sumTotalByUserIdAndDateRange(userId, startPrevMonth, endPrevMonth);

        BigDecimal incomeChange = calculatePercentageChange(prevMonthIncome, currentMonthIncome);
        BigDecimal expenseChange = calculatePercentageChange(prevMonthExpenses, currentMonthExpenses);

        // Highest spending category in current month
        List<Category> categories = categoryRepository.findAllAvailableForUser(userId);
        String topCategoryName = "General";
        BigDecimal topCategoryAmount = BigDecimal.ZERO;

        for (Category cat : categories) {
            BigDecimal sum = expenseRepository.sumByCategoryAndDateRange(userId, cat.getId(), startCurrentMonth, endCurrentMonth);
            if (sum.compareTo(topCategoryAmount) > 0) {
                topCategoryAmount = sum;
                topCategoryName = cat.getName();
            }
        }

        // Recent transactions
        List<ExpenseResponse> recentExpenses = expenseRepository.findTop5ByUserIdOrderByDateDescCreatedAtDesc(userId).stream()
                .map(ExpenseResponse::fromEntity)
                .collect(Collectors.toList());

        List<IncomeResponse> recentIncome = incomeRepository.findTop5ByUserIdOrderByDateDescCreatedAtDesc(userId).stream()
                .map(IncomeResponse::fromEntity)
                .collect(Collectors.toList());

        // Average expense
        BigDecimal avgTransaction = BigDecimal.ZERO;
        long totalExpenseCount = expenseRepository.count();
        if (totalExpenseCount > 0 && totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
            avgTransaction = totalExpenses.divide(new BigDecimal(totalExpenseCount), 2, RoundingMode.HALF_UP);
        }

        return DashboardSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .currentBalance(currentBalance)
                .netSavings(totalIncome.subtract(totalExpenses))
                .monthlyIncome(currentMonthIncome)
                .monthlyExpenses(currentMonthExpenses)
                .incomeChangePercentage(incomeChange)
                .expenseChangePercentage(expenseChange)
                .highestSpendingCategory(topCategoryName)
                .highestSpendingAmount(topCategoryAmount)
                .averageTransaction(avgTransaction)
                .recentExpenses(recentExpenses)
                .recentIncome(recentIncome)
                .build();
    }

    @Transactional(readOnly = true)
    public List<CategoryBreakdownResponse> getCategoryBreakdown(UUID userId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = YearMonth.now().atDay(1);
        if (endDate == null) endDate = YearMonth.now().atEndOfMonth();

        BigDecimal totalExpenses = expenseRepository.sumTotalByUserIdAndDateRange(userId, startDate, endDate);
        List<Category> categories = categoryRepository.findAllAvailableForUser(userId);

        List<CategoryBreakdownResponse> breakdown = new ArrayList<>();

        for (Category cat : categories) {
            if ("INCOME".equalsIgnoreCase(cat.getType())) continue;

            BigDecimal sum = expenseRepository.sumByCategoryAndDateRange(userId, cat.getId(), startDate, endDate);
            if (sum.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal percentage = BigDecimal.ZERO;
                if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                    percentage = sum.divide(totalExpenses, 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal("100"))
                            .setScale(2, RoundingMode.HALF_UP);
                }

                breakdown.add(CategoryBreakdownResponse.builder()
                        .categoryName(cat.getName())
                        .categoryColor(cat.getColor())
                        .categoryIcon(cat.getIcon())
                        .totalAmount(sum)
                        .percentageOfTotal(percentage)
                        .transactionCount(0)
                        .build());
            }
        }

        breakdown.sort((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()));
        return breakdown;
    }

    @Transactional(readOnly = true)
    public List<MonthlyTrendResponse> getMonthlyTrends(UUID userId, int months) {
        if (months <= 0) months = 6;
        List<MonthlyTrendResponse> trends = new ArrayList<>();
        YearMonth currentYearMonth = YearMonth.now();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = months - 1; i >= 0; i--) {
            YearMonth ym = currentYearMonth.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();

            BigDecimal income = incomeRepository.sumTotalByUserIdAndDateRange(userId, start, end);
            BigDecimal expense = expenseRepository.sumTotalByUserIdAndDateRange(userId, start, end);

            trends.add(MonthlyTrendResponse.builder()
                    .month(ym.format(formatter))
                    .totalIncome(income)
                    .totalExpense(expense)
                    .netSavings(income.subtract(expense))
                    .build());
        }

        return trends;
    }

    private BigDecimal calculatePercentageChange(BigDecimal prev, BigDecimal current) {
        if (prev == null || prev.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? new BigDecimal("100.00") : BigDecimal.ZERO;
        }
        return current.subtract(prev)
                .divide(prev, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, RoundingMode.HALF_UP);
    }
}
