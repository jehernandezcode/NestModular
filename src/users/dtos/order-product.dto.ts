import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsPositive,
  IsNumber,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateOrderProductDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly orderId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly productId: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly quantity: number;
}

export class UpdateOrderProductDto extends PartialType(CreateOrderProductDto) {}
