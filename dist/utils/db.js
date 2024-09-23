"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
class DB {
    constructor(supabaseUrl, supabaseKey) {
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async dbInit() {
        try {
            const { error } = await this.supabase.from('some_table').select('*').limit(1);
            if (error) {
                throw new Error(`failed to connect to the database: ${error.message}`);
            }
            console.log('successfully connected to db');
        }
        catch (error) {
            console.error('error initializing db connection:', error);
            throw error;
        }
    }
}
exports.default = DB;
//# sourceMappingURL=db.js.map