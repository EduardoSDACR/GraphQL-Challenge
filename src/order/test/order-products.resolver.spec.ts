import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductsResolver } from '../order-products.resolver';
import { OrderService } from '../order.service';
import { productsMock } from '../../product/test/product.mock';
import { orderMock, orderServiceMock } from './order.mock';

describe('OrderProductsResolver', () => {
  let resolver: OrderProductsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProductsResolver, OrderService],
    })
      .overrideProvider(OrderService)
      .useValue(orderServiceMock)
      .compile();

    resolver = module.get<OrderProductsResolver>(OrderProductsResolver);
  });

  it('should return order products', async () => {
    const result = await resolver.orderProducts(orderMock);

    expect(result.length).toEqual(productsMock.length);
  });
});
