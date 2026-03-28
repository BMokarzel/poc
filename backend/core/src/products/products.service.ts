import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from './product.schema'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(dto)
    return product.save()
  }

  // INTENTIONAL: carrega todos os documentos sem paginação server-side.
  // INTENTIONAL: loop síncrono que bloqueia o event loop — deveria usar agregação no banco
  // ou mover o cálculo para fora da thread principal.
  async findAll(): Promise<any[]> {
    const products = await this.productModel.find({ active: true }).exec()

    const result = []
    for (const product of products) {
      // INTENTIONAL: cálculo síncrono bloqueante dentro do loop de documentos
      let checksum = 0
      for (let i = 0; i < 50_000; i++) {
        checksum += i
      }
      result.push({ ...product.toObject(), _checksum: checksum })
    }

    return result
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec()
  }
}
