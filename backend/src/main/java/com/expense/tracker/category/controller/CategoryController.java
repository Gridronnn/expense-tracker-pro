package com.expense.tracker.category.controller;

import com.expense.tracker.category.dto.CategoryRequest;
import com.expense.tracker.category.dto.CategoryResponse;
import com.expense.tracker.category.service.CategoryService;
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
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Endpoints for managing transaction categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all available categories for the authenticated user")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        List<CategoryResponse> categories = categoryService.getCategoriesForUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Categories retrieved successfully", categories));
    }

    @PostMapping
    @Operation(summary = "Create custom category")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CategoryRequest request
    ) {
        CategoryResponse category = categoryService.createCategory(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Category created successfully", category));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update custom category")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody CategoryRequest request
    ) {
        CategoryResponse category = categoryService.updateCategory(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Category updated successfully", category));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete custom category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        categoryService.deleteCategory(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted successfully", null));
    }
}
