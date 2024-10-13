export declare const productsdHeaderMap: {
    '\u0428\u0442\u0440\u0438\u0445-\u043A\u043E\u0434': string;
    Бренд: string;
    '\u041D\u0430\u0437\u0432\u0430 \u0442\u043E\u0432\u0430\u0440\u0443': string;
    '\u041A\u043E\u0440\u043E\u0442\u043A\u0430 \u043D\u0430\u0437\u0432\u0430': string;
    '\u042E\u0440\u0438\u0434\u0438\u0447\u043D\u0430 \u043D\u0430\u0437\u0432\u0430': string;
    ЄДРПОУ: string;
    РНОКПП: string;
    Оновлено: string;
    Створено: string;
};
export declare const sellersHeaderMap: {
    Бренд: string;
    '\u042E\u0440\u0438\u0434\u0438\u0447\u043D\u0430 \u043D\u0430\u0437\u0432\u0430': string;
    Адрес: string;
    ЄДРПОУ: string;
    РНОКПП: string;
    '\u0422\u043E\u0440\u0433\u043E\u0432\u0438\u0445 \u0442\u043E\u0447\u043E\u043A': string;
    Оновлено: string;
    Створено: string;
};
export interface MigrateToSQLDTO {
    fileUrl: string;
    tableName: string[];
}
export declare enum ColumnNames {
    BARCODE = "barcode",
    BRAND = "brand",
    NAME = "product_name"
}
export declare enum TabeleNames {
    PRODUCTS = "products",
    SELLERS = "sellers"
}
export declare const PARSE_URLS: {
    productsUrl: string;
    sellersUrl: string;
};
