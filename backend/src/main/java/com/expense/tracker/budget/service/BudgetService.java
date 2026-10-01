package com.expense.tracker.budget.service;

import com.expense.tracker.budget.dto.BudgetRequest;
import com.expense.tracker.budget.dto.BudgetResponse;
import com.expense.tracker.budget.entity.Budget;
import com.expense.tracker.budget.repository.BudgetRepository;
import com.expense.tracker.category.entity.Category;
import com.expense.tracker.category.repository.CategoryRepository;
import com.expense.tracker.common.exception.ResourceNotFoundException;
import com.expense.tracker.common.exception.UnauthorizedException;
import com.expense.tracker.expense.repository.ExpenseRepository;
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
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgetsForUser(UUID userId) {
        List<Budget> budgets = budgetRepository.findAllByUserId(userId);
        return budgets.stream().map(budget -> {
            BigDecimal spent = expenseRepository.sumByCategoryAndDateRange(
                    userId,
                    budget.getCategory().getId(),
                    budget.getStartDate(),
                    budget.getEndDate()
            );
            return BudgetResponse.fromEntity(budget, spent);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(UUID userId, UUID id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));

        if (!budget.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this budget");
        }

        BigDecimal spent = expenseRepository.sumByCategoryAndDateRange(
                userId,
                budget.getCategory().getId(),
                budget.getStartDate(),
                budget.getEndDate()
        );
        return BudgetResponse.fromEntity(budget, spent);
    }

    @Transactional
    public BudgetResponse createBudget(UUID userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Budget budget = Budget.builder()
                .user(user)
                .category(category)
                .amount(request.getAmount())
                .period(request.getPeriod() != null ? request.getPeriod().toUpperCase() : "MONTHLY")
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .alertThreshold(request.getAlertThreshold() != null ? request.getAlertThreshold() : new BigDecimal("80.00"))
                .build();

        budget = budgetRepository.save(budget);

        BigDecimal spent = expenseRepository.sumByCategoryAndDateRange(
                userId,
                category.getId(),
                budget.getStartDate(),
                budget.getEndDate()
        );
        return BudgetResponse.fromEntity(budget, spent);
    }

    @Transactional
    public BudgetResponse updateBudget(UUID userId, UUID id, BudgetRequest request) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));

        if (!budget.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to update this budget");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        budget.setCategory(category);
        budget.setAmount(request.getAmount());
        if (request.getPeriod() != null) budget.setPeriod(request.getPeriod().toUpperCase());
        budget.setStartDate(request.getStartDate());
        budget.setEndDate(request.getEndDate());
        if (request.getAlertThreshold() != null) budget.setAlertThreshold(request.getAlertThreshold());

        budget = budgetRepository.save(budget);

        BigDecimal spent = expenseRepository.sumByCategoryAndDateRange(
                userId,
                category.getId(),
                budget.getStartDate(),
                budget.getEndDate()
        );
        return BudgetResponse.fromEntity(budget, spent);
    }

    @Transactional
    public void deleteBudget(UUID userId, UUID id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));

        if (!budget.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this budget");
        }

        budgetRepository.delete(budget);
    }
}
