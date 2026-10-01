package com.expense.tracker.auth;

import com.expense.tracker.auth.dto.AuthResponse;
import com.expense.tracker.auth.dto.LoginRequest;
import com.expense.tracker.auth.dto.RegisterRequest;
import com.expense.tracker.auth.entity.RefreshToken;
import com.expense.tracker.auth.repository.RefreshTokenRepository;
import com.expense.tracker.auth.service.AuthService;
import com.expense.tracker.common.exception.BadRequestException;
import com.expense.tracker.security.JwtUtils;
import com.expense.tracker.user.entity.User;
import com.expense.tracker.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "jwtRefreshExpirationMs", 604800000L);
    }

    @Test
    void register_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Alex Vance")
                .email("alex@example.com")
                .password("StrongPassword123!")
                .build();

        User savedUser = User.builder()
                .id(UUID.randomUUID())
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash("hashed-password")
                .currency("USD")
                .build();

        RefreshToken refreshToken = RefreshToken.builder()
                .tokenHash("mock-token-hash")
                .expiryDate(Instant.now().plusSeconds(3600))
                .build();

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtils.generateAccessToken(any(User.class))).thenReturn("mock-access-token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(refreshToken);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("alex@example.com", response.getUser().getEmail());
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequest() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Alex Vance")
                .email("duplicate@example.com")
                .password("StrongPassword123!")
                .build();

        when(userRepository.existsByEmail("duplicate@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
    }
}
