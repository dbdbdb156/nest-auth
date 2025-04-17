import { Schema } from 'mongoose';

export const RefreshTokenSchema = new Schema({
  userId: { type: String, require: true},
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});