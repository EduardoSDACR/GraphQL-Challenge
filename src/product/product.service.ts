import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorEnum } from '../utils/enums';
import { CreateProductInput, UpdateProductInput } from './dto';
import { Product } from './model';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async getProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
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
  }

  async getOffsetPaginationProducts(
    skip: number,
    take: number,
  ): Promise<Product[]> {
    return this.prisma.product.findMany({
      skip,
      take,
      where: {
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
  }

  async find(productId: number): Promise<Product> {
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

    return product;
  }

  async findCategoryProducts(categoryId: number): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        categoryId,
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
  }

  async create(input: CreateProductInput, imageName: string): Promise<Product> {
    const imagePath = join('/images/', imageName);

    try {
      return await this.prisma.product.create({
        data: {
          ...input,
          image: imagePath,
        },
      });
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

  async update(input: UpdateProductInput, productId: number): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          ...input,
        },
      });
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

  async disableProduct(productId: number): Promise<void> {
    try {
      await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          isDisabled: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('Product not found');
          default:
            throw error;
        }
      }

      throw error;
    }
  }

  async likeProduct(productId: number, userUuid: string): Promise<void> {
    let data: Prisma.ProductUpdateInput = {
      likes: { increment: 1 },
      usersLike: {
        connect: {
          uuid: userUuid,
        },
      },
    };

    const productLiked = await this.prisma.product.findMany({
      where: {
        id: productId,
        usersLike: {
          some: {
            uuid: userUuid,
          },
        },
      },
    });

    if (productLiked.length !== 0) {
      data = {
        likes: { decrement: 1 },
        usersLike: {
          disconnect: {
            uuid: userUuid,
          },
        },
      };
    }

    try {
      await this.prisma.product.update({
        where: {
          id: productId,
        },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('Product not found');
          default:
            throw new NotFoundException('Product not found');
        }
      }

      throw error;
    }
  }

  async updateProductImage(productId: number, imageName): Promise<Product> {
    const imagePath = join('/images/', imageName);

    try {
      return await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          image: imagePath,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.NOT_FOUND:
            throw new NotFoundException('Product not found');
          default:
            throw error;
        }
      }

      throw error;
    }
  }
}
