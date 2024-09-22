"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    require('dotenv').config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const port = process.env.PORT || 8080;
    await app.listen(port, () => {
        if (process.env.NODE_ENV !== 'prod') {
            console.log(`Server started on http://localhost:${port}`);
        }
    });
}
bootstrap();
//# sourceMappingURL=main.js.map