package com.expense.tracker.subscription.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionStatusRequest {

    @NotBlank(message = "Status is required (ACTIVE, PAUSED, CANCELLED)")
    private String status;
}
