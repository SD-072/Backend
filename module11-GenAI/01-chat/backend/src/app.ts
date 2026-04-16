import cors from 'cors';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import { OpenAI } from 'openai/client.js';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import z from 'zod';

// ─── Types & Schema ───────────────────────────────────────────────────────────
// ChatMessage is the official OpenAI type for a single chat message.
// It has the shape { role: "user" | "assistant" | "system", content: "..." }.
type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

// ChatDocument extends a normal Mongoose document with a history array.
// The history stores all messages of one conversation.
interface ChatDocument extends mongoose.Document {
  history: ChatMessage[];
}

// ─── Database Connection ──────────────────────────────────────────────────────
// In a larger project, this would usually live in its own database file.
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not set');
}
await mongoose.connect(mongoUri, { dbName: 'chat' });

// The chat history is stored as an array of plain objects for simplicity.
const ChatModel = mongoose.model(
  'chat',
  new mongoose.Schema<ChatDocument>({
    history: {
      type: [Object],
      default: [],
    },
  }),
);

// ─── AI Client ────────────────────────────────────────────────────────────────
// The OpenAI client can talk to any OpenAI-compatible API.
// The commented examples show alternative providers.

// 1. Google Gemini through its OpenAI-compatible API.
const client = new OpenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});
// 2. Official OpenAI API. This reads OPENAI_API_KEY automatically.
// const client = new OpenAI();

// 3. Local model through Ollama. No real API key is required.
// const client = new OpenAI({ apiKey: 'ollama', baseURL: 'http://127.0.0.1:11434/v1' });

// ─── Express Setup ────────────────────────────────────────────────────────────
const port = Number(process.env.PORT ?? 8080);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Running' });
});

// ─── System Prompt ────────────────────────────────────────────────────────────
// The system prompt defines the assistant's personality and rules.
// It is added as the first message when a new chat starts.
const systemPrompt = {
  role: 'system',
  content:
    // 'You are a senior software architect. Never answer programming questions with code. Keep every answer under 5 sentences.',
    'You are a coding enthusiast and you like to answer with code snippets, even when they are not really needed.',
} as ChatMessage;

// ─── POST /messages ───────────────────────────────────────────────────────────
// Main endpoint for chat messages.
// Expected request body: { prompt: string, chatId?: string }
// - Without chatId: create a new chat
// - With chatId: load an existing chat from MongoDB
app.post('/messages', async (req, res) => {
  const { prompt, chatId } = req.body;

  // Load an existing chat or create a new one.
  const chat =
    chatId ? await ChatModel.findById(chatId) : await ChatModel.create({ history: [systemPrompt] });
  // console.log('Chat', chat);

  if (!chat) {
    throw Error('Chat not found', { cause: { status: 404 } });
  }
  const userMessage = { role: 'user', content: prompt } as ChatMessage;

  // Send the complete conversation history plus the new user message.
  // This is how the model gets the context of the conversation.
  const result = await client.chat.completions.create({
    model: 'gemini-3.1-flash-lite-preview',
    messages: [
      // { role: 'system', content: 'answer briefly' },
      ...chat.history,
      userMessage,
    ],
    // reasoning_effort controls how much "thinking time" reasoning models use.
    // Lower values are faster and cheaper, higher values can improve hard answers.
    // reasoning_effort: 'minimal',

    // temperature controls randomness.
    // 0 means very predictable, higher values make answers more creative.
    // temperature: 0.7,

    // max_completion_tokens limits how long the answer can be.
    // Useful to keep responses short or control costs.
    // max_completion_tokens: 400,

    // verbosity controls how detailed some models should be.
    // Low verbosity asks the model to answer more briefly.
    // verbosity: 'low'
  });

  const answer = result.choices[0]?.message;

  // The model should return one assistant message.
  if (!answer?.content) {
    throw Error('No answer returned');
  }

  // Store both the user message and the assistant answer in the chat history.
  chat.history = [...chat.history, userMessage, answer];

  await chat.save();

  // Send the answer and the chatId back to the frontend.
  res.json({ result: answer.content, chatId: chat._id });
});

// ─── POST /images ─────────────────────────────────────────────────────────────
// Creates an image from a text prompt.
app.post('/images', async (req, res) => {
  const { prompt } = req.body;

  const result = await client.images.generate({
    model: 'gpt-image-1.5',
    prompt,
    // response_format: 'b64_json',
  });

  res.json(result);
  // res.json({ b64_json: result.data[0].b64_json });
});

// ─── Structured Recipe Output ─────────────────────────────────────────────────
// Zod describes the exact JSON shape that the model should return.
const Recipe = z.object({
  title: z.string(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z
        .string()
        .describe('The quantity of the required ingredients. Use metric units if possible.'),
      estimated_cost_per_unit: z
        .number()
        .describe('The quanitity of the required ingredient in EUR cents'),
    }),
  ),
  preparation_description: z.string(),
  time_in_minutes: z.number(),
});

// ─── POST /recipes ────────────────────────────────────────────────────────────
// Asks the model for a recipe and parses the answer into the Recipe schema.
app.post('/recipes', async (req, res) => {
  const { prompt } = req.body;

  const result = await client.chat.completions.parse({
    model: 'gemini-3.1-flash-lite-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are an innovative chef, who creatively designs new recipies. You really like pepper.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: zodResponseFormat(Recipe, 'recipe'),
  });

  res.json({ recipe: result.choices[0]?.message.parsed });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use('/{*splat}', () => {
  throw Error('Page not found', { cause: { status: 404 } });
});

app.use(((err, _req, res, _next) => {
  console.log(err);
  res.status(err.cause?.status || 500).json({ message: err.message });
}) satisfies ErrorRequestHandler);

app.listen(port, () => console.log(`AI Proxy listening on port ${port}`));
