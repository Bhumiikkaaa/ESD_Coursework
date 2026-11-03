package com.esd.lab2.security;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * S5 — In-memory server-side token denylist.
 *
 * Thread-safe store for invalidated JWT IDs (jti) mapped to their expiration timestamps.
 */
@Component
public class TokenDenylist {

    private final Map<String, Instant> denylist = new ConcurrentHashMap<>();

    /**
     * Revokes a token by storing its unique identifier (jti) and expiry timestamp.
     */
    public void revoke(String jti, Instant expiry) {
        if (jti != null && expiry != null) {
            denylist.put(jti, expiry);
        }
    }

    /**
     * Checks if a token ID has been revoked. If the entry has expired naturally,
     * it removes the entry and returns false.
     */
    public boolean isRevoked(String jti) {
        if (jti == null) {
            return false;
        }
        Instant expiry = denylist.get(jti);
        if (expiry == null) {
            return false;
        }
        if (Instant.now().isAfter(expiry)) {
            denylist.remove(jti);
            return false;
        }
        return true;
    }

    /**
     * Cleans up all entries whose expiration timestamp has passed.
     */
    public void cleanExpired() {
        Instant now = Instant.now();
        denylist.entrySet().removeIf(entry -> now.isAfter(entry.getValue()));
    }
}

