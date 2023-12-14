import { Test, TestingModule } from '@nestjs/testing';
import { AdminDataService } from './admin-data.service';

describe('OrganizationDataService', () => {
  let service: AdminDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminDataService],
    }).compile();

    service = module.get<AdminDataService>(AdminDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
