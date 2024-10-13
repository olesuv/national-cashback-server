import { ProductService } from '../db/product.service';
import { RedisService } from '../microservices/redis.service';
import { Product } from 'src/models/products.entity';
import { SarchByNameDTO } from 'src/dto/api/search-name.dto';
import { SearchEctInfoDTO } from 'src/dto/api/search-ect.dto';
import { SearchByBarcodeDTO } from 'src/dto/api/search-barcode.dto';
export declare class ProductApiService {
    private readonly productService;
    private readonly redisService;
    constructor(productService: ProductService, redisService: RedisService);
    searchBarcode(userInputs: SearchByBarcodeDTO): Promise<Product>;
    searchByName(userInputs: SarchByNameDTO): Promise<Partial<Product>[]>;
    searchEctInfo(userInputs: SearchEctInfoDTO): Promise<Partial<Product>>;
}
