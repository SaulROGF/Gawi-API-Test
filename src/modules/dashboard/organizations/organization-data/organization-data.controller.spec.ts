import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationDataController } from './organization-data.controller';

describe('OrganizationData Controller', () => {
  let controller: OrganizationDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationDataController],
    }).compile();

    controller = module.get<OrganizationDataController>(OrganizationDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
