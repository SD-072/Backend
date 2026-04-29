import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Author schemas
export const createAuthorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  birthDate: z.string().optional(),
  nationality: z.string().optional(),
});

export const updateAuthorSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  birthDate: z.string().optional(),
  nationality: z.string().optional(),
});

// Book schemas
export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publicationYear: z.number().int().optional(),
  genre: z.string().optional(),
  author: z.string().min(1, 'Author ID is required'),
  description: z.string().optional(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  isbn: z.string().min(1).optional(),
  publicationYear: z.number().int().optional(),
  genre: z.string().optional(),
  author: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const objectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format'),
});