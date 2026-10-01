package com.expense.tracker.income.controller;

import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.income.dto.IncomeRequest;
import com.expense.tracker.income.dto.IncomeResponse;
import com.expense.tracker.income.service.IncomeService;
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

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/income")
@RequiredArgsConstructor
@Tag(name = "Income", description = "Endpoints for managing user income streams")
public class IncomeController {

    private final IncomeService incomeService;

    @GetMapping
    @Operation(summary = "Get paginated income records")
    public ResponseEntity<ApiResponse<Page<IncomeResponse>>> getIncome(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PageableDefault(size = 20, sort = "date", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<IncomeResponse> incomePage = incomeService.getIncome(userDetails.getId(), search, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Income records retrieved successfully", incomePage));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get income record by ID")
    public ResponseEntity<ApiResponse<IncomeResponse>> getIncomeById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        IncomeResponse income = incomeService.getIncomeById(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Income record retrieved successfully", income));
    }

    @PostMapping
    @Operation(summary = "Create new income record")
    public ResponseEntity<ApiResponse<IncomeResponse>> createIncome(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody IncomeRequest request
    ) {
        IncomeResponse income = incomeService.createIncome(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Income record created successfully", income));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update existing income record")
    public ResponseEntity<ApiResponse<IncomeResponse>> updateIncome(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody IncomeRequest request
    ) {
        IncomeResponse income = incomeService.updateIncome(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Income record updated successfully", income));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete income record")
    public ResponseEntity<ApiResponse<Void>> deleteIncome(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        incomeService.deleteIncome(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Income record deleted successfully", null));
    }
}
