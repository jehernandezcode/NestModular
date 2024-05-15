import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

import { OrdersProductService } from '../services/orders-product.service';
import {
  CreateOrderProductDto,
  UpdateOrderProductDto,
} from '../dtos/order-product.dto';

@Controller('order-products')
export class OrderProductController {
  constructor(private orderProductService: OrdersProductService) {}

  @Get()
  findAll() {
    return this.orderProductService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orderProductService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateOrderProductDto) {
    return this.orderProductService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateOrderProductDto) {
    return this.orderProductService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderProductService.remove(id);
  }
}
