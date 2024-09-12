import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  // private readonly appService: AppService
  constructor() {}

  @Get()
  getHello(): string {
    return 'wassup';
  }
}
