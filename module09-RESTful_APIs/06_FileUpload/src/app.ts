import express from 'express';
import '#db';
import { errorHandler } from '#middlewares';
import { postRoutes, userRoutes } from '#routes';

const app = express();
const port = 3000;

// # Request parsing
// * Zod can validate req.body only after Express parses incoming JSON.
app.use(express.json());

// # Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// ! Error middleware must be registered after routes so thrown controller errors reach it.
app.use(errorHandler);

app.listen(port, () =>
  console.log(`\x1b[35m📡 Server is running at http://localhost:${port}\x1b`),
);
