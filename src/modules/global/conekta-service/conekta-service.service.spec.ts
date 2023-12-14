import { Test, TestingModule } from '@nestjs/testing';
import { ConektaServiceService } from './conekta-service.service';

describe('ConektaServiceService', () => {
  let service: ConektaServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConektaServiceService],
    }).compile();

    service = module.get<ConektaServiceService>(ConektaServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
