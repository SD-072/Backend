import { type SubmitEventHandler, useState } from 'react';

type ChatFormProps = {
  loading: boolean;
  onNewChat: () => void;
  onSend: (prompt: string) => Promise<void>;
};

const ChatForm = ({ loading, onNewChat, onSend }: ChatFormProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || loading) return;

    await onSend(trimmedPrompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className='mt-3 space-y-3'>
      <textarea
        value={prompt}
        onChange={event => setPrompt(event.target.value)}
        disabled={loading}
        placeholder='Ask about your next trip...'
        className='textarea textarea-bordered min-h-24 w-full resize-none'
      />
      <div className='grid grid-cols-[1fr_auto] gap-2'>
        <button className='btn btn-primary' type='submit' disabled={loading || !prompt.trim()}>
          {loading ? <span className='loading loading-spinner loading-sm' /> : 'Send'}
        </button>
        <button className='btn btn-ghost' type='button' disabled={loading} onClick={onNewChat}>
          New
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
