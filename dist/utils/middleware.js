"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const middleware_1 = require("../constants/middleware");
let RateLimitMiddleware = class RateLimitMiddleware {
    constructor() {
        this.requests = new Map();
        this.limit = middleware_1.MiddlewareConfigs.amountRequestsPerTime;
        this.windowMs = middleware_1.MiddlewareConfigs.requestWindowTimeMs;
    }
    use(req, res, next) {
        const ip = req.ip;
        const current = Date.now();
        const requestTimestamts = this.requests.get(ip) || [];
        const recentRequests = requestTimestamts.filter((timestamp) => current - timestamp < this.windowMs);
        if (recentRequests.length >= this.limit) {
            throw new common_1.HttpException('Too many requests', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        recentRequests.push(current);
        this.requests.set(ip, recentRequests);
        next();
    }
};
exports.RateLimitMiddleware = RateLimitMiddleware;
exports.RateLimitMiddleware = RateLimitMiddleware = __decorate([
    (0, common_1.Injectable)()
], RateLimitMiddleware);
//# sourceMappingURL=middleware.js.map