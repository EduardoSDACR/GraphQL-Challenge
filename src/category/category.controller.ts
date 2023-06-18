import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.list();
  }

  @UseGuards(JwtGuard)
  @Post()
  createCategory(@Body() input: CreateCategoryDto) {
    return this.categoryService.create(input);
  }

  @UseGuards(JwtGuard)
  @Delete(':categoryId')
  @HttpCode(204)
  async deleteCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    await this.categoryService.delete(categoryId);
  }
}
