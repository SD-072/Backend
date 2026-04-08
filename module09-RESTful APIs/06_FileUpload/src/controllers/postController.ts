import type { RequestHandler } from 'express';
import type z from 'zod';
import { Post } from '#models';
import type { postInputSchema, postUpdateSchema } from '#schemas';

// # Post DTOs from the schema
// * The route middleware validates req.body before these controller handlers run.
type PostInputDTO = z.infer<typeof postInputSchema>;
type PostUpdateDTO = z.infer<typeof postUpdateSchema>;

// export const createPost: RequestHandler<
//   unknown,
//   unknown,
//   PostInputDTO
// > = async (req, res) => {
//   const { title, content, author } = req.body;
//   const image = req.file; // access the uploaded file

//   if (!title || !content || !author) {
//     throw new Error('Missing required fields', { cause: 400 });
//   }

//   const newPost = await Post.create({
//     title,
//     content,
//     author,
//     image_url: image?.path,
//   });

//   console.log('cloudinary upload result', image);
//   res.status(201).json(newPost);
// };

export const createPost2: RequestHandler<
  unknown,
  unknown,
  PostInputDTO
> = async (req, res) => {
  const { title, content, author } = req.body;
  const files = (req.files as Express.Multer.File[]) || []; // access the uploaded files

  if (!title || !content || !author) {
    throw new Error('Missing required fields', { cause: 400 });
  }

  const imageUrls = files.map((file) => file.path);

  const newPost = await Post.create({
    title,
    content,
    author,
    image_url: imageUrls,
  });

  console.log('cloudinary multiple upload results', files);
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
