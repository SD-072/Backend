import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL, SALT_ROUNDS } from '#config';
import { RefreshToken, User } from '#models';

export const register: RequestHandler = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExist = await User.exists({ email });
  if (userExist) throw new Error('Email already registered', { cause: { status: 409 } });

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPW = await bcrypt.hash(password, salt);

  const user = await User.create({ email, password: hashedPW, firstName, lastName }); // doesn't include confirmPassword

  const payload = { roles: user.roles };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: user._id.toString()
  };
  const accessToken = jwt.sign(payload, secret, tokenOptions);

  const refreshToken = randomUUID();
  await RefreshToken.create({
    token: refreshToken,
    userId: user._id
  });

  res.status(201).json({ message: 'Registered', accessToken, refreshToken });
};

export const login: RequestHandler = async (req, res) => {
  // TODO: Implement user login
  //   Query the DB for an existing user with that email (make sure to .select('+password') so we can compare it to the hashed password)
  // Throw an error is a user with that email is NOT found
  // Compare the hashed password to the password the user provided
  // Throw an error if the passwords don't match
  // Delete all refresh tokens from that user
  // Generate access token (JWT) and refresh token (random string saved to database)
  // Send the access token (in the response body) and the refresh token
};

export const refresh: RequestHandler = async (req, res) => {
  // TODO: Implement access token refresh and refresh token rotation
  // Destructure the refreshToken from req.cookies
  // Throw an error if there is no refreshToken cookie
  // Query the database for the matching stored refresh token
  // Throw an error if no stored token was found
  // Delete the stored token (since we'll be rotating it with a new refresh token)
  // Query the database for the user associated with that token
  // Throw an error if no user is found
  // Generate access token (JWT) and refresh token (random string saved to database)
  // Send the access token (in the response body) and the refresh token
};

export const logout: RequestHandler = async (req, res) => {
  // TODO: Implement logout by removing the tokens
  //   Get the refreshToken cookie
  // If a refreshToken cookie is found, delete the corresponding stored token from the database
  // Clear the refreshToken cookie
  // Send a success message in the response body
};

export const me: RequestHandler = async (req, res, next) => {
  // TODO: Implement a me handler
  // Get the access token from the request headers
  // Get the Authorization header from the request
  // Isolate the access token
  // Throw an error if there is not access token
  // Verify the access token
  // If token is expired, add code: ACCESS_TOKEN_EXPIRED to error
  // Query the database for the user who is the sub of the access token
  // Throw an error if no user is found
  // Send user profile with success message in response body
};
