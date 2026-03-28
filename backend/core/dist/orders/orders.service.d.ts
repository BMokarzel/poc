import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { ProductDocument } from '../products/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly orderModel;
    private readonly productModel;
    constructor(orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>);
    create(dto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<any[]>;
}
