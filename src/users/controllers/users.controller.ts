import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(@Query() params: FilterUserDto) {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/orders')
  getOrders(@Param('id') id: string) {
    return this.usersService.getOrderByUser(id);
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
