# REVIEW.md — AI Output Review Log

Complete **one review entry per slice** before moving to the next.  

---

## Slice 1 — Signup (S1)

> *Note: S1 completed manually without AI, per lab instructions.*

### A. Bucket Check
List every class and method produced. Tag each one:  
`Controller` / `Service` / `Repository` / `DTO` / `Security` / `Config` / `Exception`

| File / Method | Tag | In Allowed List? |
|---|---|---|
| `dto/SignupRequest.java` | DTO | Yes (Manual) |
| `dto/UserResponse.java` | DTO | Yes (Manual) |
| `service/AuthService.java` (`signup`, `toResponse`) | Service | Yes (Manual) |
| `controller/AuthController.java` (`signup`) | Controller | Yes (Manual) |

> **Important:** Anything **not** in the allowed list → **reject, re-prompt**. Don't keep it because it works.

### B. Contract Check
Compare against API contract row A1 line by line.

| Check | Pass / Fail |
|---|---|
| Path is `POST /api/auth/signup` | Pass |
| Returns **201** | Pass |
| Response shape: `{ id, email, fullName, role, createdAt }` | Pass |
| No `passwordHash` field in response | Pass |
| Role in response is always `STUDENT` | Pass |

### C. Validation & Errors

| Check | Pass / Fail |
|---|---|
| `@Valid` on controller parameter | Pass |
| `@Email`, `@NotBlank`, `@Size` on DTO fields | Pass |
| Duplicate email throws `DuplicateResourceException` | Pass |
| No new error/response wrapper class invented | Pass |
| No stack trace or exception message leaked to client | Pass |

### D. Security Specifics

| Check | Pass / Fail |
|---|---|
| Password hashed via injected `PasswordEncoder` (not `new BCryptPasswordEncoder()`) | Pass |
| `SignupRequest` has no `role` field, or it is ignored | Pass |
| Duplicate check uses normalised (lowercased/trimmed) email | Pass |
| Did **not** touch `SecurityConfig`, add JWT class, or add `UserDetailsService` | Pass |

### E. Understanding Questions
*Answer in your own words (1–2 lines each)*

1. Where exactly is the password hashed, and why is the same password stored as a different string for two users?

    It is hashed in `AuthService.signup()` using `passwordEncoder.encode(request.password())`. BCrypt automatically creates a unique random salt for each hash, so identical passwords produce totally different hash strings, defending against rainbow table attacks.

2. What would happen if `SignupRequest` accepted a `role` field and the AI used it?

    A client could send `{"role": "ADMIN"}` in the JSON body and register as an administrator, causing an unauthorized privilege escalation.

3. Which class turns `DuplicateResourceException` into a 409 response?

    `GlobalExceptionHandler`, using the `@ExceptionHandler(DuplicateResourceException.class)` handler which catches it and returns an `ApiError` with HTTP 409 Conflict.

### F. Decision

| File | Decision | Reason (if modified/rejected) |
|---|---|---|
| `SignupRequest.java` | Accepted | Implemented manually. Added validation annotations (@NotBlank, @Email, @Size). |
| `UserResponse.java` | Accepted | Implemented manually. Excludes passwordHash and includes only public fields. |
| `AuthService.java` | Accepted | Implemented manually. Normalized email, hashed password with bean, set STUDENT role. |
| `AuthController.java` | Accepted | Implemented manually. Calls authService.signup and returns 201 Created. |

---

## Slice 2 — Login & JWT (S2)

### A. Bucket Check

| File / Method | Tag | In Allowed List? |
|---|---|---|
| `dto/LoginRequest.java` | DTO | Yes |
| `dto/LoginResponse.java` | DTO | Yes |
| `security/JwtService.java` (`generateToken`, `getExpirationSeconds`) | Security | Yes |
| `service/AuthService.java` (`login`) | Service | Yes |
| `controller/AuthController.java` (`login`) | Controller | Yes |

### B. Contract Check

| Check | Pass / Fail |
|---|---|
| Path is `POST /api/auth/login` | Pass |
| Returns **200** | Pass |
| Response: `{ accessToken, tokenType: "Bearer", expiresIn }` | Pass |
| `expiresIn` matches configured value (not hardcoded) | Pass |

### C. Validation & Errors

| Check | Pass / Fail |
|---|---|
| Same 401 message for unknown email and wrong password | Pass |
| No `try/catch` swallowing exceptions silently | Pass |

### D. Security Specifics

| Check | Pass / Fail |
|---|---|
| JWT secret comes from `@Value`, no string literal secret | Pass |
| Uses jjwt 0.12 API: `.subject()`, `.claim()`, `.id()`, `.issuedAt()`, `.expiration()`, `.signWith(key)` | Pass |
| Rejects deprecated: `setSubject`, `setExpiration`, `signWith(SignatureAlgorithm.HS256, secret)`, `Jwts.parserBuilder()` | Pass |
| `jti` is a random UUID (not the user id) | Pass |
| No password or hash in token claims | Pass |
| Parse/validate method **not** written yet (that is S3) | Pass |

### E. Understanding Questions

1. Why must the error message be identical for "no such email" and "wrong password"?

    If the messages were different, an attacker could enumerate valid emails by seeing which ones say "wrong password" vs "email not found". The generic message prevents user enumeration.

2. Who can read the claims inside your JWT? Who can change them?

    Anyone who has the token can decode and read the claims because it is unencrypted Base64URL text. But nobody can change the claims without breaking the HMAC-SHA256 signature, which requires the server's private secret.

3. What does `jti` give us that `sub` doesn't? (Think about S5.)

    `jti` uniquely identifies a single token/session. `sub` is only the user's email. If a user is logged in on multiple devices, using `jti` lets us revoke just one session on logout rather than booting them out everywhere.

### F. Decision

| File | Decision | Reason |
|---|---|---|
| `LoginRequest.java` | Accepted | Proper validation annotations for email and password. |
| `LoginResponse.java` | Accepted | Follows contract with accessToken, Bearer tokenType, and expiresIn. |
| `JwtService.java` | Accepted | Uses modern JJWT 0.12 API and loads secret from environment. |
| `AuthService.java` | Accepted | Uniform 401 message "Invalid email or password" on any failure. |
| `AuthController.java` | Accepted | Returns 200 OK with LoginResponse. |

---

## Slice 3 — JWT Filter & Protected API (S3)

### A. Bucket Check

| File / Method | Tag | In Allowed List? |
|---|---|---|
| `security/JwtService.java` (`parseToken`) | Security | Yes |
| `security/JwtAuthenticationFilter.java` (`doFilterInternal`) | Security | Yes |
| `config/SecurityConfig.java` (`filterChain`) | Config | Yes |
| `controller/UserController.java` (`getProfile`) | Controller | Yes |

### B. Contract Check

| Check | Pass / Fail |
|---|---|
| `GET /api/courses` works **without** token | Pass |
| `GET /api/users/me` returns **401** with no token | Pass |
| `GET /api/users/me` returns **200** with valid token | Pass |
| 401 body is an `ApiError` JSON object | Pass |

### C. Validation & Errors

| Check | Pass / Fail |
|---|---|
| Filter does not write a response on error — continues chain | Pass |
| Filter clears SecurityContext on bad token | Pass |

### D. Security Specifics

| Check | Pass / Fail |
|---|---|
| Spring Security 6 style: lambda DSL, `requestMatchers`, `authorizeHttpRequests` | Pass |
| Rejected: `WebSecurityConfigurerAdapter`, `antMatchers`, `authorizeRequests`, `.and()` | Pass |
| `permitAll` covers only the three specific public endpoints | Pass |
| `GET /api/courses` is public but `POST /api/courses` is NOT (watch for broad matcher) | Pass |
| Signature + expiry verified with `Jwts.parser().verifyWith(key).build().parseSignedClaims(token)` | Pass |
| Authorities use `ROLE_` prefix | Pass |
| Entry point and access-denied handler wired via `exceptionHandling(...)` | Pass |
| No `UserDetailsService`, `AuthenticationManager`, sessions or CORS added | Pass |
| `GET /api/users/me` returns `UserResponse`, not the entity | Pass |

### E. Understanding Questions

1. Why is CSRF protection disabled here, and when would disabling it be wrong?

   Our API is stateless and uses Bearer tokens in headers, which browsers do not automatically send in cross-site requests. Disabling CSRF would be dangerous if authentication used session cookies that the browser automatically attaches.

2. Walk through what happens to a request with an expired token, step by step, until the client sees 401.

   1) Request hits `JwtAuthenticationFilter`. 2) Token is extracted and parsed. 3) JJWT throws `ExpiredJwtException`. 4) Filter catches it, clears `SecurityContextHolder`, and calls `filterChain.doFilter()`. 5) Unauthenticated request reaches Spring Security's authorization filter. 6) Since the route is protected, Spring Security calls `JsonAuthenticationEntryPoint`. 7) Entry point returns 401 `ApiError` JSON.

3. Why don't 401/403 errors from the filter chain reach `GlobalExceptionHandler`?

    `GlobalExceptionHandler` only handles exceptions inside the Spring MVC controller layer. The security filter chain runs in the servlet container before requests ever reach the controller, so security errors must be handled by `AuthenticationEntryPoint` and `AccessDeniedHandler`.

### F. Decision

| File | Decision | Reason |
|---|---|---|
| `JwtService.java` | Accepted | Added parseToken using JJWT 0.12 verifyWith parser. |
| `JwtAuthenticationFilter.java` | Modified | Did not use @Component annotation so it doesn't get registered twice by Spring Boot. |
| `SecurityConfig.java` | Accepted | Lambda DSL, state stateless, entry points wired, filter added before UsernamePasswordAuthenticationFilter. |
| `UserController.java` | Accepted | Safe lookup via principal name and returns UserResponse. |

---

## Slice 4 — Role Restriction (S4)

### A. Bucket Check

| File / Method | Tag | In Allowed List? |
|---|---|---|
| `config/SecurityConfig.java` (`filterChain`) | Config | Yes |

### B. Contract Check

| Check | Pass / Fail |
|---|---|
| `POST /api/courses` with no token → **401** | Pass |
| `POST /api/courses` with STUDENT token → **403** | Pass |
| `POST /api/courses` with ADMIN token → **201** | Pass |
| 403 body is an `ApiError` JSON object | Pass |

### D. Security Specifics

| Check | Pass / Fail |
|---|---|
| Role naming consistent: `hasRole("ADMIN")` ↔ authority `ROLE_ADMIN` | Pass |
| If `@PreAuthorize` used: `@EnableMethodSecurity` is present | Pass |
| Rule placed **before** `anyRequest().authenticated()` if in SecurityConfig | Pass |
| Diff is small — AI did not rewrite the whole config | Pass |

### E. Understanding Questions

1. A STUDENT calls `POST /api/courses`. Why does the server return 403 and not 401?

    The student has a valid token, so authentication succeeds (they are logged in, so not 401). But their role is `STUDENT` and the endpoint requires `ADMIN`. Since they lack the required authority, it returns 403 Forbidden.

2. Where does the role in the JWT come from, and can the client change it?

    The role is read from the database (`user.getRole()`) when creating the token during login. The client cannot edit the role claim because tampering with the token invalidates the cryptographic signature.

### F. Decision

| File | Decision | Reason |
|---|---|---|
| `SecurityConfig.java` | Accepted | Added `.requestMatchers(HttpMethod.POST, "/api/courses").hasRole("ADMIN")` right before `.anyRequest().authenticated()`. |

---

## Slice 5 — Logout (S5) *(stretch)*

### A. Bucket Check

| File / Method | Tag | In Allowed List? |
|---|---|---|
| `security/TokenDenylist.java` | Security | Yes |
| `controller/AuthController.java` (`logout`) | Controller | Yes |
| `security/JwtAuthenticationFilter.java` (denylist check) | Security | Yes |
| `config/SecurityConfig.java` (wire denylist) | Config | Yes |

### B. Contract Check

| Check | Pass / Fail |
|---|---|
| `POST /api/auth/logout` returns **204** | Pass |
| Same token returns **401** after logout | Pass |
| Fresh login after logout returns a new working token | Pass |

### D. Security Specifics

| Check | Pass / Fail |
|---|---|
| Logout adds entry to server-side denylist (not just tells client to delete token) | Pass |
| Denylist keyed by **jti**, not email | Pass |
| Map is `ConcurrentHashMap` (thread-safe) | Pass |
| Logout endpoint is NOT under `permitAll` | Pass |
| Filter checks the denylist and treats denylisted jti as invalid | Pass |
| (Bonus) Expired entries are removed from the map | Pass |

### E. Understanding Questions

1. Why does logout need server-side state if JWT is "stateless"?

    Because JWTs are self-contained and remain valid until their expiration time, client-side deletion alone does not prevent someone from using a copied token. The server must keep track of revoked token IDs to reject them.

2. What happens to the denylist when the server restarts? What if there are two server instances?

    An in-memory denylist is wiped on restart, meaning revoked tokens would work again until expiry. In a multi-instance setup, instances don't share in-memory maps, so a centralized store like Redis would be needed.

3. Why store the expiry time with each jti?

    Once a token reaches its natural expiration timestamp, JJWT will reject it anyway. Storing the expiry allows the server to purge expired entries so the denylist doesn't keep growing in memory.

### F. Decision

| File | Decision | Reason |
|---|---|---|
| `TokenDenylist.java` | Accepted | Uses ConcurrentHashMap and provides expiry-based cleanup. |
| `AuthController.java` | Accepted | Extracts jti and expiry, records them in denylist, and returns 204. |
| `JwtAuthenticationFilter.java` | Accepted | Clears SecurityContextHolder if jti is present in denylist. |

---

## No-AI Change Tasks

> *Note: Implemented manually without AI.*

**Files changed:**

| File | What changed and why |
|---|---|
| `src/main/resources/application.yml` | Changed `jwt.expiration-seconds` from 3600 to 900 (15 minutes). |
| `src/main/java/com/esd/lab2/security/JwtService.java` | Default expiration set to 900 seconds so tokens and `expiresIn` reflect 15 mins. |
| `src/main/java/com/esd/lab2/controller/CourseController.java` | Added `GET /api/courses/{id}` calling `courseService.findById(id)` (returns 404 if missing). |
| `src/main/java/com/esd/lab2/config/SecurityConfig.java` | Added `GET /api/courses/*` to `permitAll()` so course detail is public. |
| `src/main/java/com/esd/lab2/dto/UpdateUserRequest.java` | Created request DTO validating `fullName` (@NotBlank, @Size max 100). |
| `src/main/java/com/esd/lab2/controller/UserController.java` | Added `PUT /api/users/me` to update current user's fullName only. |
| `src/main/java/com/esd/lab2/dto/SignupRequest.java` | Added `@Pattern` on password requiring at least one digit (returns 400 with field error if absent). |

**Explanation (your own words):**
> *Describe what you changed and why it works.*
>
> 1. **Token expiry:** In `application.yml`, I lowered `expiration-seconds` from 3600 to 900. `JwtService` picks up this property to set the JWT expiry 15 minutes ahead, and `LoginResponse` returns `900`.
> 2. **Course detail endpoint:** In `CourseController`, I added `@GetMapping("/{id}")` calling `courseService.findById(id)`. If the course ID does not exist, `findById` throws `ResourceNotFoundException`, which `GlobalExceptionHandler` converts to a 404 ApiError. In `SecurityConfig`, I added `.requestMatchers(HttpMethod.GET, "/api/courses/*").permitAll()`.
> 3. **Update full name:** I created `UpdateUserRequest` with validation on `fullName`. In `UserController`, I added `@PutMapping("/me")` that finds the user by their authenticated email, updates only their `fullName`, saves it, and returns the updated `UserResponse`.
> 4. **Password digit check:** In `SignupRequest`, I added `@Pattern(regexp = ".*\\d.*", message = "Password must contain at least one digit")` to `password`. If someone signs up with a password without numbers (e.g. "password"), Spring's validation catches it and returns 400 Bad Request with a field error on `password`.
> 5. **Exercise 5 (Making `GET /api/courses` protected):** If `GET /api/courses` is removed from `permitAll()`, unauthenticated requests to view courses receive HTTP 401 from `JsonAuthenticationEntryPoint`. Any automated tests asserting public catalogue access without a token (like `curl http://localhost:8080/api/courses`) and contract test row P1 would fail.
