import { Router } from 'express';
import * as authorController from '../controllers/authorController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validate';
import { createAuthorSchema, updateAuthorSchema, objectIdSchema } from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(authorController.list));
router.get('/:id', validateParams(objectIdSchema), asyncHandler(authorController.getById));
router.post('/', authenticate, validateBody(createAuthorSchema), asyncHandler(authorController.create));
router.put('/:id', authenticate, validateParams(objectIdSchema), validateBody(updateAuthorSchema), asyncHandler(authorController.update));
router.delete('/:id', authenticate, validateParams(objectIdSchema), asyncHandler(authorController.remove));

export default router;