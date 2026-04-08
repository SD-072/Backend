import { Router } from 'express';
import {
  createPostMultiple,
  createPostSingle,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '#controllers';
import { upload, validateBodyZod } from '#middlewares';
import { postInputSchema, postUpdateSchema } from '#schemas';

const postRoutes = Router();

postRoutes.get('/', getAllPosts);

// # Single Upload Route
// * `upload.single('image')` makes Multer attach one file object to `req.file`.
postRoutes.post(
  '/single',
  upload.single('image'),
  validateBodyZod(postInputSchema),
  createPostSingle,
);

// # Multiple Upload Route
// * This route shows how one form submission can attach several images to the same post.
postRoutes.post(
  '/',
  upload.array('image', 4),
  validateBodyZod(postInputSchema),
  createPostMultiple,
);

postRoutes.get('/:id', getPostById);
postRoutes.put('/:id', validateBodyZod(postUpdateSchema), updatePost);
postRoutes.delete('/:id', deletePost);

export default postRoutes;
