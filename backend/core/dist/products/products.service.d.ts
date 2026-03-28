import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsService {
    private readonly productModel;
    constructor(productModel: Model<ProductDocument>);
    create(dto: CreateProductDto): Promise<Product>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<Product | null>;
}
