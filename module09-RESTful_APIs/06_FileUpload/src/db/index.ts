import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('❌ MONGO_URI environment variable is required');
}

try {
  const db = await mongoose.connect(MONGO_URI);
  console.log(`🟢 MongoDB connected`);
  console.log(`🗄️  active db: ${db.connection.name}`);
} catch (error) {
  console.error('🔴 MongoDB connection failed:', error);
  process.exit(1);
}
