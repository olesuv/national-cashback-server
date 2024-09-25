import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareConfigs } from './constants/middleware';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: Map<string, number[]> = new Map();
  private limit: number = MiddlewareConfigs.amountRequestsPerTime;
  private windowMs: number = MiddlewareConfigs.requestWindowTimeMs;

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const current = Date.now();
    const requestTimestamts = this.requests.get(ip) || [];

    const recentRequests = requestTimestamts.filter((timestamp) => current - timestamp < this.windowMs);
    if (recentRequests.length >= this.limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    recentRequests.push(current);
    this.requests.set(ip, recentRequests);

    next();
  }
}
