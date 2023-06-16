import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorEnum } from '../utils/enums';
import { CreateProductDto, ProductDto } from './dto';
import { UpdateProductDto } from './dto';

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
        categoryId: true,
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

  async findCategoryProducts(categoryId: number): Promise<Partial<Product>[]> {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        isDisabled: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        categoryId: true,
      },
    });
  }

  async create(
    input: CreateProductDto,
    imageName: string,
  ): Promise<ProductDto> {
    const imagePath = join('/images/', imageName);

    try {
      const result = await this.prisma.product.create({
        data: {
          ...input,
          image: imagePath,
        },
      });

      return new ProductDto(result);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.FOREIGN_KEY_CONSTRAINT:
            throw new NotFoundException('Category not found');
          default:
            throw error;
        }
      }

      throw error;
    }
  }

  async update(
    input: UpdateProductDto,
    productId: number,
  ): Promise<ProductDto> {
    try {
      const product = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...input,
        },
      });

      return new ProductDto(product);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('Product not found');
          case PrismaErrorEnum.FOREIGN_KEY_CONSTRAINT:
            throw new NotFoundException('Category not found');
          default:
            throw error;
        }
      }

      throw error;
    }
  }

  async delete(productId: number): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
