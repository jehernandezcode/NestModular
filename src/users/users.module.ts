import { Module } from '@nestjs/common';

import { CustomerController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/order-product.entity';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { OrdersProductService } from './services/orders-product.service';
import { OrderProductController } from './controllers/order-products.controller';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([User, Customer, Order, OrderProduct]),
  ],
  controllers: [
    CustomerController,
    UsersController,
    OrdersController,
    OrderProductController,
  ],
  providers: [
    CustomersService,
    UsersService,
    OrdersService,
    OrdersProductService,
  ],
})
export class UsersModule {}
