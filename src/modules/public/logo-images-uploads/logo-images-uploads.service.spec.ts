import { Test, TestingModule } from '@nestjs/testing';
import { LogoImagesUploadsService } from './logo-images-uploads.service';

describe('LogoImagesUploadsService', () => {
  let service: LogoImagesUploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogoImagesUploadsService],
    }).compile();

    service = module.get<LogoImagesUploadsService>(LogoImagesUploadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
