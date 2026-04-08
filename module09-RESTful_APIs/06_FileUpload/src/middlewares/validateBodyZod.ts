import type { RequestHandler } from 'express';
import type { ZodObject } from 'zod';

// # Zod request-body middleware
// * Controllers stay simpler because this middleware turns untrusted input into parsed data first.
const validateBody =
  (zodSchema: ZodObject): RequestHandler =>
  (req, res, next) => {
    if (!req.body) {
      return next(
        new Error('Request body is missing.', { cause: { status: 400 } }),
      );
    }

    const parsed = zodSchema.safeParse(req.body);
    // console.log(parsed?.error?.issues);

    if (!parsed.success) {
      process.env.NODE_ENV !== 'production' && console.log(parsed.error.issues);

      const issues = parsed.error.issues.map((issue) => ({
        path: issue.path.join('.') || 'body',
        message: issue.message,
      }));

      return res.status(400).json({
        message: 'Validation failed',
        issues,
      });
    }

    // * Assign parsed data back so downstream code uses the trusted schema output.
    req.body = parsed.data;
    return next();
  };

export default validateBody;

// const validateBody =
//   (zodSchema: ZodObject): RequestHandler =>
//   (req, res, next) => {
//     if (!req.body) {
//       next(new Error('Request body is missing.', { cause: { status: 400 } }));
//     }
//     const { data, error, success } = zodSchema.safeParse(req.body);
//     if (!success) {
//       next(
//         new Error(z.prettifyError(error), {
//           cause: {
//             status: 400,
//           },
//         }),
//       );
//     } else {
//       req.body = data;
//       next();
//     }
//   };
