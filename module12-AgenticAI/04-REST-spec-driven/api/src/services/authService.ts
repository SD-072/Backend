import crypto from 'crypto';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import type { RegisterInput, LoginInput } from '../types';

export const register = async (input: RegisterInput) => {
  const existingUser = await User.findOne({ email: input.email.toLowerCase() });
  if (existingUser) {
    throw new AppError(409, 'Email already exists');
  }

  const user = await User.create({ email: input.email, password: input.password });

  const tokens = await generateTokenPair(user._id.toString());

  return {
    user: user.toJSON(),
    ...tokens,
  };
};

export const login = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokens = await generateTokenPair(user._id.toString());

  return {
    user: user.toJSON(),
    ...tokens,
  };
};

export const logout = async (userId: string): Promise<void> => {
  await RefreshToken.deleteMany({ user: userId });
};

export const refreshTokens = async (refreshTokenStr: string) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshTokenStr);
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }

  const storedToken = await RefreshToken.findOne({ token: refreshTokenStr });

  if (!storedToken) {
    if (payload.userId) {
      await RefreshToken.deleteMany({ user: payload.userId });
    }
    throw new AppError(401, 'Refresh token has been revoked');
  }

  await RefreshToken.deleteOne({ _id: storedToken._id });

  const tokens = await generateTokenPair(payload.userId);

  return tokens;
};

async function generateTokenPair(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(401, 'User not found');
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const tokenId = crypto.randomBytes(32).toString('hex');
  const refreshToken = generateRefreshToken({ userId: user._id.toString(), tokenId });

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}