import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationDataService } from './organization-data.service';

describe('OrganizationDataService', () => {
  let service: OrganizationDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationDataService],
    }).compile();

    service = module.get<OrganizationDataService>(OrganizationDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
