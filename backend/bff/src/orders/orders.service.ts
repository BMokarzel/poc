import { Injectable } from '@nestjs/common'
import { CoreHttpClient } from '../common/http/core-http.client'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(private readonly core: CoreHttpClient) {}

  // INTENTIONAL: nenhum log antes ou depois da chamada ao Core.
  // Falhas neste fluxo crítico (criação de pedido) são invisíveis sem rastreamento.
  async create(dto: CreateOrderDto) {
    return this.core.post<any>('/orders', dto)
  }

  async findAll() {
    return this.core.get<any[]>('/orders')
  }
}
