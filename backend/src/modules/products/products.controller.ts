import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {

    constructor(
        private readonly productsService: ProductsService
    ){}

    @Post('new')
    create(@Body() productsDto: ProductsDto){
        return this.productsService.create(productsDto);
    }

    // @Get()// si le vamos agregar mas parametros a la url, lo podemos generar en el dto
    // findAll(@Query('id_category') categoryId: string ){
    //     return this.productsService.findAll();
    // }


    @Delete('delete/:id')
    delete(@Body() id: number){
        return this.productsService.findAll(id);
    }
}
