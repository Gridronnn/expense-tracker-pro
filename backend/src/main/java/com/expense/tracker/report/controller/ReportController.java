package com.expense.tracker.report.controller;

import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.report.dto.ReportSummaryResponse;
import com.expense.tracker.report.service.ReportService;
import com.expense.tracker.security.UserDetailsImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@Tag(name = "Financial Reports", description = "Endpoints for generating structured financial statements and reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    @Operation(summary = "Generate comprehensive summary report across custom date ranges")
    public ResponseEntity<ApiResponse<ReportSummaryResponse>> getSummaryReport(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        ReportSummaryResponse report = reportService.generateSummaryReport(userDetails.getId(), startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok("Summary report generated", report));
    }
}
