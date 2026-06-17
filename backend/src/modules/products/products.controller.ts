import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    // Ver productos activos - todos los roles
    @Get('active')
    @Roles(Role.OWNER, Role.MANAGER, Role.OPERATOR)
    findAllActive(
        @Query('categoryId') categoryId?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAllActive(
            categoryId ? +categoryId : undefined,
            search,
        );
    }

    // Ver productos con stock bajo - OWNER y MANAGER
    @Get('low-stock')
    @Roles(Role.OWNER, Role.MANAGER)
    findLowStock() {
        return this.productsService.findLowStock();
    }

    // Ver todos los productos (incluyendo inactivos) - OWNER y MANAGER
    @Get()
    @Roles(Role.OWNER, Role.MANAGER)
    findAll(
        @Query('categoryId') categoryId?: string,
        @Query('brand') brand?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll(
            categoryId ? +categoryId : undefined,
            brand,
            search,
        );
    }

    // Ver un producto - todos los roles
    @Get(':id')
    @Roles(Role.OWNER, Role.MANAGER, Role.OPERATOR)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findOne(id);
    }

    // Crear producto - OWNER y MANAGER
    @Post()
    @Roles(Role.OWNER, Role.MANAGER)
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    // Editar producto - OWNER y MANAGER
    @Patch(':id')
    @Roles(Role.OWNER, Role.MANAGER)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    // Actualizar stock - todos los roles
    @Patch(':id/stock')
    @Roles(Role.OWNER, Role.MANAGER, Role.OPERATOR)
    updateStock(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStockDto: UpdateStockDto,
    ) {
        return this.productsService.updateStock(id, updateStockDto);
    }

    // Activar/desactivar - OWNER y MANAGER
    @Patch(':id/toggle-active')
    @Roles(Role.OWNER, Role.MANAGER)
    toggleActive(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.toggleActive(id);
    }

    // Eliminar - solo OWNER
    @Delete(':id')
    @Roles(Role.OWNER)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.remove(id);
    }
}