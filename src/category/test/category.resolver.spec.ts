import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { CategoryResolver } from '../category.resolver';
import { CategoryService } from '../category.service';
import { CreateCategoryInput } from '../dto';
import {
  categoriesMock,
  categoryMock,
  categoryServiceMock,
} from './category.mock';

describe('CategoryResolver', () => {
  let resolver: CategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryResolver],
      providers: [CategoryService],
    })
      .overrideProvider(CategoryService)
      .useValue(categoryServiceMock)
      .compile();

    resolver = module.get<CategoryResolver>(CategoryResolver);
  });

  it('should return all categories', async () => {
    const result = await resolver.categories();

    expect(result.length).toEqual(categoriesMock.length);
  });

  it('should return a created category', async () => {
    const input: CreateCategoryInput = {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    };
    const result = await resolver.addCategory(input);

    expect(result).toMatchObject(categoryMock);
  });

  it('should return undefined', async () => {
    const result = await resolver.deleteCategory(faker.number.int());

    expect(result).toEqual(true);
  });
});
