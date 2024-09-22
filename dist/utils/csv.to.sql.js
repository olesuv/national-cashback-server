"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVtoSQLMigration = exports.TabeleNames = exports.ColumnNames = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const fast_csv_1 = require("fast-csv");
const axios_1 = require("axios");
var ColumnNames;
(function (ColumnNames) {
    ColumnNames["BARCODE"] = "barcode";
    ColumnNames["BRAND"] = "brand";
    ColumnNames["NAME"] = "product_name";
})(ColumnNames || (exports.ColumnNames = ColumnNames = {}));
var TabeleNames;
(function (TabeleNames) {
    TabeleNames["PRODUCTS"] = "products";
    TabeleNames["SELLERS"] = "sellers";
})(TabeleNames || (exports.TabeleNames = TabeleNames = {}));
class CSVtoSQLMigration {
    constructor(migrationLogService, productService) {
        this.migrationLogService = migrationLogService;
        this.productService = productService;
        this.batchSize = 1000;
        this.productsdHeaderMap = {
            'Штрих-код': 'barcode',
            Бренд: 'brand',
            'Назва товару': 'product_name',
            'Коротка назва': 'short_name',
            'Юридична назва': 'legal_name',
            ЄДРПОУ: 'edrpou',
            РНОКПП: 'rnokpp',
            Оновлено: 'updated_at',
            Створено: 'created_at',
        };
        this.sellersHeaderMap = {
            Бренд: 'brand',
            'Юридична назва': 'legal_name',
            Адрес: 'address',
            ЄДРПОУ: 'edrpou',
            РНОКПП: 'rnokpp',
            'Торгових точок': 'shops_n',
            Оновлено: 'updated_at',
            Створено: 'created_at',
        };
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }
    async migrateToSQL(migrationInfo) {
        for (const tableName of migrationInfo.tableName) {
            const lastMigration = await this.migrationLogService.findByTableName({
                tableName: tableName,
            });
            const lastUpdatedAt = lastMigration?.updatedAt ? new Date(lastMigration.updatedAt) : null;
            const lastCreatedAt = lastMigration?.createdAt ? new Date(lastMigration.createdAt) : null;
            const lastMigrationDate = lastUpdatedAt && lastCreatedAt
                ? new Date(Math.max(lastUpdatedAt.getTime(), lastCreatedAt.getTime()))
                : lastUpdatedAt || lastCreatedAt;
            const currentDate = new Date();
            if (lastMigrationDate && currentDate.getTime() - lastMigrationDate.getTime() < 6 * 24 * 60 * 60 * 1000) {
                console.log(`Skipping migration for ${tableName}...`);
                continue;
            }
            try {
                const data = await this.parseCSV(migrationInfo.fileUrl);
                const transformedData = this.transformHeaders(tableName, data);
                await this.deleteTableData(tableName, ColumnNames.BRAND);
                await this.insertIntoSupabaseInBatches(transformedData, tableName, this.batchSize);
                await this.migrationLogService.createMigrationLog({ tableName: tableName });
                console.log(`Successfully migrated data for ${tableName}`);
            }
            catch (error) {
                console.error(`Error during migration CSV to SQL for ${tableName}:`, error);
            }
        }
    }
    transformHeaders(tableName, data) {
        let mapName = {};
        if (tableName === 'products') {
            mapName = this.productsdHeaderMap;
        }
        else if (tableName === 'sellers') {
            mapName = this.sellersHeaderMap;
        }
        else {
            throw new Error('No available table name selected');
        }
        return data.map((row) => {
            const transformedRow = {};
            Object.keys(row).forEach((key) => {
                const newKey = mapName[key] || key;
                transformedRow[newKey] = row[key];
            });
            return transformedRow;
        });
    }
    async parseCSV(fileUrl) {
        return new Promise(async (resolve, reject) => {
            const results = [];
            try {
                const response = await axios_1.default.get(fileUrl, { responseType: 'stream' });
                const stream = response.data;
                stream
                    .pipe((0, fast_csv_1.parse)({
                    headers: true,
                    delimiter: ';',
                }))
                    .on('data', (data) => results.push(data))
                    .on('end', () => resolve(results))
                    .on('error', (error) => reject(error));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async insertIntoSupabaseInBatches(data, tableName, batchSize) {
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const { data: insertedData, error } = await this.supabase.from(tableName).insert(batch);
            if (error) {
                if (error.code === '23505') {
                    continue;
                }
                console.error(`Error inserting batch into ${tableName}:`, error);
            }
        }
        const indexColumnNames = await this.getIndexColumnName(tableName);
        await this.productService.reindexTable({
            tableName: tableName,
            columnNames: indexColumnNames,
        });
    }
    async getIndexColumnName(tableName) {
        if (tableName === TabeleNames.PRODUCTS) {
            return [ColumnNames.BARCODE, ColumnNames.NAME, ColumnNames.BRAND];
        }
        else if (tableName === TabeleNames.SELLERS) {
            return [ColumnNames.BRAND];
        }
        else {
            throw Error(`Unsupported table with name: '${tableName}'`);
        }
    }
    async deleteTableData(tableName, mainColumnName) {
        try {
            const { error } = await this.supabase.from(tableName).delete().neq(mainColumnName, 0);
            if (error) {
                throw new Error(`Error deleting data from ${tableName}: ${error.message}`);
            }
            console.log(`Deleted all data from ${tableName}`);
        }
        catch (error) {
            console.error(`Error deleting data from ${tableName}: ${error}`);
        }
    }
}
exports.CSVtoSQLMigration = CSVtoSQLMigration;
//# sourceMappingURL=csv.to.sql.js.map