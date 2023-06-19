import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { orderMock, orderServiceMock, ordersMock } from './order.mock';

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
    })
      .overrideProvider(OrderService)
      .useValue(orderServiceMock)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should return client orders', async () => {
    const result = await controller.getClientOrders(faker.number.int());

    expect(result.length).toEqual(ordersMock.length);
  });

  it('should return cart with products', async () => {
    const result = await controller.getCartProducts([faker.number.int()]);

    expect(result).toHaveProperty('products');
    expect(result).toHaveProperty('totalPrice');
  });

  it('should return an order with its products', async () => {
    const result = await controller.getOrderById(faker.number.int());

    expect(result).toMatchObject(orderMock);
  });

  it('should return an order', async () => {
    const result = await controller.buyOrderProducts(faker.string.uuid(), [
      faker.number.int(),
      faker.number.int(),
    ]);

    expect(result).toMatchObject(orderMock);
  });
});
