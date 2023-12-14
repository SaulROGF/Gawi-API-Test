import { Test, TestingModule } from '@nestjs/testing';
import { FacturApiService } from './factur-api.service';

describe('FacturApiService', () => {
  let service: FacturApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacturApiService],
    }).compile();

    service = module.get<FacturApiService>(FacturApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
