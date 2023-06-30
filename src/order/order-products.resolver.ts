import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Product } from '../product/model';
import { OrderService } from './order.service';
import { Order } from './model';

@Resolver(() => Order)
export class OrderProductsResolver {
  constructor(private orderService: OrderService) {}

  @ResolveField('products', () => [Product])
  orderProducts(@Parent() order: Order): Promise<Product[]> {
    return this.orderService.findOrderProducts(order.id);
  }
}
