package com.expense.tracker.income.repository;

import com.expense.tracker.income.entity.Income;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface IncomeRepository extends JpaRepository<Income, UUID>, JpaSpecificationExecutor<Income> {

    Optional<Income> findByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT i FROM Income i WHERE i.user.id = :userId " +
           "AND (:search IS NULL OR LOWER(i.source) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:startDate IS NULL OR i.date >= :startDate) " +
           "AND (:endDate IS NULL OR i.date <= :endDate)")
    Page<Income> findWithFilters(
            @Param("userId") UUID userId,
            @Param("search") String search,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId")
    BigDecimal sumTotalByUserId(@Param("userId") UUID userId);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId AND i.date BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalByUserIdAndDateRange(@Param("userId") UUID userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Income> findTop5ByUserIdOrderByDateDescCreatedAtDesc(UUID userId);
}
