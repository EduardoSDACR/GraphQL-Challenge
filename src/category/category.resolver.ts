import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtGuard } from '../auth/guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { CreateCategoryInput } from './dto';
import { Category } from './model/category.model';
import { CategoryService } from './category.service';

@Resolver()
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(/* istanbul ignore next */ () => [Category])
  categories(): Promise<Category[]> {
    return this.categoryService.list();
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Category)
  addCategory(@Args('input') input: CreateCategoryInput): Promise<Category> {
    return this.categoryService.create(input);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Boolean)
  async deleteCategory(
    @Args('categoryId') categoryId: number,
  ): Promise<boolean> {
    await this.categoryService.delete(categoryId);
    return true;
  }
}
