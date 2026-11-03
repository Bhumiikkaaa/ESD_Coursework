# PROMPTS.md — AI Prompt Log

Record every prompt you send to the AI **starting from Slice 2**.  
Slice 1 is done manually — no AI. See `README.md` for the prompt template structure.

> **Rules:**
> - One prompt (+ follow-ups) per slice
> - Use the structured template from the README — free-form prompts are not allowed
> - Do not back-fill this file after the lab

---

## Example — How a good S1 prompt looks (for reference only, S1 is done manually)

```
CONTEXT
Spring Boot 3.x, Spring Security 6, Java 17+, jjwt 0.12.x. No other libraries.
Package layout:
  com.esd.lab2
  ├── config/       SecurityConfig.java, AdminSeeder.java
  ├── controller/   CourseController.java
  ├── service/      CourseService.java
  ├── dto/          CourseRequest.java, CourseResponse.java
  ├── entity/       User.java, Role.java (enum), Course.java
  ├── repository/   UserRepository.java, CourseRepository.java
  ├── exception/    ApiError.java, GlobalExceptionHandler.java,
  │                 DuplicateResourceException.java, InvalidCredentialsException.java,
  │                 ResourceNotFoundException.java
  └── security/     JsonAuthenticationEntryPoint.java, JsonAccessDeniedHandler.java


TASK
Implement only POST /api/auth/signup.
Request: SignupRequest { email (valid email, required), password (required, 8–64 chars),
         fullName (required, not blank, max 100) }.
Response: 201 with UserResponse { id, email, fullName, role, createdAt }.
The new user's role is always STUDENT, even if the request contains a role field.
Store email trimmed and lowercased. Hash the password with the existing PasswordEncoder bean.
If the email already exists, throw DuplicateResourceException.

ALLOWED TO CREATE OR CHANGE
dto/SignupRequest.java, dto/UserResponse.java,
service/AuthService.java (signup method only),
controller/AuthController.java (signup endpoint only)

RULES
- Do not create or modify any file not listed above.
- Use the existing exceptions in com.esd.lab2.exception. Do not create new error classes.
- Use DTOs for request and response. Never return an entity from a controller.
- Use jakarta.validation annotations for input validation.
- Use only APIs that exist in Spring Security 6 and jjwt 0.12. No deprecated methods.
- If something is unclear, add a TODO comment instead of guessing.

OUTPUT
Each file in full, with its path. Then a list of anything you assumed.
```

---

## Slice 2 — Login & JWT (S2)

**Prompt 1:**

```
CONTEXT
Spring Boot 3.x, Spring Security 6, Java 17+, jjwt 0.12.x. No other libraries.
Package layout:
  com.esd.lab2
  ├── config/       SecurityConfig.java, AdminSeeder.java
  ├── controller/   CourseController.java, AuthController.java
  ├── service/      CourseService.java, AuthService.java
  ├── dto/          CourseRequest.java, CourseResponse.java, SignupRequest.java, UserResponse.java
  ├── entity/       User.java, Role.java (enum), Course.java
  ├── repository/   UserRepository.java, CourseRepository.java
  ├── exception/    ApiError.java, GlobalExceptionHandler.java,
  │                 DuplicateResourceException.java, InvalidCredentialsException.java,
  │                 ResourceNotFoundException.java
  └── security/     JsonAuthenticationEntryPoint.java, JsonAccessDeniedHandler.java

Existing code you must use (do not rewrite it):
- UserRepository (findByEmail, existsByEmail)
- PasswordEncoder bean in SecurityConfig
- InvalidCredentialsException (401)
- Role enum: STUDENT, ADMIN

TASK
Implement only POST /api/auth/login and JWT token generation.
Contract:
- Request: LoginRequest { email: required, valid email; password: required }
- Success: 200 with LoginResponse { accessToken: String, tokenType: "Bearer", expiresIn: <seconds> }
- Error: 401 with identical message "Invalid email or password" for both unknown email and wrong password.
- JWT specification:
  Signed with HS256 using key decoded from base64 property `jwt.secret`.
  Expiration duration from property `jwt.expiration-seconds`.
  Claims: sub = email, role = user's role name, jti = random UUID, iat = now, exp = now + duration.
  Must use JJWT 0.12.x modern API (.subject(), .claim(), .id(), .issuedAt(), .expiration(), .signWith(key)).

ALLOWED TO CREATE OR CHANGE
dto/LoginRequest.java
dto/LoginResponse.java
security/JwtService.java (token generation and secret loading)
service/AuthService.java (login method)
controller/AuthController.java (login endpoint)

RULES
- Do not create or modify any file not listed above.
- Use the existing exceptions in com.esd.lab2.exception. Do not create new error classes.
- Use DTOs for request and response. Never return an entity from a controller.
- Use jakarta.validation annotations for input validation.
- Use only modern APIs that exist in Spring Security 6 and jjwt 0.12. No deprecated methods (no setSubject, no setExpiration, no parserBuilder, no signWith(SignatureAlgorithm, ...)).
- Do not implement token parsing yet (that is S3).
- Do not touch SecurityConfig yet.

OUTPUT
Each file in full, with its path. Then a list of anything you assumed.
```

**Follow-up (if any):**

```
Ensure expiresIn in LoginResponse reads the configured expiration-seconds property rather than hardcoding a numeric value.
```

---

## Slice 3 — JWT Filter & Protected API (S3)

**Prompt 1:**

```
CONTEXT
Spring Boot 3.x, Spring Security 6, Java 17+, jjwt 0.12.x. No other libraries.
Package layout:
  com.esd.lab2
  ├── config/       SecurityConfig.java, AdminSeeder.java
  ├── controller/   CourseController.java, AuthController.java
  ├── service/      CourseService.java, AuthService.java
  ├── dto/          LoginRequest.java, LoginResponse.java, SignupRequest.java, UserResponse.java
  ├── entity/       User.java, Role.java, Course.java
  ├── repository/   UserRepository.java, CourseRepository.java
  ├── exception/    ApiError.java, GlobalExceptionHandler.java, ...
  └── security/     JwtService.java, JsonAuthenticationEntryPoint.java, JsonAccessDeniedHandler.java

Existing code you must use (do not rewrite it):
- JwtService (already has signing key and generateToken)
- JsonAuthenticationEntryPoint, JsonAccessDeniedHandler
- UserRepository
- UserResponse

TASK
Implement:
1. Token parsing and verification in JwtService using JJWT 0.12 API (Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()).
2. JwtAuthenticationFilter extending OncePerRequestFilter. Intercept Authorization: Bearer <token>, parse claims, and populate SecurityContextHolder with UsernamePasswordAuthenticationToken using authority "ROLE_" + role. Clear context on error and continue filterChain.doFilter without writing response directly.
3. Configure SecurityFilterChain in SecurityConfig: disable CSRF, STATELESS session policy, permit public endpoints (POST /api/auth/signup, POST /api/auth/login, GET /api/courses), require authentication for any other request, wire JsonAuthenticationEntryPoint and JsonAccessDeniedHandler via exceptionHandling, add JwtAuthenticationFilter before UsernamePasswordAuthenticationFilter.
4. Protected endpoint GET /api/users/me in UserController returning 200 UserResponse for the authenticated user, or 401 when no valid token is present.

ALLOWED TO CREATE OR CHANGE
security/JwtService.java (parseToken method)
security/JwtAuthenticationFilter.java
config/SecurityConfig.java (filterChain bean)
controller/UserController.java (GET /api/users/me)

RULES
- Spring Security 6 style only: lambda DSL, requestMatchers, authorizeHttpRequests. No WebSecurityConfigurerAdapter, antMatchers, authorizeRequests, or .and().
- permitAll must strictly cover only public endpoints, never broad /api/**.
- Authorities must use "ROLE_" prefix.
- Filter must not swallow errors or write its own responses; clear SecurityContext and continue chain.
- UserController must return UserResponse, never the User entity.

OUTPUT
Each file in full, with its path. Then a list of anything you assumed.
```

**Follow-up (if any):**

```
Ensure JwtAuthenticationFilter is NOT annotated with @Component, but instead instantiated and added directly to the filter chain in SecurityConfig, preventing double execution by the servlet container.
```

---

## Slice 4 — Role Restriction (S4)

**Prompt 1:**

```
CONTEXT
Spring Boot 3.x, Spring Security 6, Java 17+, jjwt 0.12.x. No other libraries.
Existing code you must use:
- SecurityConfig.java
- CourseController.java (POST /api/courses already returns 201 on success)
- JsonAccessDeniedHandler.java (writes 403 ApiError)
- JwtAuthenticationFilter sets authority "ROLE_" + role

TASK
Restrict course creation (POST /api/courses) to ADMIN role only.
Contract:
- POST /api/courses with valid ADMIN token: 201 Created.
- POST /api/courses with valid STUDENT token: 403 Forbidden with ApiError JSON.
- POST /api/courses with no token: 401 Unauthorized with ApiError JSON.

ALLOWED TO CREATE OR CHANGE
config/SecurityConfig.java (add role rule only)

RULES
- Add .requestMatchers(HttpMethod.POST, "/api/courses").hasRole("ADMIN") immediately before .anyRequest().authenticated().
- The diff must be minimal. Do not rewrite or restructure the rest of SecurityConfig.
- Do not modify CourseController or add new security dependencies.

OUTPUT
File in full with its path, and the exact diff.
```

**Follow-up (if any):**

```
Confirmed that authority "ROLE_ADMIN" set in S3 matches hasRole("ADMIN") without modifying authority prefixes.
```

---

## Slice 5 — Logout *(stretch, S5)*

**Prompt 1:**

```
CONTEXT
Spring Boot 3.x, Spring Security 6, Java 17+, jjwt 0.12.x. No other libraries.
Existing code you must use:
- AuthController.java
- JwtAuthenticationFilter.java
- JwtService.java

TASK
Implement server-side token revocation on logout.
Contract:
- POST /api/auth/logout with valid Bearer token: returns 204 No Content.
- Subsequent calls with the same token to protected endpoints must return 401 Unauthorized.
- Implementation details:
  1. Create TokenDenylist as an in-memory thread-safe @Component using ConcurrentHashMap<String, Instant>. Methods: revoke(jti, expiry), isRevoked(jti), cleanExpired().
  2. In AuthController, add POST /api/auth/logout. Extract token from Authorization header, parse claims to get jti and exp, register in TokenDenylist, clear SecurityContextHolder, return 204 No Content.
  3. In JwtAuthenticationFilter, inject TokenDenylist. After parsing claims, check tokenDenylist.isRevoked(jti). If revoked, clear SecurityContextHolder and continue filter chain without setting authentication.
  4. Ensure POST /api/auth/logout requires authentication (is not in permitAll).

ALLOWED TO CREATE OR CHANGE
security/TokenDenylist.java
controller/AuthController.java (logout endpoint)
security/JwtAuthenticationFilter.java (denylist verification)
config/SecurityConfig.java (pass TokenDenylist to filter)

RULES
- Logout must change server state (token denylist), not merely rely on client discarding the token.
- Denylist must be keyed by jti (UUID), not email or user id.
- Use ConcurrentHashMap for thread safety.

OUTPUT
Each file in full, with its path. Then a list of anything you assumed.
```

**Follow-up (if any):**

```
Ensure TokenDenylist.isRevoked() removes expired entries upon lookup to keep map size bounded.
```
