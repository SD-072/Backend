import { Router } from 'express';
import * as bookController from '../controllers/bookController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateQuery, validateParams } from '../middleware/validate';
import {
  createBookSchema,
  updateBookSchema,
  paginationSchema,
  objectIdSchema,
} from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get(
  '/',
  validateQuery(paginationSchema),
  asyncHandler(bookController.list)
);
router.get(
  '/:id',
  validateParams(objectIdSchema),
  asyncHandler(bookController.getById)
);
router.post(
  '/',
  authenticate,
  validateBody(createBookSchema),
  asyncHandler(bookController.create)
);
router.put(
  '/:id',
  authenticate,
  validateParams(objectIdSchema),
  validateBody(updateBookSchema),
  asyncHandler(bookController.update)
);
router.delete(
  '/:id',
  authenticate,
  validateParams(objectIdSchema),
  asyncHandler(bookController.remove)
);

export default router;