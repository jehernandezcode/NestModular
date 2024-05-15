import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User } from '../entities/user.entity';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from './../../products/services/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private customerService: CustomersService,
  ) {}

  findAll(filter?: FilterUserDto): Promise<User[]> {
    /*const apiKey = this.configService.get('API_KEY');
    const dbName = this.configService.get('DATABASE_NAME');
    console.log(apiKey, dbName);*/

    if (filter) {
      const { limit, offset } = filter;
      return this.userRepository.find({
        relations: ['customer'],
        take: limit,
        skip: offset,
      });
    }
    return this.userRepository.find({ relations: ['customer'] });
  }

  findOne(id: string): Promise<User> {
    const user = this.userRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(data);
    if (data.customerId) {
      const customer = await this.customerService.findOne(data.customerId);
      newUser.customer = customer;
    }

    return this.userRepository.save(newUser);
  }

  async update(id: string, changes: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    if (changes.customerId) {
      const customer = await this.customerService.findOne(changes.customerId);
      user.customer = customer;
    }
    this.userRepository.merge(user, changes);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const isDeleted = (await this.userRepository.delete(id)).affected;

    if (!isDeleted) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return true;
  }

  async getOrderByUser(id: string) {
    const user = this.findOne(id);
    return {
      date: new Date(),
      user,
      products: await this.productsService.findAll(),
    };
  }
}
