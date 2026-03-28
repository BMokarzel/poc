import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private readonly customerModel;
    constructor(customerModel: Model<CustomerDocument>);
    create(dto: CreateCustomerDto): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer | null>;
}
