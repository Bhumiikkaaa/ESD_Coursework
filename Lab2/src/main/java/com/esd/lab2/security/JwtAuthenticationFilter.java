package com.esd.lab2.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * S3 & S5 — JWT authentication filter.
 *
 * Intercepts requests, validates Authorization: Bearer <token>, checks token denylist,
 * and populates SecurityContextHolder with user identity and authorities.
 * Not annotated with @Component to avoid double registration by the servlet container.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenDenylist tokenDenylist;

    public JwtAuthenticationFilter(JwtService jwtService, TokenDenylist tokenDenylist) {
        this.jwtService = jwtService;
        this.tokenDenylist = tokenDenylist;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            try {
                Claims claims = jwtService.parseToken(token);
                String jti = claims.getId();

                // S5: Denylist check
                if (tokenDenylist != null && tokenDenylist.isRevoked(jti)) {
                    SecurityContextHolder.clearContext();
                } else {
                    String email = claims.getSubject();
                    String role = claims.get("role", String.class);

                    if (email != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(email, null, List.of(authority));
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (JwtException | IllegalArgumentException ex) {
                // Invalid or expired token: clear context and let Spring Security handle it
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}

