package com.esd.lab2.controller;

import com.esd.lab2.dto.UpdateUserRequest;
import com.esd.lab2.dto.UserResponse;
import com.esd.lab2.entity.User;
import com.esd.lab2.exception.ResourceNotFoundException;
import com.esd.lab2.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for user profile management.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * P2 — GET /api/users/me
     * Protected endpoint. Returns the authenticated user's profile.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return ResponseEntity.ok(toResponse(user));
    }

    /**
     * PUT /api/users/me
     * Protected endpoint. Updates fullName only for the authenticated user.
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        user.setFullName(request.fullName().trim());
        User saved = userRepository.save(user);

        return ResponseEntity.ok(toResponse(saved));
    }

    // ── helper ────────────────────────────────────────────────────────────────

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
