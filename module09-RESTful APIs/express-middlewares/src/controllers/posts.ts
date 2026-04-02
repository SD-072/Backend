import type { RequestHandler } from "express";
import { Post } from "#models";

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate("author", "name email");
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const createPost: RequestHandler = async (req, res, next) => {
  try {
    const { author, title, body } = req.body;

    if (!author || !title || !body)
      throw new Error("Bad Request", { cause: { status: 400 } });

    const post = await Post.create({ author, title, body });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const getPost: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("author", "name email");

    if (!post) return res.status(404).json({ message: "Post Not Found!" });

    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const post = await Post.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: "Post Not Found!" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
