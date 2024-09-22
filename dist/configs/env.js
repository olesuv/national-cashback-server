"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfigs = void 0;
class EnvConfigs {
    constructor() {
        this.supabaseURL = process.env.DB_URL;
        this.envMode = process.env.MODE;
        if (!this.supabaseURL || this.supabaseURL === '') {
            throw new Error('missing required environment variables');
        }
        if (!this.envMode || this.envMode === '') {
            throw new Error('missing required environment variables');
        }
        else if (this.envMode && this.envMode === 'dev') {
            this.devMode = true;
        }
        else if (this.envMode && this.envMode === 'prod') {
            this.devMode = false;
        }
    }
}
exports.EnvConfigs = EnvConfigs;
//# sourceMappingURL=env.js.map