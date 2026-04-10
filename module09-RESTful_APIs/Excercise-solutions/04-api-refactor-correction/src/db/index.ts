import mongoose from 'mongoose';

try {
	// if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI');
	await mongoose.connect(process.env.MONGO_URI!, {
		dbName: 'posts-crud'
	});
	console.log('\x1b[35mMongoDB connected via Mongoose\x1b[0m');
} catch (error) {
	console.error(error);
}
