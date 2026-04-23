import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { ChatMessage } from '@/types';
import ChatBubble from './ChatBubble';

type ChatMessagesProps = {
  messages: ChatMessage[];
  chatRef: RefObject<HTMLDivElement | null>;
};

const ChatMessages = ({ chatRef, messages }: ChatMessagesProps) => {
  const lastMessageContent = messages.at(-1)?.content;

  useEffect(() => {
    if (lastMessageContent === undefined) return;

    chatRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
  }, [chatRef, lastMessageContent]);

  return (
    <div
      ref={chatRef}
      className='h-88 overflow-y-auto rounded-md border border-base-300 bg-base-200/70 p-4'
    >
      {messages.length === 0 ? (
        <div className='grid h-full place-items-center text-center text-sm text-base-content/60'>
          Where should we go next?
        </div>
      ) : (
        messages.map(message => <ChatBubble key={message._id} message={message} />)
      )}
    </div>
  );
};

export default ChatMessages;
