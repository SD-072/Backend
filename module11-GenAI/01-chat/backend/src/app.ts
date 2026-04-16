import cors from 'cors';
import type { ErrorRequestHandler } from 'express';
import express from 'express';

import mongoose from 'mongoose';
import OpenAI from 'openai';

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not set');
}
await mongoose.connect(mongoUri, { dbName: 'chat' });

const Chat = mongoose.model(
  'chat',
  new mongoose.Schema({
    history: {
      type: Array,
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

const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Running' });
});

app.post('/messages', async (req, res) => {
  const { prompt, chatId } = req.body;

  let chat;

  if (!chatId) {
    chat = await Chat.create({ history: [] });
  } else {
    chat = await Chat.findById(chatId);
  }
  // console.log('Chat', chat);

  if (!chat) {
    throw Error('Chat not found', { cause: { status: 404 } });
  }
  const userMessage = { role: 'user', content: prompt };

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

  if (!answer) {
    throw Error('Mo answer returned');
  }

  chat.history = [...chat.history, userMessage, answer];

  await chat.save();

  res.json({ result: answer.content, chatId: chat._id });
});

app.post('/images', async (req, res) => {
  const { prompt } = req.body;
  // ...
});

app.use('/{*splat}', () => {
  throw Error('Page not found', { cause: { status: 404 } });
});

app.use(((err, _req, res, _next) => {
  console.log(err);
  res.status(err.cause?.status || 500).json({ message: err.message });
}) satisfies ErrorRequestHandler);

app.listen(port, () => console.log(`AI Proxy listening on port ${port}`));
