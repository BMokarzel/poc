import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type CustomerDocument = Customer & Document

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  name: string

  // INTENTIONAL: campo de login usado em buscas sem índice único declarado —
  // permite duplicatas e degrada performance em autenticação
  @Prop({ required: true })
  email: string

  @Prop()
  phone: string
}

export const CustomerSchema = SchemaFactory.createForClass(Customer)
