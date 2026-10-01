package com.expense.tracker.expense.service;

import com.expense.tracker.category.entity.Category;
import com.expense.tracker.category.repository.CategoryRepository;
import com.expense.tracker.common.exception.ResourceNotFoundException;
import com.expense.tracker.common.exception.UnauthorizedException;
import com.expense.tracker.expense.dto.ExpenseRequest;
import com.expense.tracker.expense.dto.ExpenseResponse;
import com.expense.tracker.expense.entity.Expense;
import com.expense.tracker.expense.repository.ExpenseRepository;
import com.expense.tracker.user.entity.User;
import com.expense.tracker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> getExpenses(
            UUID userId,
            String search,
            UUID categoryId,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            Pageable pageable
    ) {
        return expenseRepository.findWithFilters(userId, search, categoryId, startDate, endDate, minAmount, maxAmount, pageable)
                .map(ExpenseResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(UUID userId, UUID id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        if (!expense.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this expense record");
        }

        return ExpenseResponse.fromEntity(expense);
    }

    @Transactional
    public ExpenseResponse createExpense(UUID userId, ExpenseRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        Expense expense = Expense.builder()
                .user(user)
                .category(category)
                .title(request.getTitle().trim())
                .amount(request.getAmount())
                .date(request.getDate())
                .description(request.getDescription())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "CREDIT_CARD")
                .notes(request.getNotes())
                .tags(request.getTags())
                .recurring(request.getRecurring() != null ? request.getRecurring() : false)
                .build();

        expense = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(expense);
    }

    @Transactional
    public ExpenseResponse updateExpense(UUID userId, UUID id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        if (!expense.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to update this expense");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            expense.setCategory(category);
        } else {
            expense.setCategory(null);
        }

        expense.setTitle(request.getTitle().trim());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setDescription(request.getDescription());
        if (request.getPaymentMethod() != null) expense.setPaymentMethod(request.getPaymentMethod());
        expense.setNotes(request.getNotes());
        expense.setTags(request.getTags());
        if (request.getRecurring() != null) expense.setRecurring(request.getRecurring());

        expense = expenseRepository.save(expense);
        return ExpenseResponse.fromEntity(expense);
    }

    @Transactional
    public void deleteExpense(UUID userId, UUID id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        if (!expense.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this expense");
        }

        expenseRepository.delete(expense);
    }
}
