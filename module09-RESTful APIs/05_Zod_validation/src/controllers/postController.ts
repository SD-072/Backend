import type { RequestHandler } from 'express';
import { Post } from '#models';

export const createPost: RequestHandler = async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content || !author) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newPost = await Post.create({ title, content, author });
  res.status(201).json(newPost);
};

export const getAllPosts: RequestHandler = async (req, res) => {
  const posts = await Post.find().populate(
    'author',
    'firstName lastName email',
  );

  if (!posts.length) {
    return res.status(404).json({ message: 'No posts found' });
  }

  res.status(200).json(posts);
};

export const getPostById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id).populate('author', 'firstName lastName');

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json(post);
};

export const updatePost: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, content, author },
    { new: true, runValidators: true },
  ).populate('author', 'firstName lastName');

  res.status(200).json({
    message: 'post updated successfully',
    post: updatedPost,
  });
};

export const deletePost: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const deletedPost = await Post.findByIdAndDelete(id);

  if (!deletedPost) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json({
    message: `Post with id:${id} was deleted`,
    post: deletedPost,
  });
};
