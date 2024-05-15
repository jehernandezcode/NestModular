import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProduct } from '../entities/order-product.entity';
import {
  CreateOrderProductDto,
  UpdateOrderProductDto,
} from '../dtos/order-product.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersProductService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<OrderProduct[]> {
    return this.orderProductRepository.find({
      relations: ['product', 'order'],
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['product', 'order'],
    });

    if (!order) {
      throw new NotFoundException(`Order-Product #${id} not found`);
    }
    return order;
  }

  async create(data: CreateOrderProductDto): Promise<OrderProduct> {
    const product = await this.productRepository.findOne({
      where: { id: data.productId },
    });
    const order = await this.orderRepository.findOne({
      where: { id: data.orderId },
    });
    const newOrderProduct = new OrderProduct();

    if (data.orderId && data.productId) {
      newOrderProduct.order = order;
      newOrderProduct.product = product;
      newOrderProduct.quantity = data.quantity;
    } else {
      throw new NotFoundException(
        `Required orderId: ${data.orderId} or ProductId: ${data.productId}`,
      );
    }
    return this.orderProductRepository.save(newOrderProduct);
  }

  async update(id: string, data: UpdateOrderProductDto): Promise<OrderProduct> {
    const orderProduct = await this.orderProductRepository.findOne({
      where: { id },
    });
    if (data.orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: data.orderId },
      });
      orderProduct.order = order;
    }

    if (data.productId) {
      const product = await this.productRepository.findOne({
        where: { id: data.productId },
      });
      orderProduct.product = product;
    }
    return this.orderProductRepository.save(orderProduct);
  }

  async remove(id: string): Promise<boolean> {
    const isDeleted = (await this.orderProductRepository.delete(id)).affected;

    if (!isDeleted) {
      throw new NotFoundException(`order product #${id} not afected`);
    }
    return true;
  }
}
