import http, { type RequestListener, type IncomingMessage } from 'node:http';
import { isValidObjectId } from 'mongoose';
import '#db';
import { Post } from '#models';

type PostInputType = {
	content: string;
	title: string;
};

const parseJsonBody = <T>(req: IncomingMessage): Promise<T> => {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk.toString();
		});

		req.on('end', async () => {
			try {
				resolve(JSON.parse(body) as T);
			} catch (error) {
				reject(new Error('Invalid JSON'));
			}
		});
	});
};

const createResponse = (
	res: http.ServerResponse,
	statusCode: number,
	message: unknown
) => {
	res.writeHead(statusCode, { 'Content-Type': 'application/json' });
	return res.end(
		typeof message === 'string'
			? JSON.stringify({ message })
			: JSON.stringify(message)
	);
};

const requestHandler: RequestListener = async (req, res) => {
	const singlePostRegex = /^\/posts\/[0-9a-zA-Z]+$/; // Simple expression to match the pattern /posts/anything
	const { method, url } = req;
	if (url === '/posts') {
		if (method === 'GET') {
			const posts = await Post.find();
			return createResponse(res, 200, posts);
		}
		if (method === 'POST') {
			const body = await parseJsonBody<PostInputType>(req);
			// basic body validation
			if (!body.title || !body.content) {
				return createResponse(res, 400, 'Invalid request body');
			}
			const newPost = await Post.create(body);
			return createResponse(res, 201, newPost);
		}
		return createResponse(res, 405, 'Method Not Allowed');
	}
	if (singlePostRegex.test(url!)) {
		const id = url?.split('/')[2];
		if (!isValidObjectId(id)) {
			return createResponse(res, 400, 'Invalid Post ID');
		}
		if (method === 'GET') {
			const post = await Post.findById(id);

			if (!post) return createResponse(res, 404, 'Post not found');

			return createResponse(res, 200, post);
		}
		if (method === 'PUT') {
			const body = await parseJsonBody<PostInputType>(req);
			if (!body.title || !body.content) {
				return createResponse(res, 400, 'Invalid request body');
			}

			const post = await Post.findByIdAndUpdate(id, body, { new: true });

			if (!post) return createResponse(res, 404, 'Post not found');

			return createResponse(res, 200, post);
		}
		if (method === 'DELETE') {
			const post = await Post.findByIdAndDelete(id);
			// console.log(post);

			if (!post) return createResponse(res, 404, 'Post not found');
			return createResponse(res, 200, 'Post deleted');
		}
		return createResponse(res, 405, 'Method Not Allowed');
	}
	return createResponse(res, 404, 'Not Found');
};

const server = http.createServer(requestHandler);

const port = 3000;
server.listen(port, () =>
	console.log(`Server running at http://localhost:${port}/`)
);
