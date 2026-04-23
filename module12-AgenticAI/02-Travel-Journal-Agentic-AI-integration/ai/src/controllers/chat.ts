import {
  Agent,
  type AgentInputItem,
  assistant,
  type InputGuardrail,
  InputGuardrailTripwireTriggered,
  OpenAIChatCompletionsModel,
  run,
  setDefaultOpenAIClient,
  tool,
  user
} from '@openai/agents';
import type { RequestHandler } from 'express';
import { isValidObjectId, Types } from 'mongoose';
import OpenAI from 'openai';
import { z } from 'zod';
import { AI_API_KEY, AI_BASE_URL, AI_CHEAP_MODEL, AI_MODEL } from '#config';
import { Chat, Post } from '#models';
import type { promptSchema } from '#schemas';

type PromptDTO = z.infer<typeof promptSchema>;
type ChatMessageRole = 'user' | 'assistant';

type HistoryMessageDTO = {
  _id: string;
  role: ChatMessageRole;
  content: string;
};

type ChatHistoryDTO = {
  _id: string;
  history: HistoryMessageDTO[];
};

type TravelAgentContext = {
  userId?: string;
};

const client = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: AI_BASE_URL
});

setDefaultOpenAIClient(client);

const model = new OpenAIChatCompletionsModel(client, AI_MODEL);
const cheapModel = new OpenAIChatCompletionsModel(client, AI_CHEAP_MODEL);

// Tool
const travelPostsToolParameters = z.strictObject({
  limit: z.number().describe('How many recent posts to load. Use a number between 1 and 10.')
});

const getMyTravelPostsTool = tool<typeof travelPostsToolParameters, TravelAgentContext>({
  name: 'get_my_travel_posts',
  description:
    'Get recent travel journal posts written by the signed-in user for personalized recommendations.',
  parameters: travelPostsToolParameters,
  strict: true,
  async execute({ limit }, context) {
    const userId = context?.context.userId;

    if (!userId) {
      return JSON.stringify({
        signedIn: false,
        posts: [],
        message: 'The user is not signed in, so no personal travel journal posts are available.'
      });
    }

    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 10) : 5;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .select('title content image createdAt -_id')
      .lean();

    return JSON.stringify({
      signedIn: true,
      posts
    });
  }
});

// Guardrail agent
const guardrailAgent = new Agent({
  name: 'Travel Guardrail Agent',
  instructions: `We run a Travel Journal assistant.
If the newest user request is remotely about travel, journaling, destinations, packing, itinerary planning, culture, food, transportation, accommodation, or trip memories, return isNotAboutTravel: false.
Otherwise return isNotAboutTravel: true.`,
  model: cheapModel,
  modelSettings: {
    reasoning: { effort: 'minimal' },
    temperature: 0
  },
  outputType: z.object({
    isNotAboutTravel: z.boolean(),
    reasoning: z.string()
  })
});

// Input guardrail
const travelGuardrail: InputGuardrail = {
  name: 'Travel Assistant Guardrail',
  execute: async ({ input, context }) => {
    const result = await run(guardrailAgent, input, { context });

    return {
      outputInfo: result.finalOutput,
      tripwireTriggered: result.finalOutput?.isNotAboutTravel ?? false
    };
  }
};

// handoff agents
const generalizedAgent = new Agent<TravelAgentContext, 'text'>({
  name: 'General Travel Agent',
  instructions: `You are the Travel Journal assistant.
You help visitors plan trips, reflect on travel ideas, and get destination advice.
The user is not signed in, so you cannot access personal journal posts.
Say that clearly when they ask for personalized recommendations, then still give useful general travel advice.
Keep answers practical and concise.`,
  model,
  modelSettings: {
    reasoning: { effort: 'low' },
    temperature: 0.4
  }
});

const personalizedAgent = new Agent<TravelAgentContext, 'text'>({
  name: 'Personalized Travel Agent',
  instructions: `You are the Travel Journal assistant for a signed-in user.
Use get_my_travel_posts before answering when the user asks for recommendations based on their journal, past trips, preferences, or places they have been.
The tool reads the signed-in user's posts from the server. Never ask the user for a user id.
Treat journal destinations as places the user has already visited. Suggest new or nearby alternatives unless the user asks to revisit.
For general travel follow-up questions, you may answer from general knowledge.
Keep answers practical and concise.`,
  model,
  modelSettings: {
    reasoning: { effort: 'low' },
    temperature: 0.4
  },
  tools: [getMyTravelPostsTool]
});

// triage agent
const createTriageAgent = (signedIn: boolean) =>
  new Agent<TravelAgentContext, 'text'>({
    name: 'Travel Triage Agent',
    instructions: `${signedIn ? 'The user is signed in.' : 'The user is not signed in.'}
If the user is signed in, hand off to the Personalized Travel Agent.
If the user is not signed in, hand off to the General Travel Agent.
Do not answer the user directly unless a handoff is impossible.`,
    model: cheapModel,
    modelSettings: {
      reasoning: { effort: 'minimal' },
      temperature: 0
    },
    inputGuardrails: [travelGuardrail],
    handoffs: [generalizedAgent, personalizedAgent]
  });

//   helper for finding or creating the chat
const loadOrCreateChat = async (chatId: string | null | undefined, userId?: string) => {
  const owner = userId ? new Types.ObjectId(userId) : null;

  if (!chatId) {
    return Chat.create({ owner, history: [] });
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return Chat.create({ owner, history: [] });
  }

  if (chat.owner && chat.owner.toString() !== userId) {
    throw new Error('You are not allowed to open this chat.', { cause: { status: 403 } });
  }

  // If a visitor logs in during the same browser session, we can attach the old chat to the user.
  if (!chat.owner && owner) {
    chat.owner = owner;
  }

  return chat;
};

// convert saved MongoDB messages into Agents SDK input items
const toAgentInput = (
  history: { role: ChatMessageRole; content: string }[],
  prompt: string
): AgentInputItem[] => [
  ...history.map(message =>
    message.role === 'user' ? user(message.content) : assistant(message.content)
  ),
  user(prompt)
];

// Streaming endpoint
export const createStreamingChat: RequestHandler<unknown, unknown, PromptDTO> = async (
  req,
  res,
  next
) => {
  const { chatId, prompt } = req.body;
  const userId = req.user?.id;
  const chat = await loadOrCreateChat(chatId, userId);
  const agentInput = toAgentInput(chat.history, prompt); // chat.history + prompt
  const triageAgent = createTriageAgent(Boolean(userId));

  res.set({
    'content-type': 'text/plain; charset=utf-8',
    'cache-control': 'no-cache',
    'x-chat-id': chat._id.toString()
  });

  let answer = '';

  // run the agent workflow in streaming mode
  try {
    const result = await run(triageAgent, agentInput, {
      context: { userId },
      stream: true
    });
    const textStream = result.toTextStream({ compatibleWithNodeStreams: true });

    for await (const chunk of textStream) {
      const delta = chunk.toString();
      answer += delta;
      res.write(delta);
    }

    await result.completed;
  } catch (error) {
    if (error instanceof InputGuardrailTripwireTriggered) {
      answer = 'That is outside of my abilities. I only answer questions about travel.';
      res.write(answer);
    } else if (!res.headersSent) {
      next(error);
      return;
    } else {
      res.end();
      return;
    }
  }

  chat.history.push({ role: 'user', content: prompt }, { role: 'assistant', content: answer });
  await chat.save();

  res.end();
};

// Let the frontend reload the chat after a page refreshes
// GET /ai/histroy/662abc
export const getChatHistory: RequestHandler<{ id: string }, ChatHistoryDTO> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw new Error('Invalid chat id', { cause: { status: 400 } });

  const chat = await Chat.findById(id).lean();

  if (!chat) throw new Error('Chat not found', { cause: { status: 404 } });

  if (chat.owner && chat.owner.toString() !== req.user?.id) {
    throw new Error('You are not allowed to open this chat.', { cause: { status: 403 } });
  }

  res.json({
    _id: chat._id.toString(),
    history: chat.history.map(message => ({
      _id: message._id.toString(),
      role: message.role,
      content: message.content
    }))
  });
};
