import { Test, TestingModule } from '@nestjs/testing';
import { DepartureOrdersService } from './departure-orders.service';

describe('DepartureOrdersService', () => {
  let service: DepartureOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartureOrdersService],
    }).compile();

    service = module.get<DepartureOrdersService>(DepartureOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
