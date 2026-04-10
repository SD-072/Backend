import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { Post } from '#models';

type PostInputType = {
	content: string;
	title: string;
};

type IdParams = { id: string };

const getAllPosts: RequestHandler = async (req, res) => {
	try {
		const posts = await Post.find();
		res.json(posts);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const createPost: RequestHandler<{}, {}, PostInputType> = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).json({ error: 'Title and content are required' });
		}

		const { title, content } = req.body;

		if (!title || !content)
			return res.status(400).json({ error: 'Title and content are required' });

		const newPost = await Post.create({
			title,
			content
		} satisfies PostInputType);
		res.json(newPost);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const getPostById: RequestHandler<IdParams> = async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id))
			return res.status(400).json({ error: 'Invalid ID' });

		const post = await Post.findById(id);

		if (!post) return res.status(404).json({ error: 'Post not found' });

		res.json(post);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const updatePost: RequestHandler<IdParams, {}, PostInputType> = async (
	req,
	res
) => {
	try {
		if (!req.body) {
			return res.status(400).json({ error: 'Title and content are required' });
		}
		const { id } = req.params;
		const { title, content } = req.body;

		if (!isValidObjectId(id))
			return res.status(400).json({ error: 'Invalid ID' });

		if (!title || !content)
			return res.status(400).json({ error: 'Title and content are required' });

		const post = await Post.findByIdAndUpdate(
			id,
			{ title, content },
			{ new: true }
		);

		if (!post) return res.status(404).json({ error: 'Post not found' });

		res.json(post);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const deletePost: RequestHandler<IdParams> = async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id))
			return res.status(400).json({ error: 'Invalid ID' });

		const post = await Post.findByIdAndDelete(id);

		if (!post) return res.status(404).json({ error: 'Post not found' });

		res.json({ message: 'Post deleted' });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};

export { getAllPosts, createPost, getPostById, updatePost, deletePost };
