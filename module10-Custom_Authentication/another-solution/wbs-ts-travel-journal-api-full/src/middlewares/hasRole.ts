import type { RequestHandler } from 'express';

const hasRole =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) => {
    const { id } = req.params;
    if (!req.user) return next(new Error('Unauthorized', { cause: { status: 401 } }));

    if (roles.includes('self') && req.user.id === id) {
      return next();
    }

    if (!roles.some(role => req.user?.roles.includes(role))) {
      return next(new Error('Forbidden', { cause: { status: 403 } }));
    }

    next();
  };

export default hasRole;
