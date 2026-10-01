package com.expense.tracker.budget.dto;

import com.expense.tracker.budget.entity.Budget;
import com.expense.tracker.category.dto.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {
    private UUID id;
    private CategoryResponse category;
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private BigDecimal percentageUsed;
    private boolean exceeded;
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal alertThreshold;

    public static BudgetResponse fromEntity(Budget budget, BigDecimal spentAmount) {
        BigDecimal totalBudget = budget.getAmount();
        BigDecimal remaining = totalBudget.subtract(spentAmount);
        boolean isExceeded = spentAmount.compareTo(totalBudget) > 0;
        
        BigDecimal percentage = BigDecimal.ZERO;
        if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
            percentage = spentAmount.divide(totalBudget, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return BudgetResponse.builder()
                .id(budget.getId())
                .category(CategoryResponse.fromEntity(budget.getCategory()))
                .amount(totalBudget)
                .spentAmount(spentAmount)
                .remainingAmount(remaining)
                .percentageUsed(percentage)
                .exceeded(isExceeded)
                .period(budget.getPeriod())
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .alertThreshold(budget.getAlertThreshold())
                .build();
    }
}
