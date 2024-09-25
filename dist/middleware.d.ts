import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
export declare class RateLimitMiddleware implements NestMiddleware {
    private requests;
    private limit;
    private windowMs;
    use(req: Request, res: Response, next: NextFunction): void;
}
