import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly customerId: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class FilterOrderDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;
}
