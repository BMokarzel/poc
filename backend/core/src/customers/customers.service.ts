import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Customer, CustomerDocument } from './customer.schema'
import { CreateCustomerDto } from './dto/create-customer.dto'

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {}

  // INTENTIONAL: sem log de criação — impossível auditar cadastros ou detectar duplicatas em produção
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = new this.customerModel(dto)
    return customer.save()
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec()
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec()
  }
}
