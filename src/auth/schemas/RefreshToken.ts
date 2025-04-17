// models/Todo.ts
import mongoose, { Schema } from 'mongoose';

const RefreshTokenSchema = new Schema({
  userId: String,
  refreshToken: String,
  createdAt: Date,
});