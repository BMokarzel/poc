import { Injectable } from '@nestjs/common'
import { CoreHttpClient } from '../common/http/core-http.client'
import { ProductQueryDto } from './dto/product-query.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly core: CoreHttpClient) {}

  // INTENTIONAL: busca todos os produtos do Core sem paginação e fatia em memória no BFF.
  // Deveria passar page/limit como query params para o Core e deixar o banco paginar.
  async findAll(query: ProductQueryDto) {
    const products = await this.core.get<any[]>('/products')
    const { page = 1, limit = 10 } = query
    const start = (page - 1) * limit
    return products.slice(start, start + limit)
  }

  async findOne(id: string) {
    return this.core.get<any>(`/products/${id}`)
  }
}
