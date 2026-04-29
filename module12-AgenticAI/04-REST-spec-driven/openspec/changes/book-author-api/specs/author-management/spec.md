## ADDED Requirements

### Requirement: Create author
The system SHALL allow authenticated users to create an author with name, bio, birth date, and nationality.

#### Scenario: Successful author creation
- **WHEN** an authenticated user submits a POST request to `/api/authors` with valid author data
- **THEN** the system returns 201 with the created author details

#### Scenario: Create author without authentication
- **WHEN** an unauthenticated user submits a POST request to `/api/authors`
- **THEN** the system returns 401 Unauthorized

#### Scenario: Create author with invalid data
- **WHEN** an authenticated user submits a POST request to `/api/authors` with missing required fields (e.g., no name)
- **THEN** the system returns 400 Bad Request with validation errors

### Requirement: List authors
The system SHALL return a list of all authors. The response SHALL be sorted alphabetically by name.

#### Scenario: List all authors
- **WHEN** a user submits a GET request to `/api/authors`
- **THEN** the system returns 200 with an array of authors sorted alphabetically by name

#### Scenario: List authors when none exist
- **WHEN** a user submits a GET request to `/api/authors` and no authors exist
- **THEN** the system returns 200 with an empty array

### Requirement: Get single author
The system SHALL return a single author by its ID.

#### Scenario: Get existing author
- **WHEN** a user submits a GET request to `/api/authors/:id` with a valid author ID
- **THEN** the system returns 200 with the author details

#### Scenario: Get non-existent author
- **WHEN** a user submits a GET request to `/api/authors/:id` with a non-existent ID
- **THEN** the system returns 404 Not Found

#### Scenario: Get author with invalid ID format
- **WHEN** a user submits a GET request to `/api/authors/:id` with an invalid MongoDB ObjectId
- **THEN** the system returns 400 Bad Request

### Requirement: Update author
The system SHALL allow authenticated users to update an author's fields.

#### Scenario: Successful author update
- **WHEN** an authenticated user submits a PUT request to `/api/authors/:id` with valid update data
- **THEN** the system returns 200 with the updated author details

#### Scenario: Update non-existent author
- **WHEN** an authenticated user submits a PUT request to `/api/authors/:id` with a non-existent ID
- **THEN** the system returns 404 Not Found

#### Scenario: Update author without authentication
- **WHEN** an unauthenticated user submits a PUT request to `/api/authors/:id`
- **THEN** the system returns 401 Unauthorized

### Requirement: Delete author
The system SHALL allow authenticated users to delete an author.

#### Scenario: Successful author deletion
- **WHEN** an authenticated user submits a DELETE request to `/api/authors/:id` with a valid author ID
- **THEN** the system returns 200 with a success message

#### Scenario: Delete non-existent author
- **WHEN** an authenticated user submits a DELETE request to `/api/authors/:id` with a non-existent ID
- **THEN** the system returns 404 Not Found

#### Scenario: Delete author without authentication
- **WHEN** an unauthenticated user submits a DELETE request to `/api/authors/:id`
- **THEN** the system returns 401 Unauthorized