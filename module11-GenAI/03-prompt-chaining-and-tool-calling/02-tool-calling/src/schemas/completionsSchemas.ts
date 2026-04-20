import { z } from 'zod';

export const PromptBodySchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt cannot exceed 1000 characters'),
  stream: z.boolean().optional().default(false),
});

export const IntentSchema = z.object({
  isPokemon: z.boolean().describe('Whether the user is asking about one specific Pokemon'),
  pokemonName: z
    .string()
    .nullable()
    .describe('The exact Pokemon name if the prompt is about one Pokemon, otherwise null.'), // required field, value  = string | null
  reason: z.string().describe('Short user-facing reason for the classification'),
});

export const FinalResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  aboutSpecies: z.string(),
  types: z.array(z.string()),
  abilities: z.array(z.string()),
  abilitiesExplained: z.string(),
  frontSpriteURL: z.url().nullable(),
});
