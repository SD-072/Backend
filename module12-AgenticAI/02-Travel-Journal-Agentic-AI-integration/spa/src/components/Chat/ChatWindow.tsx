import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getChatHistory, streamChatMessage } from '@/data';
import type { ChatMessage } from '@/types';
import ChatForm from './ChatForm';
import ChatMessages from './ChatMessages';

const CHAT_STORAGE_KEY = 'travelJournalChatId';

const ChatWindow = () => {
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(() => localStorage.getItem(CHAT_STORAGE_KEY));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!chatId) return;

      try {
        const chat = await getChatHistory(chatId);
        setMessages(chat.history);
      } catch (error) {
        localStorage.removeItem(CHAT_STORAGE_KEY);
        setChatId(null);

        if (error instanceof Error) toast.error(error.message);
      }
    };

    void loadHistory();
  }, [chatId]);

  // reset handler
  const handleNewChat = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setChatId(null);
    setMessages([]);
  };

  // chat send handler
  const handleSend = async (prompt: string) => {
    const userMessage: ChatMessage = {
      _id: crypto.randomUUID(),
      role: 'user',
      content: prompt
    };
    const assistantMessage: ChatMessage = {
      _id: crypto.randomUUID(),
      role: 'assistant',
      content: ''
    };

    setMessages(previous => [...previous, userMessage, assistantMessage]);
    setLoading(true);
    try {
      // Calls streamChatMessage.
      const result = await streamChatMessage({
        prompt,
        chatId,
        // As AI tokens arrive, it adds them to the assistant bubble.
        onToken: token => {
          setMessages(previous =>
            previous.map(message =>
              message._id === assistantMessage._id
                ? { ...message, content: message.content + token }
                : message
            )
          );
        }
      });

      if (result.chatId) {
        // Saves the returned chatId in localStorage.
        localStorage.setItem(CHAT_STORAGE_KEY, result.chatId);
        setChatId(result.chatId);
      }
    } catch (error) {
      setMessages(previous => previous.filter(message => message._id !== assistantMessage._id));

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send message');
      }
    } finally {
      // Stops loading when finished.
      setLoading(false);
    }
  };
  return (
    <section className='w-[min(92vw,30rem)] rounded-lg border border-base-300 bg-base-100 p-4 shadow-xl'>
      <div className='mb-3'>
        <h2 className='text-lg font-bold'>Travel assistant</h2>
      </div>
      <ChatMessages chatRef={chatRef} messages={messages} />
      <ChatForm loading={loading} onNewChat={handleNewChat} onSend={handleSend} />
    </section>
  );
};

export default ChatWindow;
