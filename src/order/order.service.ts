import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorEnum } from '../utils/enums';
import { Product } from '../product/model';
import { Cart, Order } from './model';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findClientOrders(userId: number): Promise<Order[]> {
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
        products: true,
      },
    });
  }

  async findCartProducts(productsIds: number[]): Promise<Cart> {
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

    return {
      products: cart,
      totalPrice: new Prisma.Decimal(totalPrice),
    };
  }

  async find(orderId: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      select: {
        id: true,
        createdAt: true,
        total: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async buyOrderProducts(
    userId: number,
    productsIds: number[],
  ): Promise<Order> {
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
      return await this.prisma.order.create({
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

  async findOrderProducts(orderId): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        orders: {
          some: {
            id: orderId,
          },
        },
      },
    });
  }
}
