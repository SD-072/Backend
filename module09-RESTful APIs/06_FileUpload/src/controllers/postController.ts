import type { RequestHandler } from 'express';
import type z from 'zod';
import { Post } from '#models';
import type { postInputSchema, postUpdateSchema } from '#schemas';

// # Post DTOs from the schema
// * The route middleware validates req.body before these controller handlers run.
type PostInputDTO = z.infer<typeof postInputSchema>;
type PostUpdateDTO = z.infer<typeof postUpdateSchema>;

// # Single File Upload
// * `upload.single('image')` stores exactly one uploaded file on `req.file`.
// * This example converts that single file into a one-item array only when saving, because the current schema stores `image_url` as `string[]`.
export const createPostSingle: RequestHandler<
  unknown,
  unknown,
  PostInputDTO
> = async (req, res) => {
  const { title, content, author } = req.body;
  const uploadedFile = req.file;

  if (!title || !content || !author) {
    throw new Error('Missing required fields', { cause: 400 });
  }

  const imageUrls = uploadedFile ? [uploadedFile.path] : [];

  const newPost = await Post.create({
    title,
    content,
    author,
    image_url: imageUrls,
  });

  console.log('cloudinary single upload result', uploadedFile);
  res.status(201).json(newPost);
};

// # Multiple File Upload
// * `upload.array('image', 4)` collects all matching files into `req.files`, which lets one request create one post with many asset URLs.
export const createPostMultiple: RequestHandler<
  unknown,
  unknown,
  PostInputDTO
> = async (req, res) => {
  const { title, content, author } = req.body;
  const uploadedFiles = (req.files as Express.Multer.File[]) || [];

  if (!title || !content || !author) {
    throw new Error('Missing required fields', { cause: 400 });
  }

  const imageUrls = uploadedFiles.map((file) => file.path);

  const newPost = await Post.create({
    title,
    content,
    author,
    image_url: imageUrls,
  });

  console.log('cloudinary multiple upload results', uploadedFiles);
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

export const updatePost: RequestHandler<
  { id: string },
  unknown,
  PostUpdateDTO
> = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  // ! postUpdateSchema removes author, so updates cannot transfer ownership of a post.
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { title, content },
    { new: true, runValidators: true },
  ).populate('author', 'firstName lastName');

  if (!updatedPost) {
    throw new Error('Post not found', { cause: { status: 404 } });
  }

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
