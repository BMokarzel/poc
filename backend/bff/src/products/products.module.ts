import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { CoreHttpClient } from '../common/http/core-http.client'

@Module({
  imports: [HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService, CoreHttpClient],
})
export class ProductsModule {}
