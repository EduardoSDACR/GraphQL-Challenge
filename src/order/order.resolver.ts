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
  @Query(/* istanbul ignore next */ () => [Order], {
    description: 'Get all orders of specific client',
  })
  clientOrders(@Args('userId') userId: number): Promise<Order[]> {
    return this.orderService.findClientOrders(userId);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Query(/* istanbul ignore next */ () => Order, {
    description: 'Check an specific order',
  })
  order(@Args('orderId') orderId: number): Promise<Order> {
    return this.orderService.find(orderId);
  }

  @Query(/* istanbul ignore next */ () => Cart, {
    description:
      'Obtain all products of a cart using the ids of the products you need to check',
  })
  cartProducts(
    @Args({ name: 'productsIds', type: /* istanbul ignore next */ () => [Int] })
    productsIds: number[],
  ): Promise<Cart> {
    return this.orderService.findCartProducts(productsIds);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Query(/* istanbul ignore next */ () => [Order], {
    description: 'Check all of your orders. Need to be authenticated',
  })
  myOrders(@GetUser('id', ParseIntPipe) userId: number): Promise<Order[]> {
    return this.orderService.findClientOrders(userId);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Order, {
    description: 'Purchase all products using its ids to create a new order',
  })
  buyOrderProducts(
    @GetUser('id', ParseIntPipe) userId: number,
    @Args({ name: 'productsIds', type: /* istanbul ignore next */ () => [Int] })
    productsIds: number[],
  ) {
    return this.orderService.buyOrderProducts(userId, productsIds);
  }
}
