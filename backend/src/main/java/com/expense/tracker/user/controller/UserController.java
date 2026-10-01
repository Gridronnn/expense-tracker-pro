package com.expense.tracker.user.controller;

import com.expense.tracker.common.response.ApiResponse;
import com.expense.tracker.security.UserDetailsImpl;
import com.expense.tracker.user.dto.UserResponse;
import com.expense.tracker.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing user preferences and profiles")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserResponse user = userService.getUserProfile(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile settings")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody Map<String, String> updates
    ) {
        UserResponse updated = userService.updateProfile(
                userDetails.getId(),
                updates.get("name"),
                updates.get("currency"),
                updates.get("timezone"),
                updates.get("profileImageUrl")
        );
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
