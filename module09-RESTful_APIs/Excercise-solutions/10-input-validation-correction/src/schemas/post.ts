import { z } from 'zod/v4';
import { isValidObjectId, Types } from 'mongoose';
import { dbEntrySchema, userInputSchema } from '#schemas';

const postInputSchema = z.strictObject({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  userId: z.string().refine(val => isValidObjectId(val), 'Invalid user ID')
});

const populatedUserSchema = z.strictObject({
  ...userInputSchema.pick({ firstName: true, lastName: true, email: true }).shape,
  _id: z.instanceof(Types.ObjectId)
});

const postSchema = z.strictObject({
  ...postInputSchema.shape,
  ...dbEntrySchema.shape,
  userId: populatedUserSchema
});

export { postInputSchema, populatedUserSchema, postSchema };
