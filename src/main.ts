/**
 *     ______  _______________________  __
 *    /  _/  |/  /_  __/ ____/ ____/ / / /
 *    / // /|_/ / / / / __/ / /   / /_/ /
 *  _/ // /  / / / / / /___/ /___/ __  /
 * /___/_/  /_/ /_/ /_____/\____/_/ /_/
 *
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// UNCOMMENT FOR PRODUCTION
// import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const port = process.env.API_PORT;
  const app  = await NestFactory.create(AppModule, {});
  // CORS are anbled to allow queries from Ionic or other platforms
  app.enableCors();

  // UNCOMMENT FOR PRODUCTION
  // it protects against brute force attacks
  /**
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // limit each IP to 20 requests per windowMs
    }),
  );
  */
  
  await app.listen(port);
}
bootstrap();
