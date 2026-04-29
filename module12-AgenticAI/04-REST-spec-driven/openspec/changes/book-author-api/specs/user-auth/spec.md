## ADDED Requirements

### Requirement: User can register
The system SHALL allow users to register with email and password. The system SHALL hash passwords using bcrypt before storing. New users SHALL default to the 'user' role.

#### Scenario: Successful registration
- **WHEN** a user submits a POST request to `/api/auth/register` with valid email and password
- **THEN** the system returns 201 with user details (excluding password) and sets a JWT cookie

#### Scenario: Registration with duplicate email
- **WHEN** a user submits a POST request to `/api/auth/register` with an email that already exists
- **THEN** the system returns 409 Conflict with an error message

#### Scenario: Registration with invalid email format
- **WHEN** a user submits a POST request to `/api/auth/register` with an invalid email format
- **THEN** the system returns 400 Bad Request with validation errors

#### Scenario: Registration with weak password
- **WHEN** a user submits a POST request to `/api/auth/register` with a password shorter than 6 characters
- **THEN** the system returns 400 Bad Request with validation errors

### Requirement: User can log in
The system SHALL authenticate users by verifying email and password, then issue a JWT token stored in an HTTP-only secure cookie. The JWT SHALL contain the user ID, email, and role.

#### Scenario: Successful login
- **WHEN** a user submits a POST request to `/api/auth/login` with valid credentials
- **THEN** the system returns 200 with user details and sets a JWT cookie

#### Scenario: Login with incorrect password
- **WHEN** a user submits a POST request to `/api/auth/login` with a valid email but wrong password
- **THEN** the system returns 401 Unauthorized with an error message

#### Scenario: Login with non-existent email
- **WHEN** a user submits a POST request to `/api/auth/login` with an email that does not exist
- **THEN** the system returns 401 Unauthorized with an error message

### Requirement: User can log out
The system SHALL clear the JWT cookie on logout.

#### Scenario: Successful logout
- **WHEN** an authenticated user submits a POST request to `/api/auth/logout`
- **THEN** the system clears the JWT cookie and returns 200

### Requirement: JWT with refresh token rotation
The system SHALL use refresh token rotation for enhanced security. On login, the system SHALL issue both an access token (short-lived) and a refresh token (long-lived). When the access token expires, the client SHALL use the refresh token to obtain a new access token. Each time a refresh token is used, the old refresh token SHALL be invalidated and a new one issued.

#### Scenario: Access token refresh
- **WHEN** a user submits a POST request to `/api/auth/refresh` with a valid refresh token cookie
- **THEN** the system returns a new access token and refresh token, invalidating the old refresh token

#### Scenario: Reusing an old refresh token
- **WHEN** a user submits a POST request to `/api/auth/refresh` with a refresh token that has already been used
- **THEN** the system SHALL invalidate all refresh tokens for that user (token reuse detection)

### Requirement: Role-based authorization middleware
The system SHALL provide middleware that restricts endpoint access based on user roles. Admin users SHALL have access to all endpoints. Regular users SHALL have access to authenticated endpoints.

#### Scenario: Admin accesses protected endpoint
- **WHEN** an admin user makes a request to a protected endpoint
- **THEN** the system processes the request successfully

#### Scenario: Authenticated user accesses book management endpoint
- **WHEN** an authenticated user with role 'user' makes a POST request to `/api/books`
- **THEN** the system processes the request successfully

#### Scenario: Unauthenticated user accesses protected endpoint
- **WHEN** a request without a valid JWT cookie is made to a POST/PUT/DELETE endpoint
- **THEN** the system returns 401 Unauthorized

### Requirement: Input validation with Zod
The system SHALL use Zod schemas to validate all request inputs including body, query parameters, and URL parameters.

#### Scenario: Invalid request body returns 400
- **WHEN** a request contains an invalid body (missing required fields, wrong types)
- **THEN** the system returns 400 Bad Request with Zod validation error details

#### Scenario: Invalid query parameters return 400
- **WHEN** a request contains invalid query parameters (e.g., non-numeric page value)
- **THEN** the system returns 400 Bad Request with validation error details