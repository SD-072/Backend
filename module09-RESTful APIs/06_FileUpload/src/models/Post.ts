import { model, Schema } from 'mongoose';

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image_url: {
      // type: String, // upload a single file
      type: [String], // upload multiple files
    },
  },
  { timestamps: true },
);

export default model('Post', postSchema);
