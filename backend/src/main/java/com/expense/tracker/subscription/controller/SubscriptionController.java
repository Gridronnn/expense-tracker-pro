package com.expense.tracker.subscription.controller;

import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.security.UserDetailsImpl;
import com.expense.tracker.subscription.dto.SubscriptionRequest;
import com.expense.tracker.subscription.dto.SubscriptionResponse;
import com.expense.tracker.subscription.dto.SubscriptionStatusRequest;
import com.expense.tracker.subscription.service.SubscriptionService;
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
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "Endpoints for managing recurring subscriptions and billing cycles")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    @Operation(summary = "Get all active and recurring subscriptions for authenticated user")
    public ResponseEntity<ApiResponse<List<SubscriptionResponse>>> getSubscriptions(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        List<SubscriptionResponse> subs = subscriptionService.getSubscriptionsForUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Subscriptions retrieved successfully", subs));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subscription by ID")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> getSubscriptionById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        SubscriptionResponse sub = subscriptionService.getSubscriptionById(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Subscription retrieved successfully", sub));
    }

    @PostMapping
    @Operation(summary = "Create recurring subscription")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> createSubscription(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody SubscriptionRequest request
    ) {
        SubscriptionResponse sub = subscriptionService.createSubscription(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Subscription created successfully", sub));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update subscription")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> updateSubscription(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody SubscriptionRequest request
    ) {
        SubscriptionResponse sub = subscriptionService.updateSubscription(userDetails.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Subscription updated successfully", sub));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update subscription active/paused status")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> updateStatus(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id,
            @Valid @RequestBody SubscriptionStatusRequest request
    ) {
        SubscriptionResponse sub = subscriptionService.updateStatus(userDetails.getId(), id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Status updated successfully", sub));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete subscription")
    public ResponseEntity<ApiResponse<Void>> deleteSubscription(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable("id") UUID id
    ) {
        subscriptionService.deleteSubscription(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Subscription deleted successfully", null));
    }
}
