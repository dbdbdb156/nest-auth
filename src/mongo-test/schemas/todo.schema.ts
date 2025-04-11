import { Schema } from 'mongoose';

export const TodoSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});