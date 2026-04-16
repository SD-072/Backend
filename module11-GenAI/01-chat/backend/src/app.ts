import cors from 'cors';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import mongoose from 'mongoose';
import { OpenAI } from 'openai/client.js';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import z from 'zod';

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;

interface ChatDocument extends mongoose.Document {
  history: ChatMessage[];
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not set');
}
await mongoose.connect(mongoUri, { dbName: 'chat' });

const Chat = mongoose.model(
  'chat',
  new mongoose.Schema<ChatDocument>({
    history: {
      type: [Object],
      default: [],
    },
  }),
);

const client = new OpenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});
// const client = new OpenAI();
// const client = new OpenAI({ apiKey: 'ollama', baseURL: 'http://127.0.0.1:11434/v1' });

const port = Number(process.env.PORT ?? 8080);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Running' });
});

app.post('/messages', async (req, res) => {
  const { prompt, chatId } = req.body;

  const chat = chatId ? await Chat.findById(chatId) : await Chat.create({ history: [] });
  // console.log('Chat', chat);

  if (!chat) {
    throw Error('Chat not found', { cause: { status: 404 } });
  }
  const userMessage = { role: 'user', content: prompt } as ChatMessage;

  const result = await client.chat.completions.create({
    model: 'gemini-3.1-flash-lite-preview',
    messages: [
      // { role: 'system', content: 'answer briefly' },
      ...chat.history,
      userMessage,
    ],
    // reasoning_effort: 'minimal',
    // temperature: 0.7,
    // max_completion_tokens: 400,
    // verbosity: 'low'
  });

  const answer = result.choices[0]?.message;

  if (!answer?.content) {
    throw Error('No answer returned');
  }

  chat.history = [...chat.history, userMessage, answer];

  await chat.save();

  res.json({ result: answer.content, chatId: chat._id });
});

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

app.use('/{*splat}', () => {
  throw Error('Page not found', { cause: { status: 404 } });
});

app.use(((err, _req, res, _next) => {
  console.log(err);
  res.status(err.cause?.status || 500).json({ message: err.message });
}) satisfies ErrorRequestHandler);

app.listen(port, () => console.log(`AI Proxy listening on port ${port}`));
