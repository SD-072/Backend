import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  isbn: string;
  publicationYear?: number;
  genre?: string;
  author: mongoose.Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
    },
    genre: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', genre: 'text', description: 'text' });

export const Book = mongoose.model<IBook>('Book', bookSchema);