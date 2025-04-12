import { Schema } from 'mongoose';

export const RefreshTokenSchema = new Schema({
  userId: { type: Number, require: true},
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});