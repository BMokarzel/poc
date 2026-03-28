import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator'

export class CreateProductDto {
  @IsString()
  name: string

  @IsString()
  category: string

  @IsNumber()
  @IsPositive()
  price: number

  @IsOptional()
  @IsString()
  description?: string
}
