import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtGuard } from '../auth/guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetUser } from '../auth/decorator';
import { ProductService } from './product.service';
import { CreateProductInput, UpdateProductInput } from './dto';
import { ImageStorageInterceptor, ImageValidationPipe } from './helpers';
import { Product } from './model';
@Resolver()
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(/* istanbul ignore next */ () => [Product])
  products(): Promise<Product[]> {
    return this.productService.getProducts();
  }

  @Query(/* istanbul ignore next */ () => [Product])
  productsWithPagination(
    @Args('skip', ParseIntPipe) skip: number,
    @Args('take', ParseIntPipe) take: number,
  ): Promise<Product[]> {
    return this.productService.getOffsetPaginationProducts(skip, take);
  }

  @Query(/* istanbul ignore next */ () => Product)
  product(@Args('productId') productId: number): Promise<Product> {
    return this.productService.find(productId);
  }

  @Query(/* istanbul ignore next */ () => [Product])
  productsByCategory(
    @Args('categoryId') categoryId: number,
  ): Promise<Product[]> {
    return this.productService.findCategoryProducts(categoryId);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Product, {
    description:
      'Add a new product. To upload an image you need to set a header named "Apollo-Require-Preflight" to true.',
  })
  @UseInterceptors(new ImageStorageInterceptor('image'))
  async addProduct(
    @Args('input') input: CreateProductInput,
    @Args(
      { name: 'image', type: /* istanbul ignore next */ () => GraphQLUpload },
      ImageValidationPipe,
    )
    image: FileUpload,
  ): Promise<Product> {
    return this.productService.create(input, image.filename);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Product, {
    description: 'Update an existing product data',
  })
  async updateProduct(
    @Args('input') input: UpdateProductInput,
    @Args('productId') productId: number,
  ) {
    return this.productService.update(input, productId);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Product, {
    description:
      'Update the image of a specific product. Header "Apollo-Require-Preflight" with true as value is needed',
  })
  @UseInterceptors(new ImageStorageInterceptor('image'))
  async updateProductImage(
    @Args('productId') productId: number,
    @Args(
      { name: 'image', type: /* istanbul ignore next */ () => GraphQLUpload },
      ImageValidationPipe,
    )
    image: FileUpload,
  ) {
    return this.productService.updateProductImage(productId, image.filename);
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Boolean, {
    description: 'Delete an existing product',
  })
  async deleteProduct(@Args('productId') productId: number): Promise<boolean> {
    await this.productService.delete(productId);
    return true;
  }

  @Roles(Role.MANAGER)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Boolean, {
    description: 'Make a product unavailable',
  })
  async disableProduct(@Args('productId') productId: number): Promise<boolean> {
    await this.productService.disableProduct(productId);
    return true;
  }

  @Roles(Role.CLIENT)
  @UseGuards(JwtGuard, RolesGuard)
  @Mutation(/* istanbul ignore next */ () => Boolean, {
    description:
      'Add one like to an specific product. Send a second time to remove the like.',
  })
  async likeProduct(
    @Args('productId') productId: number,
    @GetUser('uuid') userUuid: string,
  ): Promise<boolean> {
    await this.productService.likeProduct(productId, userUuid);
    return true;
  }
}
