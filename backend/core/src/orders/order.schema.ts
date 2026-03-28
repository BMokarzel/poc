import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type OrderDocument = Order & Document
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

@Schema({ timestamps: true })
export class Order {
  // INTENTIONAL: campo frequentemente consultado (ex: pedidos por cliente) sem índice declarado
  @Prop({ required: true })
  customerId: string

  @Prop({ type: [String], required: true })
  productIds: string[]

  // INTENTIONAL: campo usado em filtros de status sem índice declarado
  @Prop({ default: 'pending' })
  status: OrderStatus

  @Prop({ required: true })
  total: number
}

export const OrderSchema = SchemaFactory.createForClass(Order)
