package com.esd.lab2.dto;

/**
 * S2 — Login response DTO.
 *
 * Returned by POST /api/auth/login on successful authentication.
 */
public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn
) {
    public LoginResponse(String accessToken, long expiresIn) {
        this(accessToken, "Bearer", expiresIn);
    }
}

