package com.expense.tracker.goal.service;

import com.expense.tracker.common.exception.BadRequestException;
import com.expense.tracker.common.exception.ResourceNotFoundException;
import com.expense.tracker.common.exception.UnauthorizedException;
import com.expense.tracker.goal.dto.GoalAmountRequest;
import com.expense.tracker.goal.dto.GoalRequest;
import com.expense.tracker.goal.dto.GoalResponse;
import com.expense.tracker.goal.entity.Goal;
import com.expense.tracker.goal.repository.GoalRepository;
import com.expense.tracker.user.entity.User;
import com.expense.tracker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<GoalResponse> getGoalsForUser(UUID userId) {
        return goalRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(GoalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GoalResponse getGoalById(UUID userId, UUID id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));

        if (!goal.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to view this goal");
        }

        return GoalResponse.fromEntity(goal);
    }

    @Transactional
    public GoalResponse createGoal(UUID userId, GoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BigDecimal initialAmount = request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO;
        boolean isCompleted = initialAmount.compareTo(request.getTargetAmount()) >= 0;

        Goal goal = Goal.builder()
                .user(user)
                .title(request.getTitle().trim())
                .targetAmount(request.getTargetAmount())
                .currentAmount(initialAmount)
                .deadline(request.getDeadline())
                .color(request.getColor() != null ? request.getColor() : "#5B9E7C")
                .icon(request.getIcon() != null ? request.getIcon() : "Target")
                .completed(isCompleted)
                .build();

        goal = goalRepository.save(goal);
        return GoalResponse.fromEntity(goal);
    }

    @Transactional
    public GoalResponse updateGoal(UUID userId, UUID id, GoalRequest request) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));

        if (!goal.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to update this goal");
        }

        goal.setTitle(request.getTitle().trim());
        goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) {
            goal.setCurrentAmount(request.getCurrentAmount());
        }
        goal.setDeadline(request.getDeadline());
        if (request.getColor() != null) goal.setColor(request.getColor());
        if (request.getIcon() != null) goal.setIcon(request.getIcon());
        goal.setCompleted(goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0);

        goal = goalRepository.save(goal);
        return GoalResponse.fromEntity(goal);
    }

    @Transactional
    public GoalResponse deposit(UUID userId, UUID id, GoalAmountRequest request) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));

        if (!goal.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this goal");
        }

        BigDecimal newAmount = goal.getCurrentAmount().add(request.getAmount());
        goal.setCurrentAmount(newAmount);
        goal.setCompleted(newAmount.compareTo(goal.getTargetAmount()) >= 0);

        goal = goalRepository.save(goal);
        return GoalResponse.fromEntity(goal);
    }

    @Transactional
    public GoalResponse withdraw(UUID userId, UUID id, GoalAmountRequest request) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));

        if (!goal.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this goal");
        }

        if (goal.getCurrentAmount().compareTo(request.getAmount()) < 0) {
            throw new BadRequestException("Withdrawal amount exceeds current goal savings balance");
        }

        BigDecimal newAmount = goal.getCurrentAmount().subtract(request.getAmount());
        goal.setCurrentAmount(newAmount);
        goal.setCompleted(newAmount.compareTo(goal.getTargetAmount()) >= 0);

        goal = goalRepository.save(goal);
        return GoalResponse.fromEntity(goal);
    }

    @Transactional
    public void deleteGoal(UUID userId, UUID id) {
        Goal goal = goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with ID: " + id));

        if (!goal.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this goal");
        }

        goalRepository.delete(goal);
    }
}
