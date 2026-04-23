import Markdown from 'marked-react';
import type { ChatMessage } from '@/types';

type ChatBubbleProps = {
  message: ChatMessage;
};

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`chat ${isAssistant ? 'chat-start' : 'chat-end'}`}>
      <div className='chat-header mb-1 text-xs opacity-70'>
        {isAssistant ? 'Travel assistant' : 'You'}
      </div>
      <div
        className={`chat-bubble chat-markdown max-w-[86%] leading-relaxed ${
          isAssistant ? 'chat-bubble-secondary' : 'chat-bubble-primary'
        }`}
      >
        {message.content ? (
          <Markdown value={message.content} gfm breaks openLinksInNewTab />
        ) : (
          <span className='loading loading-dots loading-sm' />
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
