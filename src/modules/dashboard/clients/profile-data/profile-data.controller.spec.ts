import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDataController } from './profile-data.controller';

describe('Clients Controller', () => {
  let controller: ProfileDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileDataController],
    }).compile();

    controller = module.get<ProfileDataController>(ProfileDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
