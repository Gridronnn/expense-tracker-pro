package com.expense.tracker.subscription.service;

import com.expense.tracker.category.entity.Category;
import com.expense.tracker.category.repository.CategoryRepository;
import com.expense.tracker.common.exception.ResourceNotFoundException;
import com.expense.tracker.common.exception.UnauthorizedException;
import com.expense.tracker.subscription.dto.SubscriptionRequest;
import com.expense.tracker.subscription.dto.SubscriptionResponse;
import com.expense.tracker.subscription.entity.Subscription;
import com.expense.tracker.subscription.repository.SubscriptionRepository;
import com.expense.tracker.user.entity.User;
import com.expense.tracker.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> getSubscriptionsForUser(UUID userId) {
        return subscriptionRepository.findAllByUserIdOrderByRenewalDateAsc(userId).stream()
                .map(SubscriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionById(UUID userId, UUID id) {
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        if (!sub.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this subscription");
        }

        return SubscriptionResponse.fromEntity(sub);
    }

    @Transactional
    public SubscriptionResponse createSubscription(UUID userId, SubscriptionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        Subscription sub = Subscription.builder()
                .user(user)
                .category(category)
                .name(request.getName().trim())
                .amount(request.getAmount())
                .billingCycle(request.getBillingCycle() != null ? request.getBillingCycle().toUpperCase() : "MONTHLY")
                .renewalDate(request.getRenewalDate())
                .color(request.getColor() != null ? request.getColor() : "#D9CEFF")
                .icon(request.getIcon() != null ? request.getIcon() : "Repeat")
                .status(request.getStatus() != null ? request.getStatus().toUpperCase() : "ACTIVE")
                .build();

        sub = subscriptionRepository.save(sub);
        return SubscriptionResponse.fromEntity(sub);
    }

    @Transactional
    public SubscriptionResponse updateSubscription(UUID userId, UUID id, SubscriptionRequest request) {
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        if (!sub.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to update this subscription");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            sub.setCategory(category);
        } else {
            sub.setCategory(null);
        }

        sub.setName(request.getName().trim());
        sub.setAmount(request.getAmount());
        if (request.getBillingCycle() != null) sub.setBillingCycle(request.getBillingCycle().toUpperCase());
        sub.setRenewalDate(request.getRenewalDate());
        if (request.getColor() != null) sub.setColor(request.getColor());
        if (request.getIcon() != null) sub.setIcon(request.getIcon());
        if (request.getStatus() != null) sub.setStatus(request.getStatus().toUpperCase());

        sub = subscriptionRepository.save(sub);
        return SubscriptionResponse.fromEntity(sub);
    }

    @Transactional
    public SubscriptionResponse updateStatus(UUID userId, UUID id, String status) {
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        if (!sub.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this subscription");
        }

        sub.setStatus(status.toUpperCase());
        sub = subscriptionRepository.save(sub);
        return SubscriptionResponse.fromEntity(sub);
    }

    @Transactional
    public void deleteSubscription(UUID userId, UUID id) {
        Subscription sub = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with ID: " + id));

        if (!sub.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this subscription");
        }

        subscriptionRepository.delete(sub);
    }
}
