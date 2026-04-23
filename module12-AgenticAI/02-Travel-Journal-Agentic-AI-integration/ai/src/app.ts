import cors from 'cors';
import express from 'express';
import '#db';
import { CLIENT_BASE_URL, PORT } from '#config';
import { errorHandler, notFoundHandler } from '#middleware';
import { chatRoutes } from '#routes';

const app = express();

app.use(
  cors({
    origin: CLIENT_BASE_URL,
    exposedHeaders: ['WWW-Authenticate', 'x-chat-id']
  })
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Travel Journal AI server is running' });
});

app.use('/ai', chatRoutes);

app.use('*splat', notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log(`AI Server listening on http://localhost:${PORT}`));
