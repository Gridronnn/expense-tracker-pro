package com.expense.tracker.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryBreakdownResponse {
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private BigDecimal totalAmount;
    private BigDecimal percentageOfTotal;
    private long transactionCount;
}
