import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { CoreHttpClient } from '../common/http/core-http.client'

@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [OrdersService, CoreHttpClient],
})
export class OrdersModule {}
