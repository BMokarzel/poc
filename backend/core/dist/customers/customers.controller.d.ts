import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    findAll(): Promise<import("./customer.schema").Customer[]>;
    findOne(id: string): Promise<import("./customer.schema").Customer>;
    create(dto: CreateCustomerDto): Promise<import("./customer.schema").Customer>;
}
