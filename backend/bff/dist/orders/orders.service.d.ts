import { CoreHttpClient } from '../common/http/core-http.client';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private readonly core;
    constructor(core: CoreHttpClient);
    create(dto: CreateOrderDto): Promise<any>;
    findAll(): Promise<any[]>;
}
