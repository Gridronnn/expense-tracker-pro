package com.expense.tracker.dashboard.controller;

import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.dashboard.dto.CategoryBreakdownResponse;
import com.expense.tracker.dashboard.dto.DashboardSummaryResponse;
import com.expense.tracker.dashboard.dto.MonthlyTrendResponse;
import com.expense.tracker.dashboard.service.DashboardService;
import com.expense.tracker.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard & Analytics", description = "Endpoints for calculating dynamic wealth and cash-flow intelligence")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @Operation(summary = "Get overall dashboard summary metrics")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        DashboardSummaryResponse summary = dashboardService.getSummary(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Dashboard summary retrieved", summary));
    }

    @GetMapping("/category-breakdown")
    @Operation(summary = "Get spending breakdown partitioned by category")
    public ResponseEntity<ApiResponse<List<CategoryBreakdownResponse>>> getCategoryBreakdown(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<CategoryBreakdownResponse> breakdown = dashboardService.getCategoryBreakdown(userDetails.getId(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok("Category breakdown retrieved", breakdown));
    }

    @GetMapping("/monthly-trends")
    @Operation(summary = "Get multi-month cash flow and savings trends")
    public ResponseEntity<ApiResponse<List<MonthlyTrendResponse>>> getMonthlyTrends(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "6") int months
    ) {
        List<MonthlyTrendResponse> trends = dashboardService.getMonthlyTrends(userDetails.getId(), months);
        return ResponseEntity.ok(ApiResponse.ok("Monthly trends retrieved", trends));
    }
}
