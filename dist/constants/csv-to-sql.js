"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARSE_URLS = exports.TabeleNames = exports.ColumnNames = exports.sellersHeaderMap = exports.productsdHeaderMap = void 0;
exports.productsdHeaderMap = {
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
exports.sellersHeaderMap = {
    Бренд: 'brand',
    'Юридична назва': 'legal_name',
    Адрес: 'address',
    ЄДРПОУ: 'edrpou',
    РНОКПП: 'rnokpp',
    'Торгових точок': 'shops_n',
    Оновлено: 'updated_at',
    Створено: 'created_at',
};
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
exports.PARSE_URLS = {
    productsUrl: 'https://api.madeinukraine.gov.ua/storage/exports/products.csv',
    sellersUrl: 'https://api.madeinukraine.gov.ua/storage/exports/perelik-prodavtsiv.csv',
};
//# sourceMappingURL=csv-to-sql.js.map