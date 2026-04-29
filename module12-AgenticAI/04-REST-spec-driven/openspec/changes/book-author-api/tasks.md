## 1. Project Setup

- [x] 1.1 Initialize Node.js project with TypeScript configuration (tsconfig.json)
- [x] 1.2 Install dependencies: express, mongoose, jsonwebtoken, bcrypt, zod, cookie-parser, dotenv, cors, and their type definitions (all @latest)
- [x] 1.3 Install dev dependencies: vitest, supertest, tsx, @types/supertest (all @latest)
- [x] 1.4 Create project folder structure: `src/models/`, `src/routes/`, `src/controllers/`, `src/services/`, `src/middleware/`, `src/utils/`, `src/config/`, `src/tests/`
- [x] 1.5 Create base Express app setup in `src/app.ts`
- [x] 1.6 Create server entry point in `src/index.ts` with MongoDB connection
- [x] 1.7 Add npm scripts: dev, build, start, test
- [x] 1.8 Create `.env.example` with MongoDB URI, JWT secrets, and port configuration
- [x] 1.9 Create Vitest configuration file

## 2. Database Models

- [x] 2.1 Create User model (`src/models/User.ts`) with email, password (hashed), role fields and timestamps
- [x] 2.2 Create Author model (`src/models/Author.ts`) with name, bio, birthDate, nationality and timestamps
- [x] 2.3 Create Book model (`src/models/Book.ts`) with title, isbn, publicationYear, genre, author (ref), description, timestamps, and text index
- [x] 2.4 Create RefreshToken model (`src/models/RefreshToken.ts`) for refresh token rotation storage

## 3. Authentication & Authorization

- [x] 3.1 Create Zod validation schemas for auth inputs (register, login) in `src/utils/validation.ts`
- [x] 3.2 Create auth service (`src/services/authService.ts`) with register, login, logout, refreshToken logic
- [x] 3.3 Create auth controller (`src/controllers/authController.ts`) with register, login, logout, refresh handlers
- [x] 3.4 Create auth routes (`src/routes/auth.ts`)
- [x] 3.5 Create authentication middleware (`src/middleware/auth.ts`) to verify JWT from cookies
- [x] 3.6 Create JWT utility functions (`src/utils/jwt.ts`) for token generation and verification (access + refresh tokens)
- [x] 3.7 Create cookie helper (`src/utils/cookies.ts`) for setting/clearing secure cookie options

## 4. Author Management

- [x] 4.1 Create Zod validation schemas for author inputs in `src/utils/validation.ts`
- [x] 4.2 Create author service (`src/services/authorService.ts`) with CRUD operations
- [x] 4.3 Create author controller (`src/controllers/authorController.ts`)
- [x] 4.4 Create author routes (`src/routes/authors.ts`)
- [x] 4.5 Register author routes in the Express app

## 5. Book Management

- [x] 5.1 Create Zod validation schemas for book inputs (including pagination and search query params) in `src/utils/validation.ts`
- [x] 5.2 Create book service (`src/services/bookService.ts`) with CRUD, pagination, and search operations
- [x] 5.3 Create book controller (`src/controllers/bookController.ts`)
- [x] 5.4 Create book routes (`src/routes/books.ts`)
- [x] 5.5 Register book routes in the Express app

## 6. Error Handling & Middleware

- [x] 6.1 Create global error handler middleware (`src/middleware/errorHandler.ts`) with proper error response formatting
- [x] 6.2 Create Zod validation middleware (`src/middleware/validate.ts`) for request body, query, and params validation
- [x] 6.3 Create async handler wrapper (`src/utils/asyncHandler.ts`) to catch async errors

## 7. Test Configuration & Helpers

- [x] 7.1 Create test setup file (`src/tests/setup.ts`) with in-memory MongoDB via mongodb-memory-server (or test database connection)
- [x] 7.2 Create test helper utilities: test app factory, auth token generators, seed data factories

## 8. Integration Tests: Auth

- [x] 8.1 Write tests for user registration (success, duplicate email, invalid email, weak password)
- [x] 8.2 Write tests for user login (success, wrong password, non-existent email)
- [x] 8.3 Write tests for user logout
- [x] 8.4 Write tests for token refresh and refresh token rotation

## 9. Integration Tests: Authors

- [x] 9.1 Write tests for author creation (success, unauthenticated, invalid data)
- [x] 9.2 Write tests for listing authors (with and without data)
- [x] 9.3 Write tests for getting a single author (existing, non-existent, invalid ID)
- [x] 9.4 Write tests for updating an author (success, non-existent, unauthenticated)
- [x] 9.5 Write tests for deleting an author (success, non-existent, unauthenticated)

## 10. Integration Tests: Books

- [x] 10.1 Write tests for book creation (success, duplicate ISBN, unauthenticated, invalid data)
- [x] 10.2 Write tests for listing books with pagination (default, custom, invalid params)
- [x] 10.3 Write tests for searching books (by title/genre/description, with pagination)
- [x] 10.4 Write tests for getting a single book (existing with populated author, non-existent, invalid ID)
- [x] 10.5 Write tests for updating a book (success, non-existent, unauthenticated)
- [x] 10.6 Write tests for deleting a book (success, non-existent, unauthenticated)