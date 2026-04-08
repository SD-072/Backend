import { Router } from 'express';
import {
  createPost2,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from '#controllers';
import { upload, validateBodyZod } from '#middlewares';
import { postInputSchema, postUpdateSchema } from '#schemas';

const postRoutes = Router();

postRoutes.get('/', getAllPosts);
// postRoutes.post(
//   '/',
//   upload.single('image'), // -> returns `req.file`
//   validateBodyZod(postInputSchema),
//   createPost,
// );
postRoutes.post(
  '/',
  upload.array('image', 4), // max. 4 files // -> returns `req.files`
  validateBodyZod(postInputSchema),
  createPost2,
);

postRoutes.get('/:id', getPostById);
postRoutes.put('/:id', validateBodyZod(postUpdateSchema), updatePost);
postRoutes.delete('/:id', deletePost);

export default postRoutes;
