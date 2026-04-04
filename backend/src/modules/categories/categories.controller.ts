import { Controller, Post, Body, Get , Delete} from '@nestjs/common';
import { CategoriesDto } from './dto/categories.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService
    ) {}

    @Post('new')
    create(@Body() categoriesDto: CategoriesDto){
        return this.categoriesService.create(categoriesDto);
    }




}
