import User from '../models/userSchema.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    // if(users.length === 0) return res.status(404).json({message: "Not found"})
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

export const getOneUser = async (req, res) => {
  try {
    const { id, username } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found!' });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) return res.send('Username and Password are required!');

    const foundUser = await User.findOne({ username });
    if (foundUser) return res.send('User already exists.');

    const newUser = await User.create({ username, password });

    return res.status(200).json({ message: 'User created succesfully!' });
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    if (!username || !Password) return res.send('Username and Password are required!');

    const foundUser = await User.findOneandUpdate({ username }, { username, password });
    // const foundUser = await User.findOne({ username });
    if (!foundUser) return res.status(404).json({ message: 'User not found!' });

    // foundUser.password = newPassword;
    // foundUser.save()
    // if (foundUser) return res.send('User already exists.');
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.send('Username is empty!');

    const deleteUser = await User.findOneAndDelete({ username });

    if (!deleteUser) return res.status(404).json({ message: 'User not found!' });
    return res.status(200).json({ message: 'User deleted succesfully!' });
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
};
