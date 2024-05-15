import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dtos/order.dto';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll(filter?: FilterOrderDto): Promise<Order[]> {
    if (filter) {
      const { limit, offset } = filter;
      return this.orderRepository.find({
        relations: ['items', 'items.product'],
        take: limit,
        skip: offset,
      });
    }
    return this.orderRepository.find({ relations: ['items', 'items.product'] });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne(id, {
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async create(data: CreateOrderDto): Promise<Order> {
    const newOrder = new Order();
    if (data.customerId) {
      const customer = await this.customerRepository.findOne(data.customerId);
      newOrder.customer = customer;
    }
    return this.orderRepository.save(newOrder);
  }

  async update(id: string, data: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (data.customerId) {
      const customer = await this.customerRepository.findOne(data.customerId);
      order.customer = customer;
    }
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<boolean> {
    const isDeleted = (await this.orderRepository.delete(id)).affected;

    if (!isDeleted) {
      throw new NotFoundException(`order #${id} not afected`);
    }
    return true;
  }
}
