package com.expense.tracker.category.service;

import com.expense.tracker.category.dto.CategoryRequest;
import com.expense.tracker.category.dto.CategoryResponse;
import com.expense.tracker.category.entity.Category;
import com.expense.tracker.category.repository.CategoryRepository;
import com.expense.tracker.common.exception.BadRequestException;
import com.expense.tracker.common.exception.ResourceNotFoundException;
import com.expense.tracker.common.exception.UnauthorizedException;
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
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesForUser(UUID userId) {
        return categoryRepository.findAllAvailableForUser(userId).stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(UUID userId, CategoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (categoryRepository.existsByNameIgnoreCaseAndUserId(request.getName().trim(), userId)) {
            throw new BadRequestException("A category with this name already exists");
        }

        Category category = Category.builder()
                .user(user)
                .name(request.getName().trim())
                .icon(request.getIcon() != null ? request.getIcon() : "Tag")
                .color(request.getColor() != null ? request.getColor() : "#111111")
                .type(request.getType() != null ? request.getType().toUpperCase() : "EXPENSE")
                .system(false)
                .build();

        category = categoryRepository.save(category);
        return CategoryResponse.fromEntity(category);
    }

    @Transactional
    public CategoryResponse updateCategory(UUID userId, UUID categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        if (category.isSystem()) {
            throw new BadRequestException("System default categories cannot be modified");
        }

        if (category.getUser() == null || !category.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this category");
        }

        category.setName(request.getName().trim());
        if (request.getIcon() != null) category.setIcon(request.getIcon());
        if (request.getColor() != null) category.setColor(request.getColor());
        if (request.getType() != null) category.setType(request.getType().toUpperCase());

        category = categoryRepository.save(category);
        return CategoryResponse.fromEntity(category);
    }

    @Transactional
    public void deleteCategory(UUID userId, UUID categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));

        if (category.isSystem()) {
            throw new BadRequestException("System default categories cannot be deleted");
        }

        if (category.getUser() == null || !category.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this category");
        }

        categoryRepository.delete(category);
    }
}
