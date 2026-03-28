import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<import("./product.schema").Product>;
    create(dto: CreateProductDto): Promise<import("./product.schema").Product>;
}
