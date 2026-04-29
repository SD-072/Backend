import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { setAuthCookies, clearAuthCookies, getCookie } from '../utils/cookies';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await authService.register(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json({ user: result.user });
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = await authService.login(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);
  res.status(200).json({ user: result.user });
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user) {
    await authService.logout(req.user.userId);
  }
  clearAuthCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refresh = async (req: AuthRequest, res: Response): Promise<void> => {
  const refreshToken = getCookie(req.headers.cookie, 'refreshToken');
  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token required' });
    return;
  }

  const tokens = await authService.refreshTokens(refreshToken);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  res.status(200).json({ message: 'Tokens refreshed' });
};