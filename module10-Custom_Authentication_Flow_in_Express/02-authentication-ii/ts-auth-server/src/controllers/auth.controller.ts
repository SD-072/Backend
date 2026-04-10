import bcrypt from 'bcrypt';
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET, SALT_ROUNDS } from '#config';
import { RefreshToken, User } from '#models';
import { createTokens } from '#utils';

export const register: RequestHandler = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const userExists = await User.exists({ email });
  if (userExists) throw new Error('Email already registered', { cause: { status: 409 } }); // 409 conflict code

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPW = await bcrypt.hash(password, salt);

  const user = await User.create({ email, password: hashedPW, firstName, lastName });

  const [refreshToken, accessToken] = await createTokens(user);

  res.status(201).json({ message: 'Registered', refreshToken, accessToken });
};

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean(); // lean() = read-only & we get JS-object, isntead of MongoDB document
  if (!user) throw new Error('Incorrect credentials', { cause: { status: 401 } });

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Incorrect credentials', { cause: { status: 401 } });

  await RefreshToken.deleteMany({ userId: user._id });

  const [refreshToken, accessToken] = await createTokens(user);

  res.status(200).json({ message: 'Welcome back!', refreshToken, accessToken });
};

export const refresh: RequestHandler = async (req, res) => {
  // TODO: Implement access token refresh and refresh token rotation
  // destructure refreshToken from the body of the request
  //
  // if no refreshToken, throw a 401 (or validate with Zod)
  //
  // query the db for the refresh token as a token proeprty that matches the refreshToken
  //
  // if not stored token is found, throw 403
  //
  //  delete the stored one from the db
  //
  //  query the db for a user tha tmatches the userId of the stored token
  //
  // throw a 403 if no user is found
  //
  // create new tokens with our util function
  //
  // send success message and new tokens in the body of the response
};

export const logout: RequestHandler = async (req, res) => {
  // TODO: Implement logout by removing the tokens
  // clearing all tokens from local storage on the client
  // destructure refreshToken from the body of the request
  //
  // delete refreshToken from db that matches that refreshToken
  //
  // send generic success message in response body
};

export const me: RequestHandler = async (req, res, next) => {
  // Get the access token from the request headers.
  const authHeader = req.header('authorization'); // Bearer <access-token>
  // console.log('authHeader:\n', authHeader);
  const accessToken = authHeader?.split(' ')[1];
  // console.log('accessToken:\n', accessToken);
  // If there is no access token, throw a 401 error with an appropriate message.
  if (!accessToken) throw new Error('Please sign in', { cause: { status: 401 } });

  try {
    // Verify the access token.
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    // console.log(decoded);
    //
    // If decoded.sub is falsy, throw a 403 error and indicate that the token is invalid or expired.
    if (!decoded.sub)
      throw new Error('Invalid or expired access token', { cause: { status: 401 } });

    // Query the DB to find the user by the ID that matches decoded.sub.
    const user = await User.findById(decoded.sub).select('-password').lean();

    // Throw a 404 error if no user is found.
    if (!user) throw new Error('User not found', { cause: { status: 404 } });

    // Send a generic success message and the user info in the response body.
    res.json({ message: 'Valid token', user });
  } catch (error) {
    // If the error is because the token expired, call next with a 401 error and an `ACCESS_TOKEN_EXPIRED` code.
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new Error('Expired access token', {
          cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' }
        })
      );
    } else {
      // Call next with a new 401 error indicating an invalid access token.
      next(new Error('Invalid access token.', { cause: { status: 401 } }));
    }
  }
};
