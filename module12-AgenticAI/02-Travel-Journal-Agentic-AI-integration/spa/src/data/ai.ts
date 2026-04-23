import { VITE_APP_AI_SERVER_URL } from '@/config';
import type { ChatHistory, StreamChatBody, StreamChatResult } from '@/types';

type StreamChatOptions = StreamChatBody & {
  onToken: (token: string) => void;
};

const getErrorMessage = async (res: Response) => {
  try {
    const data = (await res.json()) as { message?: string };
    return data.message ?? 'Something went wrong';
  } catch {
    return 'Something went wrong';
  }
};

// Streaming request
export const streamChatMessage = async ({
  chatId,
  onToken,
  prompt
  // {
  // prompt: string,
  // chatId?: string | null
  // onToken: (token: string) -> void
  // }
}: StreamChatOptions): Promise<StreamChatResult> => {
  const accessToken = localStorage.getItem('accessToken');

  const res = await fetch(`${VITE_APP_AI_SERVER_URL}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    },

    body: JSON.stringify({ prompt, chatId })
    // {
    //  prompt: "new user message"
    //  chatId: existing chat id or null
    // }
  });

  if (!res.ok) throw new Error(await getErrorMessage(res));
  if (!res.body) throw new Error('The AI server did not return a stream');

  const nextChatId = res.headers.get('x-chat-id');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let completion = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const token = decoder.decode(value, { stream: true });
    completion += token;
    onToken(token);
  }

  completion += decoder.decode();

  return {
    chatId: nextChatId,
    completion
  };
};

// histroy function
export const getChatHistory = async (chatId: string): Promise<ChatHistory> => {
  const accessToken = localStorage.getItem('accessToken');

  const res = await fetch(`${VITE_APP_AI_SERVER_URL}/history/${chatId}`, {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    }
  });

  if (!res.ok) throw new Error(await getErrorMessage(res));

  return (await res.json()) as ChatHistory;
};
