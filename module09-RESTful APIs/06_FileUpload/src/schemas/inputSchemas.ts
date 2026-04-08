import z from 'zod';

// # Zod input schemas
// * These schemas are the API boundary: only validated client input reaches the controllers.
export const userInputSchema = z.strictObject({
  firstName: z
    .string({ error: 'firstName must be a string' })
    .min(2, { error: 'firstName must be at least 2 chars long' })
    .max(50, { error: 'firstName must be at most 50 chars long' }),

  lastName: z
    .string({ error: 'lastName must be a string' })
    .min(2, { error: 'lastName must be at least 2 chars long' })
    .max(50, { error: 'lastName must be at most 50 chars long' }),

  email: z
    .email({ error: 'email must be a valid email address' })
    .max(254, { error: 'email must be at most 254 chars long' }),
});

export const postInputSchema = z.strictObject({
  title: z
    .string({ error: 'title must be a string' })
    .min(5, { error: 'title must be at least 5 characters long' })
    .max(120, { error: 'title must be at most 120 characters long' }),

  content: z
    .string({ error: 'content must be a string' })
    .min(5, { error: 'content must be at least 5 characters long' })
    .max(10000, { error: 'content must be at most 10000 characters long' }),

  author: z
    .string({ error: 'Author must be a string' })
    .min(24, { message: 'author (userId) is required' }),
  // .regex(/^[a-f\d]{24}$/i, { error: 'author must be a valid userId' }),

  // ! Do not accept createdAt/updatedAt from clients; Mongoose owns timestamps.
  // createdAt: z.date().optional();
  // updatedAt: z.date().optional();
});

// * The update schema reuses postInputSchema but removes author because the route only edits title/content.
export const postUpdateSchema = postInputSchema.omit({ author: true });
