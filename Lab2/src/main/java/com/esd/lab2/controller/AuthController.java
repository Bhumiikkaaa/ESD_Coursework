package com.esd.lab2.controller;

import com.esd.lab2.dto.LoginRequest;
import com.esd.lab2.dto.LoginResponse;
import com.esd.lab2.dto.SignupRequest;
import com.esd.lab2.dto.UserResponse;
import com.esd.lab2.security.JwtService;
import com.esd.lab2.security.TokenDenylist;
import com.esd.lab2.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

/**
 * Controller handling authentication endpoints under /api/auth.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final TokenDenylist tokenDenylist;

    public AuthController(
            AuthService authService,
            JwtService jwtService,
            TokenDenylist tokenDenylist
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.tokenDenylist = tokenDenylist;
    }

    /**
     * A1 — POST /api/auth/signup
     * Public endpoint. Returns 201 Created with UserResponse.
     */
    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        UserResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * A2 — POST /api/auth/login
     * Public endpoint. Returns 200 OK with LoginResponse (accessToken, tokenType, expiresIn).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * A3 — POST /api/auth/logout
     * Logged-in endpoint. Server-side token invalidation using in-memory denylist.
     * Returns 204 No Content on success.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7).trim();
        try {
            Claims claims = jwtService.parseToken(token);
            String jti = claims.getId();
            Date expiration = claims.getExpiration();
            if (jti != null && expiration != null) {
                tokenDenylist.revoke(jti, expiration.toInstant());
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SecurityContextHolder.clearContext();
        return ResponseEntity.noContent().build();
    }
}
