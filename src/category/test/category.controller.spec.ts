import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  categoriesMock,
  categoryMock,
  categoryServiceMock,
} from './category.mock';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    })
      .overrideProvider(CategoryService)
      .useValue(categoryServiceMock)
      .compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should return all categories', async () => {
    const result = await controller.getCategories();

    expect(result.length).toEqual(categoriesMock.length);
  });

  it('should return a created category', async () => {
    const input: CreateCategoryDto = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    };
    const result = await controller.createCategory(input);

    expect(result).toMatchObject(categoryMock);
  });

  it('should return undefined', async () => {
    const result = await controller.deleteCategory(faker.number.int());

    expect(result).toBeUndefined();
  });
});
