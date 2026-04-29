import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';
import {
  createTestUser,
  createTestAuthor,
  createTestBook,
  generateAuthToken,
} from './helpers';

describe('Books - Create', () => {
  it('should create a book successfully with auth', async () => {
    const user = await createTestUser();
    const author = await createTestAuthor();

    const res = await request(app)
      .post('/api/books')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({ title: 'Harry Potter', isbn: '978-0-7475-3269-9', author: author._id });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Harry Potter');
    expect(res.body.author).toBeDefined();
  });

  it('should return 409 for duplicate ISBN', async () => {
    const user = await createTestUser();
    const author = await createTestAuthor();
    await createTestBook(author._id.toString(), { isbn: '978-0-0000-0000-1' });

    const res = await request(app)
      .post('/api/books')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({ title: 'Another Book', isbn: '978-0-0000-0000-1', author: author._id });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('ISBN');
  });

  it('should return 401 without auth', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'No Auth Book', isbn: '978-0-0000-0000-2' });

    expect(res.status).toBe(401);
  });

  it('should return 400 with invalid data', async () => {
    const user = await createTestUser();

    const res = await request(app)
      .post('/api/books')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('Books - List with Pagination', () => {
  it('should return books with default pagination', async () => {
    const author = await createTestAuthor();
    await createTestBook(author._id.toString(), { title: 'Book 1', isbn: '978-0-0000-0001-1' });

    const res = await request(app).get('/api/books');

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(10);
    expect(res.body.pagination.total).toBe(1);
  });

  it('should return books with custom pagination', async () => {
    const author = await createTestAuthor();
    await createTestBook(author._id.toString(), { title: 'Book A', isbn: '978-0-0000-0002-1' });
    await createTestBook(author._id.toString(), { title: 'Book B', isbn: '978-0-0000-0002-2' });

    const res = await request(app).get('/api/books?page=1&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  it('should return 400 for invalid pagination params', async () => {
    const res = await request(app).get('/api/books?page=-1&limit=abc');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('Books - Search', () => {
  it('should search books by title', async () => {
    const author = await createTestAuthor();
    await createTestBook(author._id.toString(), { title: 'Harry Potter', isbn: '978-0-0000-0003-1' });
    await createTestBook(author._id.toString(), { title: 'Lord of the Rings', isbn: '978-0-0000-0003-2' });

    const res = await request(app).get('/api/books?search=potter');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toContain('Harry');
  });

  it('should search books with pagination', async () => {
    const author = await createTestAuthor();
    await createTestBook(author._id.toString(), { title: 'Potter 1', isbn: '978-0-0000-0004-1' });
    await createTestBook(author._id.toString(), { title: 'Potter 2', isbn: '978-0-0000-0004-2' });

    const res = await request(app).get('/api/books?search=potter&page=1&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.pagination.total).toBe(2);
  });
});

describe('Books - Get Single', () => {
  it('should get an existing book with populated author', async () => {
    const author = await createTestAuthor({ name: 'Populated Author' });
    const book = await createTestBook(author._id.toString(), { title: 'Populated Book' });

    const res = await request(app).get(`/api/books/${book._id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Populated Book');
    expect(res.body.author).toBeDefined();
    expect(res.body.author.name).toBe('Populated Author');
  });

  it('should return 404 for non-existent book', async () => {
    const res = await request(app).get('/api/books/000000000000000000000000');

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/books/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('Books - Update', () => {
  it('should update a book successfully', async () => {
    const user = await createTestUser();
    const author = await createTestAuthor();
    const book = await createTestBook(author._id.toString(), { title: 'Old Title' });

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({ title: 'New Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Title');
  });

  it('should return 404 for non-existent book', async () => {
    const user = await createTestUser();

    const res = await request(app)
      .put('/api/books/000000000000000000000000')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({ title: 'Ghost' });

    expect(res.status).toBe(404);
  });

  it('should return 401 without auth', async () => {
    const author = await createTestAuthor();
    const book = await createTestBook(author._id.toString());

    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .send({ title: 'Hacked' });

    expect(res.status).toBe(401);
  });
});

describe('Books - Delete', () => {
  it('should delete a book successfully', async () => {
    const user = await createTestUser();
    const author = await createTestAuthor();
    const book = await createTestBook(author._id.toString());

    const res = await request(app)
      .delete(`/api/books/${book._id}`)
      .set('Cookie', `accessToken=${generateAuthToken(user)}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  it('should return 404 for non-existent book', async () => {
    const user = await createTestUser();

    const res = await request(app)
      .delete('/api/books/000000000000000000000000')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 without auth', async () => {
    const author = await createTestAuthor();
    const book = await createTestBook(author._id.toString());

    const res = await request(app).delete(`/api/books/${book._id}`);

    expect(res.status).toBe(401);
  });
});