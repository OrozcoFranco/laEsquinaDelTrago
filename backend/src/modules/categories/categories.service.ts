import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from './entities/categories.entity';
import { Repository } from 'typeorm';
import { CategoriesDto } from './dto/categories.dto';


@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Categories) private readonly categoriesRepository: Repository<Categories>
    ){}

    create(categoriesDto: CategoriesDto){
        const category = new Categories();
        category.name = categoriesDto.name;
        return this.categoriesRepository.save(category);
    }

    findAll(){
        return this.categoriesRepository.find();
    }

    delete(id: number){
        return this.categoriesRepository.delete(id);
    }



}
