package com.expense.tracker.config;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Root entrypoint with API information")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "Expense Tracker Pro - Spring Boot REST API");
        info.put("status", "UP");
        info.put("version", "1.0.0");
        info.put("frontendUrl", "https://expense-tracker-pro-sigma-sage.vercel.app");
        info.put("swaggerDocumentation", "/swagger-ui/index.html");
        info.put("healthCheck", "/api/v1/health");
        return ResponseEntity.ok(info);
    }
}
