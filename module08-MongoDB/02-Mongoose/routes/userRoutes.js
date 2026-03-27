import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/userControllers.js';

const userRouter = Router();

userRouter.route('/').get(getAllUsers).post(createUser);

export default userRouter;
