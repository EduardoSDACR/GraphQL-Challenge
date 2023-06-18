import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findClientOrders(userId: number): Promise<Partial<Order>[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.order.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
      },
    });
  }

  async findCartProducts(productsIds: number[]): Promise<CartDto> {
    const cart = await this.prisma.product.findMany({
      where: {
        id: {
          in: productsIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
      },
    });
    const totalPrice = cart.reduce((previous, product) => +product.price, 0);

    return {
      products: cart,
      totalPrice: new Prisma.Decimal(totalPrice),
    };
  }
}
