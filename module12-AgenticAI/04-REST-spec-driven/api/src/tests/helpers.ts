ile` flaimport { User } from '../models/User';
import { Author } from '../models/Author';
import { Book } from '../models/Book';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt';

export const createTestUser = async (overrides: Partial<{ email: string; password: string; role: 'user' | 'admin' }> = {}) => {
  const user = await User.create({
    email: overrides.email || 'test@example.com',
    password: overrides.password || 'password123',
    role: overrides.role || 'user',
  });
  return user;
};

export const createTestAdmin = async () => {
  return createTestUser({ email: 'admin@example.com', role: 'admin' });
};

export const generateAuthToken = (user: { _id: any; email: string; role: string }) => {
  return generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });
};

export const generateRefreshTokenForUser = (userId: string) => {
  return generateRefreshToken({ userId, tokenId: 'test-token-id' });
};

export const createTestAuthor = async (overrides: Partial<{ name: string; bio: string; nationality: string }> = {}) => {
  return Author.create({
    name: overrides.name || 'Test Author',
    bio: overrides.bio || 'A test author biography',
    nationality: overrides.nationality || 'American',
  });
};

export const createTestBook = async (authorId: string, overrides: Partial<{ title: string; isbn: string; genre: string }> = {}) => {
  return Book.create({
    title: overrides.title || 'Test Book',
    isbn: overrides.isbn || '978-0-0000-0000-1',
    author: authorId,
    genre: overrides.genre || 'Fiction',
  });
};