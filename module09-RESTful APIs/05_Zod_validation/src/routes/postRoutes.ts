import { Router } from 'express';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '#controllers';

const postRoutes = Router();

postRoutes.get('/', getAllPosts);
postRoutes.post('/', createPost);

postRoutes.get('/:id', getPostById);
postRoutes.put('/:id', updatePost);
postRoutes.delete('/:id', deletePost);

export default postRoutes;
