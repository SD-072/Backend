import mongoose from 'mongoose';
import app from './app';
import { env } from './config/env';

const start = async () => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to MongoDB');

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();