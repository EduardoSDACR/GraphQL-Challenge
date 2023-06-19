import { Injectable, NotFoundException } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorEnum } from '../utils/enums';
import { CartDto } from './dto/cart.dto';
import { OrderDto } from './dto';

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
    const totalPrice = cart.reduce((total, product) => {
      return total + +product.price;
    }, 0);

    return {
      products: cart,
      totalPrice: new Prisma.Decimal(totalPrice),
    };
  }

  async find(orderId: number): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        createdAt: true,
        total: true,
        products: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException();
    }

    return new OrderDto(order);
  }

  async buyOrderProducts(
    userUuid: string,
    productsIds: number[],
  ): Promise<OrderDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productsIds },
      },
    });

    const totalPrice = products.reduce((total, product) => {
      return total + +product.price;
    }, 0);

    try {
      const order = await this.prisma.order.create({
        data: {
          total: totalPrice,
          userId: user!.id,
          products: {
            connect: productsIds.map((id) => {
              return { id };
            }),
          },
        },
        include: {
          products: true,
        },
      });

      return new OrderDto(order);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('One of the products does not exist');
          default:
            throw error;
        }
      }

      throw error;
    }
  }
}
