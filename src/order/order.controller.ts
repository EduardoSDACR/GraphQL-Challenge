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
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Get('client/:userId')
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

  @Get(':orderId')
  @UseInterceptors(ClassSerializerInterceptor)
  getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.find(orderId);
  }

  @UseGuards(JwtGuard)
  @Post('buy')
  @UseInterceptors(ClassSerializerInterceptor)
  buyOrderProducts(
    @GetUser('uuid') userUuid: string,
    @Query('products', new ParseArrayPipe({ items: Number }))
    productsIds: number[],
  ) {
    return this.orderService.buyOrderProducts(userUuid, productsIds);
  }
}
