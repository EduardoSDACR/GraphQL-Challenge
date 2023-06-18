import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
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
  getCartProducts(productsIds: number[] = [1, 2]) {
    return this.orderService.findCartProducts(productsIds);
  }
}
