import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { PagesModule } from './pages/pages.module'

@Module({
  imports: [
    HttpModule.register({ timeout: 5000 }),
    ProductsModule,
    OrdersModule,
    PagesModule,
  ],
})
export class AppModule {}
