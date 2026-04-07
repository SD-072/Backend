import type { RequestHandler } from 'express';
import { User } from '#models';

export const registerUser: RequestHandler = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: 'User with this email already exists' });
  }

  const user = await User.create({ firstName, lastName, email });
  res.status(201).json(user);
};

export const getAllUsers: RequestHandler = async (req, res) => {
  const users = await User.find();

  if (!users.length) {
    return res.status(404).json({ message: 'No users found' });
  }

  res.json(users);
};

export const getUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

export const updateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  const uptadedUser = await User.findByIdAndUpdate(
    id,
    { firstName, lastName, email },
    { new: true, runValidators: true },
  );

  if (!updateUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    message: 'User updated successfully',
    user: uptadedUser,
  });
};

export const deleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'User deleted successfully' });
};
