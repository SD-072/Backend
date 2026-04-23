import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_JWT_SECRET } from '#config';

const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.header('authorization');
  const accessToken = authHeader?.split(' ')[1];

  // The chatbot also works for visitors. No token simply means no personalization.
  if (!accessToken) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;

    if (!decoded.sub) throw new Error('Invalid access token', { cause: { status: 403 } });

    req.user = {
      id: decoded.sub,
      roles: Array.isArray(decoded.roles) ? decoded.roles : []
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new Error('Expired access token', {
          cause: { status: 401, code: 'ACCESS_TOKEN_EXPIRED' }
        })
      );
    } else {
      next(new Error('Invalid access token.', { cause: { status: 401 } }));
    }
  }
};

export default authenticate;
