package com.expense.tracker.expense.dto;

import com.expense.tracker.category.dto.CategoryResponse;
import com.expense.tracker.expense.entity.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private UUID id;
    private String title;
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private String paymentMethod;
    private String notes;
    private String tags;
    private boolean recurring;
    private CategoryResponse category;
    private Instant createdAt;
    private Instant updatedAt;

    public static ExpenseResponse fromEntity(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .date(expense.getDate())
                .description(expense.getDescription())
                .paymentMethod(expense.getPaymentMethod())
                .notes(expense.getNotes())
                .tags(expense.getTags())
                .recurring(expense.isRecurring())
                .category(expense.getCategory() != null ? CategoryResponse.fromEntity(expense.getCategory()) : null)
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }
}
