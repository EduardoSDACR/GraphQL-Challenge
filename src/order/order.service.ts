import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorEnum } from '../utils/enums';
import { CartDto } from './dto/cart.dto';
import { OrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findClientOrders(userId: number): Promise<OrderDto[]> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orders = await this.prisma.order.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        products: true,
      },
    });

    return orders.map((order) => {
      return new OrderDto(order);
    });
  }

  async findCartProducts(productsIds: number[]): Promise<CartDto> {
    const cart = await this.prisma.product.findMany({
      where: {
        id: {
          in: productsIds,
        },
        isDisabled: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        likes: true,
        stock: true,
        price: true,
        image: true,
        categoryId: true,
      },
    });
    const totalPrice = cart.reduce((total, product) => {
      return total + +product.price;
    }, 0);

    return new CartDto({
      products: cart,
      totalPrice: new Prisma.Decimal(totalPrice),
    });
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
            description: true,
            likes: true,
            stock: true,
            price: true,
            image: true,
            categoryId: true,
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
    userId: number,
    productsIds: number[],
  ): Promise<OrderDto> {
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productsIds },
        isDisabled: false,
      },
    });

    const totalPrice = products.reduce((total, product) => {
      return total + +product.price;
    }, 0);

    try {
      const order = await this.prisma.order.create({
        data: {
          total: totalPrice,
          userId,
          products: {
            connect: products.map((product) => {
              return { id: product.id };
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
