import { Test, TestingModule } from '@nestjs/testing';
import { MongoTestService } from './mongo-test.service';

describe('MongoTestService', () => {
  let service: MongoTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoTestService],
    }).compile();

    service = module.get<MongoTestService>(MongoTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
