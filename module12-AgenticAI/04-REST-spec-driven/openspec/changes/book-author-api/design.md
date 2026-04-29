## Context

Building a greenfield REST API for managing books and authors. The API will serve as a backend service with MongoDB persistence, JWT-based authentication, role-based access control, and full integration test coverage. The project uses Express with TypeScript and follows a layer-based architecture pattern (routes → controllers → services → models).

## Goals / Non-Goals

**Goals:**
- Provide a fully functional REST API with CRUD for books and authors
- JWT authentication with User/Admin roles, tokens transmitted via secure cookies
- Input and output validation using Zod schemas
- Pagination (`?page=1&limit=10`) and full-text search on books
- Role-based access control: GET is public, POST/PUT/DELETE require auth; Admin can do everything
- Integration tests covering all endpoints with Vitest + Supertest
- Clean, maintainable code following TypeScript best practices
- Use refresh token rotation

**Non-Goals:**
- Not building a frontend UI (API-only)
- No CI/CD pipeline configuration (out of scope)
- No deployment or Docker setup (out of scope)
- No rate limiting or API key management

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Runtime** | Node.js with Express | Lightweight, widely adopted, excellent TypeScript support |
| **Language** | TypeScript | Type safety, self-documenting code, better refactoring |
| **Database** | MongoDB with Mongoose | Flexible schema for books/authors, native JSON support, good for search |
| **Auth** | JWT with bcrypt password hashing | Stateless auth, no session store needed; bcrypt for secure password storage |
| **Token transport** | HTTP-only secure cookies | More secure than localStorage, prevents XSS token theft |
| **Validation** | Zod | TypeScript-first, composable schemas, excellent inference |
| **Testing** | Vitest + Supertest | Fast, modern test runner; Supertest for HTTP assertions |
| **Project structure** | Layer-based: `models/`, `routes/`, `controllers/`, `services/`, `middleware/`, `utils/` | Clear separation of concerns, follows Express conventions |
| **Pagination** | Query params `?page=1&limit=10` | Standard REST convention, intuitive for API consumers |
| **Search** | MongoDB text index on books | Built-in full-text search, no additional dependency needed |

## Data Models

### User
- `email`: string (unique, required)
- `password`: string (hashed with bcrypt, required)
- `role`: enum `['user', 'admin']` (default: 'user')
- `createdAt`, `updatedAt`: timestamps

### Author
- `name`: string (required)
- `bio`: string
- `birthDate`: Date
- `nationality`: string
- `createdAt`, `updatedAt`: timestamps

### Book
- `title`: string (required)
- `isbn`: string (unique, required)
- `publicationYear`: number
- `genre`: string
- `author`: ObjectId (reference to Author, required)
- `description`: string
- `createdAt`, `updatedAt`: timestamps
- Text index on: `title`, `genre`, `description`

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user (public)
- `POST /api/auth/login` — Login, returns JWT in secure cookie (public)
- `POST /api/auth/logout` — Clear cookie (authenticated)

### Books
- `GET /api/books` — List books with pagination & search (public)
- `GET /api/books/:id` — Get single book (public)
- `POST /api/books` — Create book (authenticated)
- `PUT /api/books/:id` — Update book (authenticated)
- `DELETE /api/books/:id` — Delete book (authenticated)

### Authors
- `GET /api/authors` — List authors (public)
- `GET /api/authors/:id` — Get single author (public)
- `POST /api/authors` — Create author (authenticated)
- `PUT /api/authors/:id` — Update author (authenticated)
- `DELETE /api/authors/:id` — Delete author (authenticated)

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| [MongoDB text search limitations] | Use MongoDB Atlas Search or Elasticsearch for advanced full-text if needed later |
| [JWT cannot be revoked] | Keep token expiry short (e.g., 1 hour); consider refresh tokens for production |
| [No HTTPS in development] | Set `secure: false` on cookies in dev, `true` in production |
| [Role-based logic in controllers] | Extract authorization logic into reusable middleware |
| [No request validation at Express level] | Use Zod middleware to validate `req.body`, `req.query`, `req.params` before controllers |