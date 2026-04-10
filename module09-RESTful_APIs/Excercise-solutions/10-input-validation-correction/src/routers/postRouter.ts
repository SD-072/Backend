import { Router } from 'express';
import { getPosts, createPost, getPostById, updatePost, deletePost } from '#controllers';
import { validateBody } from '#middleware';
import { postInputSchema } from '#schemas';

const postRouter = Router();

postRouter.route('/').get(getPosts).post(validateBody(postInputSchema), createPost);
postRouter.route('/:id').get(getPostById).put(validateBody(postInputSchema), updatePost).delete(deletePost);

export default postRouter;
