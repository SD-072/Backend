import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthor extends Document {
  name: string;
  bio?: string;
  birthDate?: Date;
  nationality?: string;
  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
    nationality: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

authorSchema.index({ name: 1 });

export const Author = mongoose.model<IAuthor>('Author', authorSchema);