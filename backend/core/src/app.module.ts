import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { CustomersModule } from './customers/customers.module'

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://localhost:27017/ecommerce',
    ),
    ProductsModule,
    OrdersModule,
    CustomersModule,
  ],
})
export class AppModule {}
