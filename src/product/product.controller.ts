import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { saveImageToStorage } from './helpers/image-storage';

@Controller('products')
export class ProductController {
  constructor(private product: ProductService) {}

  @Get()
  getProducts() {
    return this.product.getProducts();
  }

  @Get(':productId')
  @UseInterceptors(ClassSerializerInterceptor)
  getProductById(@Param('productId', ParseIntPipe) productId: number) {
    return this.product.find(productId);
  }

  @Get('category/:categoryId')
  getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.product.findCategoryProducts(categoryId);
  }

  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', saveImageToStorage),
    ClassSerializerInterceptor,
  )
  createProduct(
    @Body() input: CreateProductDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10000000,
        })
        .build({
          exceptionFactory() {
            throw new UnprocessableEntityException(
              'image file format must be jpg, jpeg or png and size less than 10MB',
            );
          },
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.product.create(input, image.filename);
  }

  @UseGuards(JwtGuard)
  @Put(':productId')
  @UseInterceptors(ClassSerializerInterceptor)
  updateProduct(
    @Body() input: UpdateProductDto,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.product.update(input, productId);
  }

  @UseGuards(JwtGuard)
  @Delete(':productId')
  @HttpCode(204)
  async deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    await this.product.delete(productId);
  }

  @UseGuards(JwtGuard)
  @Patch('disable/:productId')
  @HttpCode(204)
  async disableProduct(@Param('productId', ParseIntPipe) productId: number) {
    await this.product.disableProduct(productId);
  }

  @UseGuards(JwtGuard)
  @Patch('like/:productId')
  @HttpCode(204)
  async likeProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @GetUser('uuid') userUuid: string,
  ) {
    await this.product.likeProduct(productId, userUuid);
  }

  @UseGuards(JwtGuard)
  @Patch('image/:productId')
  @UseInterceptors(
    FileInterceptor('image', saveImageToStorage),
    ClassSerializerInterceptor,
  )
  updateProductImage(
    @Param('productId', ParseIntPipe) productId: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10000000,
        })
        .build({
          exceptionFactory() {
            throw new UnprocessableEntityException(
              'image file format must be jpg, jpeg or png and size less than 10MB',
            );
          },
        }),
    )
    image: Express.Multer.File,
  ) {
    return this.product.updateProductImage(productId, image.filename);
  }
}
