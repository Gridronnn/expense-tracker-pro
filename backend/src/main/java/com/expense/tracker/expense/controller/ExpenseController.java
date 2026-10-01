package com.expense.tracker.expense.controller;

import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.expense.dto.ExpenseRequest;
import com.expense.tracker.expense.dto.ExpenseResponse;
import com.expense.tracker.expense.service.ExpenseService;
import com.expense.tracker.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
@Tag(name = "Expenses", description = "Endpoints for managing user expense records")
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    @Operation(summary = "Get paginated expenses with dynamic filtering")
    public ResponseEntity<ApiResponse<Page<ExpenseResponse>>> getExpenses(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @PageableDefault(size = 20, sort = "date", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ExpenseResponse> expenses = expenseService.getExpenses(
                userDetails.getId(), search, categoryId, startDate, endDate, minAmount, maxAmount, pageable
        );
        return ResponseEntity.ok(ApiResponse.ok("Expenses retrieved successfully", expenses));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        ExpenseResponse expense = expenseService.getExpenseById(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Expense retrieved successfully", expense));
    }

    @PostMapping
    @Operation(summary = "Create new expense record")
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse expense = expenseService.createExpense(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Expense created successfully", expense));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update existing expense record")
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody ExpenseRequest request
    ) {
        ExpenseResponse expense = expenseService.updateExpense(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Expense updated successfully", expense));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete expense record")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        expenseService.deleteExpense(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Expense deleted successfully", null));
    }
}
