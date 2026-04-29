import { z } from 'zod';
import {
  registerSchema,
  loginSchema,
  createAuthorSchema,
  updateAuthorSchema,
  createBookSchema,
  updateBookSchema,
  paginationSchema,
} from '../utils/validation';

// Auth types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

// Author types
export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorInput = z.infer<typeof updateAuthorSchema>;

// Book types
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;

// Pagination
export type PaginationInput = z.infer<typeof paginationSchema>;
