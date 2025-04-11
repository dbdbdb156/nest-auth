import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type TodoDocument = {
  _id: string;
  title: string;
  completed: boolean;
};

@Injectable()
export class MongoTestService {
  constructor(@InjectModel('Todo') private todoModel: Model<TodoDocument>) {}

  async create(title: string) {
    const created = new this.todoModel({ title, completed: false });
    return created.save();
  }

  async findAll() {
    return this.todoModel.find().exec();
  }

  async findOne(id: string) {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);
    return todo;
  }

  async update(id: string, update: Partial<{ title: string; completed: boolean }>) {
    const updated = await this.todoModel.findByIdAndUpdate(id, update, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Todo with id ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.todoModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Todo with id ${id} not found`);
    return { deleted: true };
  }
}
