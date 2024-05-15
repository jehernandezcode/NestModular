import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne(id, {
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const newCategory = await this.categoryRepository.create(data);
    return this.categoryRepository.save(newCategory);
  }

  async update(id: string, changes: UpdateCategoryDto) {
    const product = await this.categoryRepository.findOne(id);

    if (!product) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    this.categoryRepository.merge(product, changes);
    return this.categoryRepository.save(product);
  }

  async remove(id: string) {
    const isDeleted = (await this.categoryRepository.delete(id)).affected;

    if (!isDeleted) {
      throw new NotFoundException(`Category #${id} not afected`);
    }
    return true;
  }
}
