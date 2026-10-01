package com.expense.tracker.income.service;

import com.expense.tracker.category.entity.Category;
import com.expense.tracker.category.repository.CategoryRepository;
import com.expense.tracker.common.exception.ResourceNotFoundException;
import com.expense.tracker.common.exception.UnauthorizedException;
import com.expense.tracker.income.dto.IncomeRequest;
import com.expense.tracker.income.dto.IncomeResponse;
import com.expense.tracker.income.entity.Income;
import com.expense.tracker.income.repository.IncomeRepository;
import com.expense.tracker.user.entity.User;
import com.expense.tracker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<IncomeResponse> getIncome(
            UUID userId,
            String search,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {
        return incomeRepository.findWithFilters(userId, search, startDate, endDate, pageable)
                .map(IncomeResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public IncomeResponse getIncomeById(UUID userId, UUID id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with ID: " + id));

        if (!income.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this income record");
        }

        return IncomeResponse.fromEntity(income);
    }

    @Transactional
    public IncomeResponse createIncome(UUID userId, IncomeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        Income income = Income.builder()
                .user(user)
                .category(category)
                .source(request.getSource().trim())
                .amount(request.getAmount())
                .date(request.getDate())
                .description(request.getDescription())
                .notes(request.getNotes())
                .build();

        income = incomeRepository.save(income);
        return IncomeResponse.fromEntity(income);
    }

    @Transactional
    public IncomeResponse updateIncome(UUID userId, UUID id, IncomeRequest request) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with ID: " + id));

        if (!income.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to update this income record");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            income.setCategory(category);
        } else {
            income.setCategory(null);
        }

        income.setSource(request.getSource().trim());
        income.setAmount(request.getAmount());
        income.setDate(request.getDate());
        income.setDescription(request.getDescription());
        income.setNotes(request.getNotes());

        income = incomeRepository.save(income);
        return IncomeResponse.fromEntity(income);
    }

    @Transactional
    public void deleteIncome(UUID userId, UUID id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with ID: " + id));

        if (!income.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this income record");
        }

        incomeRepository.delete(income);
    }
}
