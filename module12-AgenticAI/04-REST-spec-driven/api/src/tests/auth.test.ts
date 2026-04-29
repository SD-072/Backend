e the import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import { createTestUser } from './helpers';

describe('Auth - Registration', () => {
  it('should register a user successfully and return 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'newuser@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('newuser@example.com');
    expect(res.body.user.password).toBeUndefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should return 409 for duplicate email', async () => {
    await createTestUser({ email: 'duplicate@example.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'duplicate@example.com', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already exists');
  });

  it('should return 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('should return 400 for weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: '12345' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});

describe('Auth - Login', () => {
  it('should login successfully and return 200', async () => {
    await createTestUser({ email: 'login@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('login@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should return 401 for wrong password', async () => {
    await createTestUser({ email: 'wrongpw@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrongpw@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});

describe('Auth - Logout', () => {
  it('should logout successfully and return 200', async () => {
    const user = await createTestUser();
    const agent = request.agent(app);

    // Login first to get cookies
    const loginRes = await agent
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(loginRes.status).toBe(200);

    // Now logout
    const res = await agent.post('/api/auth/logout');

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });
});

describe('Auth - Token Refresh', () => {
  it('should refresh tokens successfully', async () => {
    const user = await createTestUser();
    const agent = request.agent(app);

    // Login to get refresh token cookie
    const loginRes = await agent
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(loginRes.status).toBe(200);

    // Get the refresh token from the cookie
    const cookies = loginRes.headers['set-cookie'];
    expect(cookies).toBeDefined();

    // Refresh
    const refreshRes = await agent.post('/api/auth/refresh');
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.message).toBe('Tokens refreshed');
    expect(refreshRes.headers['set-cookie']).toBeDefined();
  });

  it('should detect refresh token reuse', async () => {
    const user = await createTestUser();

    // Login to get tokens
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(loginRes.status).toBe(200);

    // Extract refresh token cookie
    const cookies = loginRes.headers['set-cookie'] as unknown as string[];
    const refreshCookie = cookies.find((c: string) => c.startsWith('refreshToken='));
    expect(refreshCookie).toBeDefined();
    const refreshToken = refreshCookie!.split(';')[0].split('=')[1];

    // Use the refresh token directly
    const agent1 = request.agent(app);
    agent1.set('Cookie', [`refreshToken=${refreshToken}`]);

    const firstRefresh = await agent1.post('/api/auth/refresh');
    expect(firstRefresh.status).toBe(200);

    // Try to reuse the same refresh token - should be detected
    const agent2 = request.agent(app);
    agent2.set('Cookie', [`refreshToken=${refreshToken}`]);

    const secondRefresh = await agent2.post('/api/auth/refresh');
    expect(secondRefresh.status).toBe(401);
    expect(secondRefresh.body.error).toContain('revoked');
  });
});