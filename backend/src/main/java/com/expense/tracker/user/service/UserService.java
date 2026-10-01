package com.expense.tracker.user.service;

import com.expense.tracker.common.exception.ResourceNotFoundException;
import com.expense.tracker.user.dto.UserResponse;
import com.expense.tracker.user.entity.User;
import com.expense.tracker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, String name, String currency, String timezone, String profileImageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
        }
        if (currency != null && !currency.trim().isEmpty()) {
            user.setCurrency(currency.trim());
        }
        if (timezone != null && !timezone.trim().isEmpty()) {
            user.setTimezone(timezone.trim());
        }
        if (profileImageUrl != null) {
            user.setProfileImageUrl(profileImageUrl);
        }

        user = userRepository.save(user);
        return UserResponse.fromEntity(user);
    }
}
