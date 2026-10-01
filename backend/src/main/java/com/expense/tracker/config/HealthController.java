package com.expense.tracker.config;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Health", description = "Public health check endpoint with database connectivity status")
public class HealthController {

    private final DataSource dataSource;

    @GetMapping("/health")
    @Operation(summary = "System & Database Health Status", description = "Checks API runtime and live PostgreSQL connection")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "expense-tracker-api");
        status.put("version", "1.0.0");

        boolean dbHealthy = false;
        try (Connection connection = dataSource.getConnection()) {
            dbHealthy = connection.isValid(2);
        } catch (Exception e) {
            log.warn("Database health check ping failed: {}", e.getMessage());
        }

        status.put("database", dbHealthy ? "UP" : "DOWN");
        status.put("status", dbHealthy ? "UP" : "DEGRADED");

        HttpStatus httpStatus = dbHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
        return ResponseEntity.status(httpStatus).body(status);
    }
}
