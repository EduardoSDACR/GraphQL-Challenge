import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { OrderResolver } from '../order.resolver';
import { OrderService } from '../order.service';
import { orderMock, orderServiceMock, ordersMock } from './order.mock';

describe('OrderResolver', () => {
  let resolver: OrderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, OrderResolver],
    })
      .overrideProvider(OrderService)
      .useValue(orderServiceMock)
      .compile();

    resolver = module.get<OrderResolver>(OrderResolver);
  });

  it('should return client orders', async () => {
    const result = await resolver.clientOrders(faker.number.int());

    expect(result.length).toEqual(ordersMock.length);
  });

  it('should return an specific order', async () => {
    const result = await resolver.order(faker.number.int());

    expect(result).toMatchObject(orderMock);
  });

  it('should return cart with products', async () => {
    const result = await resolver.cartProducts([faker.number.int()]);

    expect(result).toHaveProperty('products');
    expect(result).toHaveProperty('totalPrice');
  });

  it('should return all authenticated client orders', async () => {
    const result = await resolver.myOrders(faker.number.int());

    expect(result.length).toEqual(ordersMock.length);
  });

  it('should return an order after purchase products', async () => {
    const result = await resolver.buyOrderProducts(faker.number.int(), [
      faker.number.int(),
      faker.number.int(),
    ]);

    expect(result).toMatchObject(orderMock);
  });
});
