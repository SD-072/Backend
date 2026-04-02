import {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from "#controllers";
import { Router } from "express";

const postRouter = Router();

postRouter.get("/", getPosts);

postRouter.post("/", createPost);

postRouter.get("/:id", getPost);

postRouter.put("/:id", updatePost);

postRouter.delete("/:id", deletePost);

export default postRouter;
