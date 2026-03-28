import { CoreHttpClient } from '../common/http/core-http.client';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private readonly core;
    constructor(core: CoreHttpClient);
    findAll(query: ProductQueryDto): Promise<any[]>;
    findOne(id: string): Promise<any>;
}
