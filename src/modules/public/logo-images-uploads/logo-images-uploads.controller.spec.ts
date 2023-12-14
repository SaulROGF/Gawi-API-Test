import { Test, TestingModule } from '@nestjs/testing';
import { LogoImagesUploadsController } from './logo-images-uploads.controller';

describe('LogoImagesUploads Controller', () => {
  let controller: LogoImagesUploadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogoImagesUploadsController],
    }).compile();

    controller = module.get<LogoImagesUploadsController>(LogoImagesUploadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
