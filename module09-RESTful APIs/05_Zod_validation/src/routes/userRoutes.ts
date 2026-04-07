import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  registerUser,
  updateUser,
} from '#controllers';
import { validateBodyZod } from '#middlewares';
import { userInputSchema } from '#schemas';

const userRoutes = Router();

userRoutes.get('/', getAllUsers);
userRoutes.post('/', validateBodyZod(userInputSchema), registerUser);

userRoutes.get('/:id', getUserById);
userRoutes.put('/:id', validateBodyZod(userInputSchema), updateUser);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;
