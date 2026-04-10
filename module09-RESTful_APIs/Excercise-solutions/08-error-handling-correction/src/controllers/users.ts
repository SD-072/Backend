import { type RequestHandler } from 'express';
import { User } from '#models';
type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive?: boolean;
};
const getUsers: RequestHandler = async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
};

const createUser: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password, isActive } = req.body as UserType;

  if (!firstName || !lastName || !email || !password)
    throw new Error('firstName, lastName, email, and password are required', { cause: { status: 400 } });

  const found = await User.findOne({ email });

  if (found) throw new Error('User already exists', { cause: { status: 409 } });

  const user = await User.create({ firstName, lastName, email, password, isActive } satisfies UserType);

  res.status(201).json(user);
};

const getUserById: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;
  const user = await User.findById(id).lean();

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json(user);
};

const updateUser: RequestHandler = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  const { firstName, lastName, email } = body as UserType;

  if (!firstName || !lastName || !email)
    throw new Error('firstName, lastName, email, and are required', { cause: { status: 400 } });

  const user = await User.findById(id);

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;

  await user.save();

  res.json(user);
};

const deleteUser: RequestHandler = async (req, res) => {
  const {
    params: { id }
  } = req;

  const user = await User.findByIdAndDelete(id);

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json({ message: 'User deleted' });
};

export { getUsers, createUser, getUserById, updateUser, deleteUser };
