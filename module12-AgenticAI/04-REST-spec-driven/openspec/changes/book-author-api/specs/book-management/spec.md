## ADDED Requirements

### Requirement: Create book
The system SHALL allow authenticated users to create a book with title, ISBN, publication year, genre, author reference, and description. The ISBN SHALL be unique.

#### Scenario: Successful book creation
- **WHEN** an authenticated user submits a POST request to `/api/books` with valid book data
- **THEN** the system returns 201 with the created book details

#### Scenario: Create book with duplicate ISBN
- **WHEN** an authenticated user submits a POST request to `/api/books` with an ISBN that already exists
- **THEN** the system returns 409 Conflict with an error message

#### Scenario: Create book without authentication
- **WHEN** an unauthenticated user submits a POST request to `/api/books`
- **THEN** the system returns 401 Unauthorized

#### Scenario: Create book with invalid data
- **WHEN** an authenticated user submits a POST request to `/api/books` with missing required fields
- **THEN** the system returns 400 Bad Request with validation errors

### Requirement: List books with pagination
The system SHALL return a paginated list of books. The response SHALL include metadata: total count, current page, total pages, and page size.

#### Scenario: List books with default pagination
- **WHEN** a user submits a GET request to `/api/books`
- **THEN** the system returns 200 with a list of books (default page 1, limit 10) and pagination metadata

#### Scenario: List books with custom pagination
- **WHEN** a user submits a GET request to `/api/books?page=2&limit=5`
- **THEN** the system returns 200 with 5 books from page 2 and correct pagination metadata

#### Scenario: List books with invalid pagination params
- **WHEN** a user submits a GET request to `/api/books?page=-1&limit=abc`
- **THEN** the system returns 400 Bad Request with validation errors

### Requirement: Search books
The system SHALL support full-text search on books across title, genre, and description fields using a `?search=` query parameter.

#### Scenario: Search books by title
- **WHEN** a user submits a GET request to `/api/books?search=harry`
- **THEN** the system returns 200 with books matching "harry" in title, genre, or description

#### Scenario: Search books with pagination
- **WHEN** a user submits a GET request to `/api/books?search=potter&page=1&limit=5`
- **THEN** the system returns 200 with search results respecting pagination parameters

### Requirement: Get single book
The system SHALL return a single book by its ID, including populated author data.

#### Scenario: Get existing book
- **WHEN** a user submits a GET request to `/api/books/:id` with a valid book ID
- **THEN** the system returns 200 with the book details and populated author

#### Scenario: Get non-existent book
- **WHEN** a user submits a GET request to `/api/books/:id` with a non-existent ID
- **THEN** the system returns 404 Not Found

#### Scenario: Get book with invalid ID format
- **WHEN** a user submits a GET request to `/api/books/:id` with an invalid MongoDB ObjectId
- **THEN** the system returns 400 Bad Request

### Requirement: Update book
The system SHALL allow authenticated users to update a book's fields.

#### Scenario: Successful book update
- **WHEN** an authenticated user submits a PUT request to `/api/books/:id` with valid update data
- **THEN** the system returns 200 with the updated book details

#### Scenario: Update non-existent book
- **WHEN** an authenticated user submits a PUT request to `/api/books/:id` with a non-existent ID
- **THEN** the system returns 404 Not Found

#### Scenario: Update book without authentication
- **WHEN** an unauthenticated user submits a PUT request to `/api/books/:id`
- **THEN** the system returns 401 Unauthorized

### Requirement: Delete book
The system SHALL allow authenticated users to delete a book.

#### Scenario: Successful book deletion
- **WHEN** an authenticated user submits a DELETE request to `/api/books/:id` with a valid book ID
- **THEN** the system returns 200 with a success message

#### Scenario: Delete non-existent book
- **WHEN** an authenticated user submits a DELETE request to `/api/books/:id` with a non-existent ID
- **THEN** the system returns 404 Not Found

#### Scenario: Delete book without authentication
- **WHEN** an unauthenticated user submits a DELETE request to `/api/books/:id`
- **THEN** the system returns 401 Unauthorized