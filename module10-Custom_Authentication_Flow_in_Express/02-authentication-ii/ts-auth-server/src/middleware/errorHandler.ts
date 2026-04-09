import type { ErrorRequestHandler } from 'express';

type ErrorPayload = {
  message: string;
  code?: string;
};

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  process.env.NODE_ENV !== 'production' && console.log(`\x1b[31m${err.stack}\x1b[0m`);
  if (err instanceof Error) {
    const payload: ErrorPayload = { message: err.message };
    if (err.cause) {
      const cause = err.cause as { status: number; code?: string };
      if (cause.code === 'ACCESS_TOKEN_EXPIRED')
        res.setHeader(
          'WWW-Authenticate',
          'Bearer error="token_expired", error_description="The access token expired"'
        );
      res.status(cause?.status ?? 500).json(payload);
      return;
    }
    res.status(500).json(payload);
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
  return;
};

export default errorHandler;

// const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
//   process.env.NODE_ENV !== 'production' && console.log(`\x1b[31m${err.stack}\x1b[0m`);

//   let errorMessage = 'Internal server error';
//   let statusCode = 500;

//   if (err instanceof Error) {
//     // check if cause property exists, is an object, and has a 'status' property
//     if (err.cause && typeof err.cause === 'object' && 'status' in err.cause) {
//       statusCode = err.cause.status as number;
//     }
//     errorMessage = err.message;
//   }
//   res.status(statusCode).json({ error: errorMessage });
// };

// export default errorHandler;
