package com.expense.tracker.subscription.repository;

import com.expense.tracker.subscription.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    List<Subscription> findAllByUserIdOrderByRenewalDateAsc(UUID userId);
    Optional<Subscription> findByIdAndUserId(UUID id, UUID userId);
}
