package com.esd.lab2.dto;

import com.esd.lab2.entity.Role;
import java.time.Instant;

/**
 * S1 — Response DTO for a User. Returned by signup and GET /api/users/me.
 *
 * Rules:
 *   - Never include passwordHash in this DTO.
 *   - Map directly from the User entity fields.
 */
public record UserResponse(
        Long id,
        String email,
        String fullName,
        Role role,
        Instant createdAt
) {}

