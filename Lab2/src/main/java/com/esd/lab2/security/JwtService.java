package com.esd.lab2.security;

import com.esd.lab2.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

/**
 * S2 & S3 — JWT token generation, parsing, and cryptographic verification.
 *
 * Uses jjwt 0.12.x APIs.
 */
@Component
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationSeconds;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-seconds:900}") long expirationSeconds
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationSeconds = expirationSeconds;
    }

    /**
     * S2: Generates a signed JWT containing standard and custom claims.
     * Claims: sub (email), role (STUDENT or ADMIN), jti (random UUID), iat, exp.
     */
    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusSeconds(expirationSeconds);
        String jti = UUID.randomUUID().toString();

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .id(jti)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(signingKey)
                .compact();
    }

    /**
     * S3: Cryptographically verifies signature, checks expiration, and extracts Claims payload.
     * Throws JwtException if verification fails.
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getExpirationSeconds() {
        return expirationSeconds;
    }
}

