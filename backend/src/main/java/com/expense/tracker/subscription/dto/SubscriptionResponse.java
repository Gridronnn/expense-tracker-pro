package com.expense.tracker.subscription.dto;

import com.expense.tracker.category.dto.CategoryResponse;
import com.expense.tracker.subscription.entity.Subscription;
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
public class SubscriptionResponse {
    private UUID id;
    private String name;
    private BigDecimal amount;
    private String billingCycle;
    private LocalDate renewalDate;
    private String color;
    private String icon;
    private String status;
    private CategoryResponse category;
    private Instant createdAt;

    public static SubscriptionResponse fromEntity(Subscription sub) {
        return SubscriptionResponse.builder()
                .id(sub.getId())
                .name(sub.getName())
                .amount(sub.getAmount())
                .billingCycle(sub.getBillingCycle())
                .renewalDate(sub.getRenewalDate())
                .color(sub.getColor())
                .icon(sub.getIcon())
                .status(sub.getStatus())
                .category(sub.getCategory() != null ? CategoryResponse.fromEntity(sub.getCategory()) : null)
                .createdAt(sub.getCreatedAt())
                .build();
    }
}
