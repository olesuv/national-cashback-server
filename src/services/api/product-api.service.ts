import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductService } from '../product.service';
import { RedisService } from '../redis.service';
import { rusProductRegex } from 'src/constants/regexes';
import { Product } from 'src/models/products.entity';
import { searchDefaultParams } from '../../constants/product';
import { SarchByNameDTO } from 'src/dto/api/search-name.dto';
import { SearchEctInfoDTO } from 'src/dto/api/search-ect.dto';
import { SearchByBarcodeDTO } from 'src/dto/api/search-barcode.dto';

@Injectable()
export class ProductApiService {
  constructor(
    private readonly productService: ProductService,
    private readonly redisService: RedisService,
  ) {}

  async searchBarcode(userInputs: SearchByBarcodeDTO): Promise<Product> {
    if (!userInputs.barcode) {
      throw new NotFoundException('No barcode was provided');
    } else if (rusProductRegex.test(String(userInputs.barcode))) {
      throw new NotFoundException('Rus product');
    }

    const cachedRes = await this.redisService.getBarcodeResults(userInputs.barcode);
    if (cachedRes) {
      return cachedRes;
    }

    const searchRes = await this.productService.findByBarcode(userInputs.barcode);
    if (!searchRes) {
      throw new NotFoundException('Nothing found');
    }

    await this.redisService.insertBarcodeResults(userInputs.barcode, searchRes);
    return searchRes;
  }

  async searchByName(userInputs: SarchByNameDTO): Promise<Partial<Product>[]> {
    if (!userInputs.name) {
      throw new NotFoundException('No search text was provided');
    } else if (rusProductRegex.test(userInputs.name)) {
      throw new NotFoundException('Rus product');
    }

    const parsedLimit = userInputs.limit ? parseInt(userInputs.limit, 10) : searchDefaultParams.limit;
    const parsedOffset = userInputs.offset ? parseInt(userInputs.offset, 10) : searchDefaultParams.offset;

    const cachedRes = await this.redisService.getSearchResults(userInputs.name, parsedLimit, parsedOffset);
    if (cachedRes) {
      return cachedRes;
    }

    const searchRes = await this.productService.searchByProductName(userInputs.name, parsedLimit, parsedOffset);
    if (!searchRes || searchRes.length === 0) {
      throw new NotFoundException('Nothing found');
    }

    await this.redisService.insertSearchResults(userInputs.name, searchRes, parsedLimit, parsedOffset);
    return searchRes;
  }

  async searchEctInfo(userInputs: SearchEctInfoDTO): Promise<Partial<Product>> {
    if (!userInputs.barcode) {
      throw new NotFoundException('No barcode was provided');
    } else if (rusProductRegex.test(String(userInputs.barcode))) {
      throw new NotFoundException('Rus product');
    }

    const cachedProductInfo = await this.redisService.getEctProductInfo(userInputs.barcode);
    if (cachedProductInfo) {
      return cachedProductInfo;
    }

    const searchRes = await this.productService.findEctProductInfo(userInputs.barcode);
    if (!searchRes) {
      throw new NotFoundException('Nothing found');
    }

    await this.redisService.setEctProductInfo(userInputs.barcode, searchRes);
    return searchRes;
  }
}
