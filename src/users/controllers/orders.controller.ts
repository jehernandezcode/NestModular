import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import {
  CreateOrderDto,
  FilterOrderDto,
  UpdateOrderDto,
} from '../dtos/order.dto';

@Controller('Orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}
  @Get()
  findAll(@Query() params: FilterOrderDto) {
    return this.orderService.findAll(params);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateOrderDto) {
    return this.orderService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateOrderDto) {
    return this.orderService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
