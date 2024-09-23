export const productsdHeaderMap = {
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

export const sellersHeaderMap = {
  Бренд: 'brand',
  'Юридична назва': 'legal_name',
  Адрес: 'address',
  ЄДРПОУ: 'edrpou',
  РНОКПП: 'rnokpp',
  'Торгових точок': 'shops_n',
  Оновлено: 'updated_at',
  Створено: 'created_at',
};

export interface MigrateToSQLDTO {
  fileUrl: string;
  tableName: string[];
}

export enum ColumnNames {
  BARCODE = 'barcode',
  BRAND = 'brand',
  NAME = 'product_name',
}

export enum TabeleNames {
  PRODUCTS = 'products',
  SELLERS = 'sellers',
}

export const PARSE_URLS = {
  productsUrl: 'https://madeinukraine.gov.ua/files/perelik-tovariv/products.csv',
  sellersUrl: 'https://madeinukraine.gov.ua/files/perelik-prodavtsiv/perelik-prodavtsiv.csv',
};
