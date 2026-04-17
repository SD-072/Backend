import type { ReactNode, SubmitEventHandler } from 'react';
import { useState } from 'react';
import './App.css';
import Markdown, { type ReactRenderer } from 'marked-react';
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream';

import Lowlight from 'react-lowlight';

import 'react-lowlight/common';
import 'highlight.js/styles/night-owl.css';

const languageAliases: Record<string, string> = {
	js: 'javascript',
	ts: 'typescript',
	sh: 'bash',
	shell: 'bash',
};

const renderer = {
	code(this: ReactRenderer, snippet: ReactNode, lang?: string) {
		const normalizedLang = lang ? (languageAliases[lang] ?? lang) : undefined;

		const language =
			normalizedLang && Lowlight.hasLanguage(normalizedLang) ? normalizedLang : 'bash';

		return (
			<Lowlight key={this.elementId} language={language} value={String(snippet)} markers={[]} />
		);
	},
};

function App() {
	const [pending, setPending] = useState(false);
	const [prompt, setPrompt] = useState('');
	const [chatId, setChatId] = useState<string | null>('');
	const [aiResponse, setAiResponse] = useState('');

	const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();

		setAiResponse('');

		try {
			setPending(true);
			const res = await fetch('http://localhost:8080/messages/streaming', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(chatId && { 'x-chat-id': chatId }),
				},
				body: JSON.stringify({ prompt }),
			});

			if (!res.ok) {
				throw new Error(await res.text());
			}
			if (!res.body) throw new Error('Request failed');

			setChatId(res.headers.get('x-chat-id'));

			const runner = ChatCompletionStream.fromReadableStream(res.body);

			runner.on('content', (delta) => {
				setAiResponse((p) => p + delta);
			});
			// direct update
			// setterStateFunction("Renke")
			// function update
			// setterStateFunction(p=> p + newValueICareWhatWeHadBeforeInState)

			await runner.finalChatCompletion();

			// const data = await res.json();
			// // console.log(data);
			// setAiResponse(data.result);
			// setChatId(data.chatId);
		} catch (error) {
			console.error('Error ', error);
		} finally {
			setPending(false);
		}
	};

	const reset = () => {
		setAiResponse('');
		setPrompt('');
		setChatId('');
	};

	return (
		<main className='mx-auto flex h-screen w-5xl flex-col items-center p-2'>
			<form onSubmit={handleSubmit} className='flex w-full items-end gap-2' inert={pending}>
				<textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					placeholder={'State your question...'}
					className='textarea textarea-primary h-40 flex-10/12 resize-none'
				/>
				<div className='flex flex-2/12 flex-col gap-2'>
					<button type='submit' className='btn btn-primary' disabled={pending}>
						{pending ?
							<span className='loading loading-spinner' />
						:	<span>Send</span>}
					</button>
					<button className='btn btn-secondary' type='reset' onClick={reset}>
						Clear
					</button>
				</div>
			</form>
			<div className='mockup-window my-4 w-full flex-1 overflow-y-auto border px-4 text-start'>
				<Markdown value={aiResponse} renderer={renderer} />
			</div>
		</main>
	);
}

export default App;
