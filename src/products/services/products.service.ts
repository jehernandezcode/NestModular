import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, In } from 'typeorm';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from './../dtos/products.dtos';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  findAll(filter?: FilterProductsDto): Promise<Product[]> {
    if (filter) {
      const where: FindOptionsWhere<Product> = {};
      const { limit, offset, maxPrice, minPrice } = filter;

      if (maxPrice && minPrice >= 0) {
        where.price = Between(minPrice, maxPrice);
      }

      return this.productRepository.find({
        relations: ['brand', 'categories'],
        where,
        take: limit,
        skip: offset,
      });
    }
    return this.productRepository.find({ relations: ['brand', 'categories'] });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = await this.productRepository.create(data);

    if (data.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: data.brandId },
      });
      newProduct.brand = brand;
    }

    if (data.categoriesIds) {
      const categories = await this.categoriesRepository.findBy({
        id: In(data.categoriesIds),
      });
      newProduct.categories = categories;
    }
    return this.productRepository.save(newProduct);
  }

  async update(id: string, changes: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (changes.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: changes.brandId },
      });
      product.brand = brand;
    }

    if (changes.categoriesIds) {
      const categories = await this.categoriesRepository.findBy({
        id: In(changes.categoriesIds),
      });
      product.categories = categories;
    }

    this.productRepository.merge(product, changes);
    return this.productRepository.save(product);
  }

  async removeCategoryByProduct(productId: string, categoryId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['categories'],
    });

    product.categories = product.categories.filter(
      (category) => category.id !== categoryId,
    );

    return this.productRepository.save(product);
  }

  async addCategoryByProduct(productId: string, categoryId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (category) {
      const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['categories'],
      });

      product.categories.push(category);

      return this.productRepository.save(product);
    } else {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }
  }

  async remove(id: string) {
    const isDeleted = (await this.productRepository.delete(id)).affected;

    if (!isDeleted) {
      throw new NotFoundException(`Product #${id} not afected`);
    }

    return true;
  }
}
