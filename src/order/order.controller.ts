import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('client/:userId')
  @UseInterceptors(ClassSerializerInterceptor)
  getClientOrders(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findClientOrders(userId);
  }

  @Get('cart')
  @UseInterceptors(ClassSerializerInterceptor)
  getCartProducts(
    @Query('products', new ParseArrayPipe({ items: Number }))
    productsIds: number[],
  ) {
    return this.orderService.findCartProducts(productsIds);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':orderId')
  @UseInterceptors(ClassSerializerInterceptor)
  getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.find(orderId);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('user/me')
  @UseInterceptors(ClassSerializerInterceptor)
  getAuthenticatedClientOrders(@GetUser('id', ParseIntPipe) userId: number) {
    return this.orderService.findClientOrders(userId);
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('buy')
  @UseInterceptors(ClassSerializerInterceptor)
  buyOrderProducts(
    @GetUser('id', ParseIntPipe) userId: number,
    @Query('products', new ParseArrayPipe({ items: Number }))
    productsIds: number[],
  ) {
    return this.orderService.buyOrderProducts(userId, productsIds);
  }
}
