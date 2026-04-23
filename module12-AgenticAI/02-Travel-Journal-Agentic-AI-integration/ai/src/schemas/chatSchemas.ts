import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const promptSchema = z.strictObject({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt cannot exceed 1000 characters'),
  chatId: z
    .string()
    .refine(value => isValidObjectId(value), 'Invalid chat id')
    .nullish()
});

// FE sends:
// {
// prompt: string,
// chatId?: string | null
// }
