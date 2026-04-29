## Why

Building a RESTful API for managing books and authors that provides a robust, production-ready backend service. This enables users to browse and search books, manage author information, and provides authenticated access for content management. The API serves as a backend for a book catalog application with role-based access control.

## What Changes

- New REST API built with Express and TypeScript
- Full CRUD operations for **books** and **authors** resources
- Pagination and search functionality for books
- JWT-based authentication with secure cookie transmission
- Role-based access control (User/Admin)
- Input/output validation using Zod
- MongoDB with Mongoose for data persistence
- Integration tests with Vitest and Supertest

## Capabilities

### New Capabilities

- `user-auth`: User registration, login, JWT token management, role-based authorization (User/Admin)
- `book-management`: CRUD operations for books with pagination, full-text search, and author references
- `author-management`: CRUD operations for authors

### Modified Capabilities

*(None - this is a greenfield project)*

## Impact

- **New codebase**: Express + TypeScript project to be created from scratch
- **New dependencies**: express, mongoose, jsonwebtoken, zod, bcrypt, vitest, supertest, and their type definitions. Install latest versions, e.g. `npm i xxx@latest`
- **Infrastructure**: Requires a running MongoDB instance for development/testing
- **No existing code affected** as this is a new project