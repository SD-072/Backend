import { useState } from 'react';

import ChatWindow from './ChatWindow';

const ChatBtn = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className='fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8'>
      {chatOpen && <ChatWindow />}
      <button
        type='button'
        className='btn btn-primary btn-circle btn-lg shadow-lg'
        aria-label={chatOpen ? 'Close travel assistant' : 'Open travel assistant'}
        onClick={() => setChatOpen(previous => !previous)}
      >
        {chatOpen ? 'x' : 'AI'}
      </button>
    </div>
  );
};

export default ChatBtn;
