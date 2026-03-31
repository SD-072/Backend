import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export default model("User", userSchema);
