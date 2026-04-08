import type { RequestHandler } from "express";
import { Post } from "#models";

export const getPosts: RequestHandler = async (req, res) => {
  try {
    const posts = await Post.find({}).populate("author", "name email");
    res.json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createPost: RequestHandler = async (req, res) => {
  try {
    const { author, title, body } = req.body;

    if (!author || !title || !body)
      return res.status(400).json({ error: "Bad Request" });

    const post = await Post.create({ author, title, body });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate("author", "name email");

    if (!post) return res.status(404).json({ message: "Post Not Found!" });

    res.json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updatePost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const post = await Post.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
    res.json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ message: "Post Not Found!" });
    res.status(204).end();
  } catch (error) {
    res.status(500).json(error);
  }
};
