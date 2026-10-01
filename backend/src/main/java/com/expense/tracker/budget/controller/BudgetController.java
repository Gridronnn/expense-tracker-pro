package com.expense.tracker.budget.controller;

import com.expense.tracker.budget.dto.BudgetRequest;
import com.expense.tracker.budget.dto.BudgetResponse;
import com.expense.tracker.budget.service.BudgetService;
import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/budgets")
@RequiredArgsConstructor
@Tag(name = "Budgets", description = "Endpoints for managing spending budgets and thresholds")
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    @Operation(summary = "Get all budgets with live calculated spent amounts and thresholds")
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        List<BudgetResponse> budgets = budgetService.getBudgetsForUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Budgets retrieved successfully", budgets));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID")
    public ResponseEntity<ApiResponse<BudgetResponse>> getBudgetById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        BudgetResponse budget = budgetService.getBudgetById(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Budget retrieved successfully", budget));
    }

    @PostMapping
    @Operation(summary = "Create budget limit for category")
    public ResponseEntity<ApiResponse<BudgetResponse>> createBudget(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody BudgetRequest request
    ) {
        BudgetResponse budget = budgetService.createBudget(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Budget created successfully", budget));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update budget")
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody BudgetRequest request
    ) {
        BudgetResponse budget = budgetService.updateBudget(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Budget updated successfully", budget));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete budget")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        budgetService.deleteBudget(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Budget deleted successfully", null));
    }
}
