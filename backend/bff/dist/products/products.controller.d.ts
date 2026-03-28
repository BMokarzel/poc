import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: ProductQueryDto): Promise<any[]>;
    findOne(id: string): Promise<any>;
}
