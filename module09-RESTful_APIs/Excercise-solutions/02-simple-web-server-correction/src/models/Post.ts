import { Schema, model } from 'mongoose';

const postSchema = new Schema(
	{
		content: {
			type: String,
			required: [true, 'Post must have content']
		},
		title: {
			type: String,
			required: [true, 'Post must have a title']
		}
	},
	{ timestamps: true }
);

export default model('Post', postSchema);
