import { Test, TestingModule } from '@nestjs/testing';
import { DepartureOrdersController } from './departure-orders.controller';

describe('DepartureOrders Controller', () => {
  let controller: DepartureOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartureOrdersController],
    }).compile();

    controller = module.get<DepartureOrdersController>(DepartureOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
