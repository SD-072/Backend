import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';
import {
  createTestUser,
  createTestAuthor,
  generateAuthToken,
} from './helpers';

describe('Authors - Create', () => {
  it('should create an author successfully with auth', async () => {
    const user = await createTestUser();

    const res = await request(app)
      .post('/api/authors')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({ name: 'J.K. Rowling', nationality: 'British' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('J.K. Rowling');
    expect(res.body.nationality).toBe('British');
  });

  it('should return 401 without auth', async () => {
    const res = await request(app)
      .post('/api/authors')
      .send({ name: 'J.K. Rowling' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 with invalid data', async () => {
    const user = await createTestUser();

    const res = await request(app)
      .post('/api/authors')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('Authors - List', () => {
  it('should list authors sorted alphabetically', async () => {
    await createTestAuthor({ name: 'Zebra Author' });
    await createTestAuthor({ name: 'Alpha Author' });

    const res = await request(app).get('/api/authors');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Alpha Author');
    expect(res.body[1].name).toBe('Zebra Author');
  });

  it('should return empty array when no authors exist', async () => {
    const res = await request(app).get('/api/authors');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('Authors - Get Single', () => {
  it('should get an existing author', async () => {
    const author = await createTestAuthor({ name: 'Get Me' });

    const res = await request(app).get(`/api/authors/${author._id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Get Me');
  });

  it('should return 404 for non-existent author', async () => {
    const res = await request(app).get('/api/authors/000000000000000000000000');

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 for invalid ID format', async () => {
    const res = await request(app).get('/api/authors/invalid-id');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('Authors - Update', () => {
  it('should update an author successfully', async () => {
    const user = await createTestUser();
    const author = await createTestAuthor({ name: 'Old Name' });

    const res = await request(app)
      .put(`/api/authors/${author._id}`)
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({ name: 'New Name' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  it('should return 404 for non-existent author', async () => {
    const user = await createTestUser();

    const res = await request(app)
      .put('/api/authors/000000000000000000000000')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`)
      .send({ name: 'New Name' });

    expect(res.status).toBe(404);
  });

  it('should return 401 without auth', async () => {
    const author = await createTestAuthor({ name: 'No Auth' });

    const res = await request(app)
      .put(`/api/authors/${author._id}`)
      .send({ name: 'Hacked' });

    expect(res.status).toBe(401);
  });
});

describe('Authors - Delete', () => {
  it('should delete an author successfully', async () => {
    const user = await createTestUser();
    const author = await createTestAuthor({ name: 'Delete Me' });

    const res = await request(app)
      .delete(`/api/authors/${author._id}`)
      .set('Cookie', `accessToken=${generateAuthToken(user)}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  it('should return 404 for non-existent author', async () => {
    const user = await createTestUser();

    const res = await request(app)
      .delete('/api/authors/000000000000000000000000')
      .set('Cookie', `accessToken=${generateAuthToken(user)}`);

    expect(res.status).toBe(404);
  });

  it('should return 401 without auth', async () => {
    const author = await createTestAuthor({ name: 'No Auth Delete' });

    const res = await request(app).delete(`/api/authors/${author._id}`);

    expect(res.status).toBe(401);
  });
});