import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDataService } from './profile-data.service';

describe('ProfileDataService', () => {
  let service: ProfileDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileDataService],
    }).compile();

    service = module.get<ProfileDataService>(ProfileDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
