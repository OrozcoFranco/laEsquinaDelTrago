import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { ProductsDto } from './dto/products.dto';
import { Products } from './entities/products.entity';
import { Repository } from 'typeorm';
import { Categories } from '../categories/entities/categories.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Products) private readonly productsRepository: Repository<Products>,
        @InjectRepository(Categories) private readonly categoriesRepository: Repository<Categories>

    ){}

    async create(createproductsDto: ProductsDto) {
        const categories = await this.categoriesRepository.findOneBy({id_category: createproductsDto.id_category});

        if(!categories){
            let errors: string[] = []
            errors.push('La categoria no existe')
            throw new NotFoundException(errors)

        }

        return this.productsRepository.save({
            ...createproductsDto,
            categories
        })

    }

    findAll(id: number){
        return this.productsRepository.delete(id);
    }



}
