import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errorMessage = "Internal server error";
  let statusCode = 500;

  if (err instanceof Error) {
    if (err.cause && typeof err.cause === "object" && "status" in err.cause) {
      statusCode = err.cause.status as number;
    }
    errorMessage = err.message;
  }
  res.status(statusCode).json({ error: errorMessage });
};

export default errorHandler;
