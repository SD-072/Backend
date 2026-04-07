import type { ErrorRequestHandler } from 'express';

// # Central error handler
// * Controllers can throw errors and keep one consistent API error response shape here.
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  process.env.NODE_ENV !== 'production' && console.error(err.stack);

  const cause = (err as any).cause;
  // * This supports both cause: 404 and cause: { status: 404 } from controller errors.
  const status = Number(cause?.status ?? cause) || 500;

  res.status(status).json({ message: err.message });
};

export default errorHandler;
