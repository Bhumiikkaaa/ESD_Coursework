package com.esd.lab2.service;

import com.esd.lab2.dto.LoginRequest;
import com.esd.lab2.dto.LoginResponse;
import com.esd.lab2.dto.SignupRequest;
import com.esd.lab2.dto.UserResponse;
import com.esd.lab2.entity.Role;
import com.esd.lab2.entity.User;
import com.esd.lab2.exception.DuplicateResourceException;
import com.esd.lab2.exception.InvalidCredentialsException;
import com.esd.lab2.repository.UserRepository;
import com.esd.lab2.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Authentication service handling user registration (S1) and login (S2).
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    /**
     * S1: Registers a new user with default role STUDENT.
     * Normalized email, checks for duplicates, hashes password using injected encoder.
     */
    public UserResponse signup(SignupRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered");
        }

        String hashedPassword = passwordEncoder.encode(request.password());

        User user = new User();
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPasswordHash(hashedPassword);
        user.setRole(Role.STUDENT);

        user = userRepository.save(user);
        return toResponse(user);
    }

    /**
     * S2: Verifies credentials and issues a signed JWT.
     * Throws InvalidCredentialsException with identical message on any failure.
     */
    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return new LoginResponse(token, "Bearer", jwtService.getExpirationSeconds());
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
