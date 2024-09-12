import { parse } from 'fast-csv';
import fs from 'fs';

export default class CSVtoSQLMigration {
  private productsCSVFileName: string;
  private sellersCSVFileName: string;

  constructor(productsFileName: string, sellersFileName: string) {
    this.productsCSVFileName = productsFileName;
    this.sellersCSVFileName = sellersFileName;
  }

  public async migrateToSQL() {}
}
