import type { RequestHandler } from 'express';

//  will need to isntall jwt libary
// add same scret as auth server to `.env` variables

const authenticate: RequestHandler = (req, _res, next) => {
  // verify the token, similar to me endpoint, including error handling with try/catch
  // use updated errorHandler for WWW-authenticat header
  // add user.sub (user's _id) to the request body
  next();
};

export default authenticate;
