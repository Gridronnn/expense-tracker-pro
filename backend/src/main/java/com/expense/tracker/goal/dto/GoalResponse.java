package com.expense.tracker.goal.dto;

import com.expense.tracker.goal.entity.Goal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalResponse {
    private UUID id;
    private String title;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private BigDecimal percentage;
    private LocalDate deadline;
    private String color;
    private String icon;
    private boolean isCompleted;
    private Instant createdAt;

    public static GoalResponse fromEntity(Goal goal) {
        BigDecimal pct = BigDecimal.ZERO;
        if (goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            pct = goal.getCurrentAmount().divide(goal.getTargetAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        return GoalResponse.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .targetAmount(goal.getTargetAmount())
                .currentAmount(goal.getCurrentAmount())
                .percentage(pct)
                .deadline(goal.getDeadline())
                .color(goal.getColor())
                .icon(goal.getIcon())
                .isCompleted(goal.isCompleted())
                .createdAt(goal.getCreatedAt())
                .build();
    }
}
