import { Module } from '@nestjs/common';
import { MongoTestService } from './mongo-test.service';
import { MongoTestController } from './mongo-test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoSchema } from './schemas/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }])
  ],
  controllers: [MongoTestController],
  providers: [MongoTestService],
})
export class MongoTestModule {}

