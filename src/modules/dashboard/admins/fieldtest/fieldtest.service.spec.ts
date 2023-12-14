import { Test, TestingModule } from '@nestjs/testing';
import { FieldtestService } from './fieldtest.service';

describe('FieldtestService', () => {
  let service: FieldtestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FieldtestService],
    }).compile();

    service = module.get<FieldtestService>(FieldtestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
