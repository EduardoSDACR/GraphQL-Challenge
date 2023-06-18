import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { categoriesMock, categoryServiceMock } from './category.mock';

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
});
