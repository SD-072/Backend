import { Router } from 'express';
import { authenticate, hasRole, validateZod } from '#middlewares';
import { createPost, deletePost, getAllPosts, getSinglePost, updatePost } from '#controllers';
import { postSchema } from '#schemas';

const postsRouter = Router();

postsRouter
  .route('/')
  .get(getAllPosts)
  .post(authenticate, hasRole('author', 'admin', 'user'), validateZod(postSchema), createPost);

postsRouter.route('/:id').get(authenticate, getSinglePost).put(validateZod(postSchema), updatePost).delete(deletePost);

export default postsRouter;
