import type { RequestHandler } from "express";
import { User } from "#models";

export const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    //   const {
    //     body: { name, email, password },
    //   } = req;
    const { name, email, password } = req.body;

    if (!email || !password)
      throw new Error("Bad Request", { cause: { status: 400 } });

    const user = await User.create({ name, email, password });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    //   const id = req.params.id;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User Not Found!" });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const user = await User.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User Not Found!" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
