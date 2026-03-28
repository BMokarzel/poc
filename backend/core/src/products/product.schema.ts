import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ProductDocument = Product & Document

@Schema({ timestamps: true })
export class Product {
  // INTENTIONAL: campo frequentemente usado em buscas por nome sem índice declarado
  @Prop({ required: true })
  name: string

  // INTENTIONAL: campo usado em filtros de listagem sem índice declarado
  @Prop({ required: true })
  category: string

  @Prop({ required: true })
  price: number

  @Prop()
  description: string

  @Prop({ default: true })
  active: boolean
}

export const ProductSchema = SchemaFactory.createForClass(Product)
