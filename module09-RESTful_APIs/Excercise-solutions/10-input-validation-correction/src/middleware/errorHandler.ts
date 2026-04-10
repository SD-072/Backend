// import { mkdir, appendFile } from 'fs/promises';
// import { join } from 'path';
import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  process.env.NODE_ENV === 'development' && console.log(`\x1b[31m${err.stack}\x1b[0m`);

  if (err instanceof Error) {
    if (err.cause) {
      const cause = err.cause as { status: number };
      if (!cause.status) cause.status = 500;
      return res.status(cause.status).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
};

export default errorHandler;

// const errorLogger: ErrorRequestHandler = async (err, req, res, next) => {
//   try {
//     //create directory if it doesn't exist
//     const logDir = join(process.cwd(), 'log');
//     await mkdir(logDir, { recursive: true });
//     // throw new Error('Did not work!');

//     //Generate filename based on current date (yyyy-mm-dd-error.log);
//     const now = new Date();
//     const dateString = now.toISOString().split('T')[0];
//     const logFilePath = join(logDir, `${dateString}-error.log`);

//     // console.log(logFilePath);
//     const timestamp = now.toISOString();
//     const logEntry = `[${timestamp}] ${req.method} ${req.url}\n - Error: ${err.message}\n - Stack: ${err.stack} \n\n`;

//     // console.log(logEntry);
//     await appendFile(logFilePath, logEntry, 'utf8');
//   } catch (logError) {
//     if (process.env.NODE_ENV === 'development') {
//       if (logError instanceof Error) {
//         console.error(`\x1b[31m${logError.stack}\x1b[0m`);
//       } else {
//         console.error(`\x1b[31m${logError}\x1b[0m`);
//       }
//     }
//   } finally {
//     process.env.NODE_ENV === 'development' && console.log(`\x1b[31m${err.stack}\x1b[0m`);

//     if (err instanceof Error) {
//       if (err.cause) {
//         const cause = err.cause as { status: number };
//         if (!cause.status) cause.status = 500;
//         return res.status(cause.status).json({ error: err.message });
//       }
//       return res.status(500).json({ error: err.message });
//     }

//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// export default errorLogger;
