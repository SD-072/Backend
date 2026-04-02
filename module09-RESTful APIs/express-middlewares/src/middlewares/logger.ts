import type { RequestHandler, ErrorRequestHandler } from "express";

const logger: RequestHandler = (req, res, next) => {
  console.log(`${req.method} ${req.url} ${Date.now()}`);
  next();
};

export default logger;
