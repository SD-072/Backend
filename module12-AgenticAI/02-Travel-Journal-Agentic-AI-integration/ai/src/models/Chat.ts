import { type InferSchemaType, model, Schema } from 'mongoose';

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

const chatSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    history: { type: [messageSchema], default: [] }
  },
  { timestamps: true }
);

export type ChatDocument = InferSchemaType<typeof chatSchema>;

export default model('Chat', chatSchema);
