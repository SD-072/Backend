import type { RequestHandler, Request } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.ACCESS_JWT_SECRET;
if (!secret) {
  console.log('Missing access token secret');
  process.exit(1);
}

const authenticate: RequestHandler = (req, _res, next) => {
  const { 'access-token': token } = req.cookies;
  if (!token) throw new Error('Not authenticated', { cause: { status: 401 } });

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    if (!decoded.jti || !decoded.sub) throw new Error();
    const user = {
      id: decoded.sub,
      roles: decoded.roles
    };
    req.user = user;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('Expired access token', { cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' } }));
    }
    return next(new Error('Invalid access token.', { cause: { status: 401 } }));
  }

  next();
};

export default authenticate;
