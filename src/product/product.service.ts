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

  async getOffsetPaginationProducts(skip: number, take: number) {
    return this.prisma.product.findMany({
      skip,
      take,
      where: {
        isDisabled: false,
      },
      select: {
        id: true,
        name: true,
        price: true,
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
            throw error;
        }
      }

      throw error;
    }
  }

  async updateProductImage(productId: number, imageName): Promise<ProductDto> {
    const imagePath = join('/images/', imageName);

    try {
      const product = await this.prisma.product.update({
        where: {
          id: productId,
        },
        data: {
          image: imagePath,
        },
      });

      return new ProductDto(product);
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
