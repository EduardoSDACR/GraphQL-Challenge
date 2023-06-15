import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async getProducts(): Promise<Partial<Product>[]> {
    return this.prisma.product.findMany({
      where: {
        isDisabled: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
      },
    });
  }
}
