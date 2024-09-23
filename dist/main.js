"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
let app;
async function bootstrap() {
    const server = express();
    const adapter = new platform_express_1.ExpressAdapter(server);
    app = await core_1.NestFactory.create(app_module_1.AppModule, adapter);
    app.enableCors();
    await app.init();
    return app;
}
async function handler(req, res) {
    if (!app) {
        app = await bootstrap();
    }
    const expressInstance = app.getHttpAdapter().getInstance();
    expressInstance(req, res);
}
if (process.env.NODE_ENV !== 'production') {
    bootstrap().then((app) => {
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
        });
    });
}
//# sourceMappingURL=main.js.map