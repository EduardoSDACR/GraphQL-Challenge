import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { OrderProductsResolver } from './order-products.resolver';

@Module({
  providers: [OrderService, OrderResolver, OrderProductsResolver],
})
export class OrderModule {}
