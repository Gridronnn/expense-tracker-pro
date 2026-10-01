package com.expense.tracker.expense;

import com.expense.tracker.category.entity.Category;
import com.expense.tracker.category.repository.CategoryRepository;
import com.expense.tracker.common.exception.UnauthorizedException;
import com.expense.tracker.expense.dto.ExpenseRequest;
import com.expense.tracker.expense.dto.ExpenseResponse;
import com.expense.tracker.expense.entity.Expense;
import com.expense.tracker.expense.repository.ExpenseRepository;
import com.expense.tracker.expense.service.ExpenseService;
import com.expense.tracker.user.entity.User;
import com.expense.tracker.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    @Test
    void createExpense_Success() {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).name("Alex").build();

        ExpenseRequest request = ExpenseRequest.builder()
                .title("Fine Dining")
                .amount(new BigDecimal("125.50"))
                .date(LocalDate.now())
                .build();

        Expense saved = Expense.builder()
                .id(UUID.randomUUID())
                .user(user)
                .title(request.getTitle())
                .amount(request.getAmount())
                .date(request.getDate())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(expenseRepository.save(any(Expense.class))).thenReturn(saved);

        ExpenseResponse response = expenseService.createExpense(userId, request);

        assertNotNull(response);
        assertEquals("Fine Dining", response.getTitle());
        assertEquals(new BigDecimal("125.50"), response.getAmount());
    }

    @Test
    void getExpenseById_UnauthorizedUser_ThrowsUnauthorized() {
        UUID ownerId = UUID.randomUUID();
        UUID strangerId = UUID.randomUUID();
        UUID expenseId = UUID.randomUUID();

        User owner = User.builder().id(ownerId).build();
        Expense expense = Expense.builder().id(expenseId).user(owner).build();

        when(expenseRepository.findById(expenseId)).thenReturn(Optional.of(expense));

        assertThrows(UnauthorizedException.class, () -> expenseService.getExpenseById(strangerId, expenseId));
    }
}
