import { Test, TestingModule } from '@nestjs/testing';
import { FieldtestController } from './fieldtest.controller';

describe('Fieldtest Controller', () => {
  let controller: FieldtestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldtestController],
    }).compile();

    controller = module.get<FieldtestController>(FieldtestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
