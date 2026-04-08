import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '#controllers';
import { validateBodyZod } from '#middlewares';
import { postInputSchema, postUpdateSchema } from '#schemas';

const postRoutes = Router();

postRoutes.get('/', getAllPosts);
postRoutes.post('/', validateBodyZod(postInputSchema), createPost);

postRoutes.get('/:id', getPostById);
postRoutes.put('/:id', validateBodyZod(postUpdateSchema), updatePost);
postRoutes.delete('/:id', deletePost);

export default postRoutes;
