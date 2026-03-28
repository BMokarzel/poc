import { IsString, IsArray, ArrayNotEmpty } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  customerId: string

  @IsArray()
  @ArrayNotEmpty()
  productIds: string[]
}
