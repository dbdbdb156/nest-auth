import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConflictException } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new this.userModel({
        ...createUserDto,
        id: nanoid(10), // ⚠️ 서버에서 강제로 덮어씌움
      });
      return await user.save();
    } catch (e: any) {
      if (e.code === 11000) {
        throw new ConflictException('⚠️ 중복된 사용자입니다.');
      }
      throw e;
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findOne({id}).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ id }, updateUserDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.userModel.findOneAndDelete( {id }).exec();
  }

  async findByUserIds(userIds: string[]): Promise<User[]> {
    return this.userModel.find({ id: { $in: userIds } }).exec();
  }
}
