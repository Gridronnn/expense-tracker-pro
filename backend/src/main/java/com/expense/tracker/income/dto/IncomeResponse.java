package com.expense.tracker.income.dto;

import com.expense.tracker.category.dto.CategoryResponse;
import com.expense.tracker.income.entity.Income;
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
public class IncomeResponse {
    private UUID id;
    private String source;
    private BigDecimal amount;
    private LocalDate date;
    private String description;
    private String notes;
    private CategoryResponse category;
    private Instant createdAt;
    private Instant updatedAt;

    public static IncomeResponse fromEntity(Income income) {
        return IncomeResponse.builder()
                .id(income.getId())
                .source(income.getSource())
                .amount(income.getAmount())
                .date(income.getDate())
                .description(income.getDescription())
                .notes(income.getNotes())
                .category(income.getCategory() != null ? CategoryResponse.fromEntity(income.getCategory()) : null)
                .createdAt(income.getCreatedAt())
                .updatedAt(income.getUpdatedAt())
                .build();
    }
}
