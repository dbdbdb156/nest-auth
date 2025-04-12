// models/Todo.ts
import mongoose, { Schema } from 'mongoose';

const RefreshTokenSchema = new Schema({
  userId: Number,
  refreshToken: String,
  createdAt: Date,
});