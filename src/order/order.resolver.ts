import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Cart, Order } from './model';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Query(/* istanbul ignore next */ () => [Order])
  clientOrders(@Args('userId') userId: number): Promise<Order[]> {
    return this.orderService.findClientOrders(userId);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Query(/* istanbul ignore next */ () => Order)
  order(@Args('orderId') orderId: number): Promise<Order> {
    return this.orderService.find(orderId);
  }

  @Query(/* istanbul ignore next */ () => Cart)
  cartProducts(
    @Args({ name: 'productsIds', type: /* istanbul ignore next */ () => [Int] })
    productsIds: number[],
  ): Promise<Cart> {
    return this.orderService.findCartProducts(productsIds);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Query(/* istanbul ignore next */ () => [Order])
  myOrders(@GetUser('id', ParseIntPipe) userId: number): Promise<Order[]> {
    return this.orderService.findClientOrders(userId);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Order)
  buyOrderProducts(
    @GetUser('id', ParseIntPipe) userId: number,
    @Args({ name: 'productsIds', type: /* istanbul ignore next */ () => [Int] })
    productsIds: number[],
  ) {
    return this.orderService.buyOrderProducts(userId, productsIds);
  }
}
