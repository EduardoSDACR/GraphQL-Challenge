import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './dto/product.dto';

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

  async find(productId: number): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.isDisabled) {
      throw new NotFoundException('Product not found');
    }

    return new ProductDto(product);
  }
}
