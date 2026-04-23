import { Router } from 'express';
import { createStreamingChat, getChatHistory } from '#controllers';
import { authenticate, validateBody } from '#middleware';
import { promptSchema } from '#schemas';

const chatRoutes = Router();

chatRoutes.get('/history/:id', authenticate, getChatHistory);
chatRoutes.post('/chat/stream', authenticate, validateBody(promptSchema), createStreamingChat);

export default chatRoutes;

// GET /ai/history/:id
// POST /ai/chat/stream
