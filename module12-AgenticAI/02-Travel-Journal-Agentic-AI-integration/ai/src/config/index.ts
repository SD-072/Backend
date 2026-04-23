import { z } from 'zod';

const envSchema = z.object({
  MONGO_URI: z.url({ protocol: /mongodb/ }),
  DB_NAME: z.string().default('travel-journal'),
  PORT: z.coerce.number().int().default(5050),
  CLIENT_BASE_URL: z.url().default('http://localhost:5173'),
  ACCESS_JWT_SECRET: z
    .string({
      error: 'ACCESS_JWT_SECRET is required and must match the auth-server secret'
    })
    .min(64),
  AI_API_KEY: z.string().min(1, 'AI_API_KEY is required'),
  AI_BASE_URL: z.url().optional(),
  AI_MODEL: z.string().min(1, 'AI_MODEL is required'),
  AI_CHEAP_MODEL: z.string().min(1, 'AI_CHEAP_MODEL is required').optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:\n', z.prettifyError(parsedEnv.error));
  process.exit(1);
}

export const {
  ACCESS_JWT_SECRET,
  AI_API_KEY,
  AI_BASE_URL,
  AI_MODEL,
  CLIENT_BASE_URL,
  DB_NAME,
  MONGO_URI,
  PORT
} = parsedEnv.data;

export const AI_CHEAP_MODEL = parsedEnv.data.AI_CHEAP_MODEL ?? parsedEnv.data.AI_MODEL;
