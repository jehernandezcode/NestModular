import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  findAll(): Promise<Brand[]> {
    return this.brandRepository.find({ relations: ['products'] });
  }

  async findOne(id: string): Promise<Brand> {
    const product = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  create(data: CreateBrandDto): Promise<Brand> {
    const newBrand = this.brandRepository.create(data);
    return this.brandRepository.save(newBrand);
  }

  async update(id: string, changes: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);

    this.brandRepository.merge(brand, changes);
    return this.brandRepository.save(brand);
  }

  async remove(id: string): Promise<boolean> {
    const isDeleted = (await this.brandRepository.delete(id)).affected;

    if (!isDeleted) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return true;
  }
}
