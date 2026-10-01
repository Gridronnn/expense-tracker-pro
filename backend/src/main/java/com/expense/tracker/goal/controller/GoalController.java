package com.expense.tracker.goal.controller;

import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.goal.dto.GoalAmountRequest;
import com.expense.tracker.goal.dto.GoalRequest;
import com.expense.tracker.goal.dto.GoalResponse;
import com.expense.tracker.goal.service.GoalService;
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
@RequestMapping("/api/v1/goals")
@RequiredArgsConstructor
@Tag(name = "Savings Goals", description = "Endpoints for managing wealth targets and savings vaults")
public class GoalController {

    private final GoalService goalService;

    @GetMapping
    @Operation(summary = "Get all savings goals for authenticated user")
    public ResponseEntity<ApiResponse<List<GoalResponse>>> getGoals(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        List<GoalResponse> goals = goalService.getGoalsForUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Goals retrieved successfully", goals));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get savings goal by ID")
    public ResponseEntity<ApiResponse<GoalResponse>> getGoalById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        GoalResponse goal = goalService.getGoalById(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Goal retrieved successfully", goal));
    }

    @PostMapping
    @Operation(summary = "Create new savings goal")
    public ResponseEntity<ApiResponse<GoalResponse>> createGoal(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody GoalRequest request
    ) {
        GoalResponse goal = goalService.createGoal(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Goal created successfully", goal));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update savings goal")
    public ResponseEntity<ApiResponse<GoalResponse>> updateGoal(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody GoalRequest request
    ) {
        GoalResponse goal = goalService.updateGoal(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Goal updated successfully", goal));
    }

    @PostMapping("/{id}/deposit")
    @Operation(summary = "Deposit funds into savings goal")
    public ResponseEntity<ApiResponse<GoalResponse>> deposit(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody GoalAmountRequest request
    ) {
        GoalResponse goal = goalService.deposit(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Deposit successful", goal));
    }

    @PostMapping("/{id}/withdraw")
    @Operation(summary = "Withdraw funds from savings goal")
    public ResponseEntity<ApiResponse<GoalResponse>> withdraw(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody GoalAmountRequest request
    ) {
        GoalResponse goal = goalService.withdraw(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Withdrawal successful", goal));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete savings goal")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        goalService.deleteGoal(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Goal deleted successfully", null));
    }
}
