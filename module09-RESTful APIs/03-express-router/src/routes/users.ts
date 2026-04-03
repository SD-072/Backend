import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "#controllers";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.post("/", createUser);

userRouter.get("/:id", getUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;
