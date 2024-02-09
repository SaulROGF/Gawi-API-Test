import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class AppService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
  ) { }

  getHello(): string {
    this.logger.debug('Hello World on port ' + process.env.API_PORT);
    return 'Hello World on port ' + process.env.API_PORT;
  }
}
