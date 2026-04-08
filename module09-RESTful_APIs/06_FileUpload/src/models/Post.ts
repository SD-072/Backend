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
      // # Uploaded Asset URLs
      // * One consistent array shape keeps the single-file and multi-file examples compatible with the same schema.
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default model('Post', postSchema);
