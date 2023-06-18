import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async list(): Promise<CategoryDto[]> {
    return this.prisma.category.findMany();
  }

  async create(input: CreateCategoryDto): Promise<CategoryDto> {
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

    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
