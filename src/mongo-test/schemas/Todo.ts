// models/Todo.ts
import mongoose, { Schema } from 'mongoose';

const TodoSchema = new Schema({
  title: String,
  completed: Boolean,
});