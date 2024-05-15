import { Injectable, NotFoundException } from '@nestjs/common';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  create(data: CreateCustomerDto): Promise<Customer> {
    const newCustomer = this.customerRepository.create(data);
    return this.customerRepository.save(newCustomer);
  }

  async update(id: string, changes: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    this.customerRepository.merge(customer, changes);
    return this.customerRepository.save(customer);
  }

  async remove(id: string) {
    const isDeleted = (await this.customerRepository.delete(id)).affected;

    if (!isDeleted) {
      throw new NotFoundException(`Customer #${id} not afected`);
    }
    return true;
  }
}
