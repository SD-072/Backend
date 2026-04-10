import { type RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import { Post } from '#models';
import type { z } from 'zod/v4';
import type { postInputSchema, populatedUserSchema, postSchema } from '#schemas';
import { isValidObjectId, type Types } from 'mongoose';

type PostInputDTO = z.infer<typeof postInputSchema>;
type PostDTO = z.infer<typeof postSchema>;
type PopulatedUserDTO = z.infer<typeof populatedUserSchema>;

type IdParams = { id: string };

const getPosts: RequestHandler<{}, PostDTO[]> = async (req, res) => {
  const posts = await Post.find().populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email').lean();
  res.json(posts);
};

const createPost: RequestHandler<{}, PostDTO, PostInputDTO> = async (req, res) => {
  const post = await Post.create(req.body satisfies PostInputDTO);

  const populatedPost = await post.populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email');

  res.status(201).json(populatedPost);
};

const getPostById: RequestHandler<IdParams, PostDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const post = await Post.findById(id).populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email');

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });

  res.json(post);
};

const updatePost: RequestHandler<IdParams, PostDTO, PostInputDTO> = async (req, res) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = req;

  const post = await Post.findById(id);

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });

  post.title = title;
  post.content = content;
  post.userId = userId as unknown as Types.ObjectId;

  await post.save();

  const populatedPost = await post.populate<{ userId: PopulatedUserDTO }>('userId', 'firstName lastName email');
  res.json(populatedPost);
};

const deletePost: RequestHandler<IdParams, { message: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid ID', { cause: { status: 400 } });
  const post = await Post.findByIdAndDelete(id);

  if (!post) throw new Error('Post not found', { cause: { status: 404 } });

  res.json({ message: 'Post deleted' });
};

export { getPosts, createPost, getPostById, updatePost, deletePost };
