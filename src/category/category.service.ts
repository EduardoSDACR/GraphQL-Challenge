import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaErrorEnum } from '../utils/enums';
import { Category } from './model/category.model';
import { CreateCategoryInput } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async list(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    return this.prisma.category.create({
      data: {
        ...input,
      },
    });
  }

  async delete(categoryId: number): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    try {
      await this.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case PrismaErrorEnum.FOREIGN_KEY_CONSTRAINT:
            throw new UnprocessableEntityException(
              'This category is being used',
            );
          default:
            throw error;
        }
      }

      throw error;
    }
  }
}
