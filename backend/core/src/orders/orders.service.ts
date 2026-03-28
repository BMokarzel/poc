import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, OrderDocument } from './order.schema'
import { Product, ProductDocument } from '../products/product.schema'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  // INTENTIONAL: nenhum log antes, durante ou após a criação do pedido.
  // Falhas silenciosas neste fluxo crítico são impossíveis de debugar sem rastreamento.
  async create(dto: CreateOrderDto): Promise<Order> {
    const products = await this.productModel
      .find({ _id: { $in: dto.productIds } })
      .exec()

    const total = products.reduce((sum, p) => sum + p.price, 0)
    const order = new this.orderModel({ ...dto, total })
    return order.save()
  }

  // INTENTIONAL: N+1 — para cada pedido, busca cada produto individualmente em um loop.
  // Deveria usar $lookup na agregação ou uma única query com $in para todos os productIds.
  async findAll(): Promise<any[]> {
    const orders = await this.orderModel.find().exec()

    const result = []
    for (const order of orders) {
      const products = []
      for (const productId of order.productIds) {
        // INTENTIONAL: query individual por produto dentro de loop — N+1
        const product = await this.productModel.findById(productId).exec()
        products.push(product)
      }
      result.push({ ...order.toObject(), products })
    }

    return result
  }
}
