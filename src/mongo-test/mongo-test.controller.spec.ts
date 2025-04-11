import { Test, TestingModule } from '@nestjs/testing';
import { MongoTestController } from './mongo-test.controller';
import { MongoTestService } from './mongo-test.service';

describe('MongoTestController', () => {
  let controller: MongoTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MongoTestController],
      providers: [MongoTestService],
    }).compile();

    controller = module.get<MongoTestController>(MongoTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
