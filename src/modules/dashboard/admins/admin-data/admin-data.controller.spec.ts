import { Test, TestingModule } from '@nestjs/testing';
import { AdminDataController } from './admin-data.controller';

describe('AdminDataController', () => {
  let controller: AdminDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDataController],
    }).compile();

    controller = module.get<AdminDataController>(AdminDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
