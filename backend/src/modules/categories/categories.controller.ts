import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { RolesGuard } from '../roles/guards/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // Ver categorías activas - todos los roles (para cargar productos)
    @Get('active')
    @Roles(Role.OWNER, Role.MANAGER, Role.OPERATOR)
    findAllActive() {
        return this.categoriesService.findAllActive();
    }

    // Ver todas las categorías - OWNER y MANAGER
    @Get()
    @Roles(Role.OWNER, Role.MANAGER)
    findAll() {
        return this.categoriesService.findAll();
    }

    // Ver una categoría con sus productos - OWNER y MANAGER
    @Get(':id')
    @Roles(Role.OWNER, Role.MANAGER)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    // Crear categoría - solo OWNER y MANAGER
    @Post()
    @Roles(Role.OWNER, Role.MANAGER)
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    // Editar categoría - solo OWNER y MANAGER
    @Patch(':id')
    @Roles(Role.OWNER, Role.MANAGER)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    // Activar/desactivar - solo OWNER y MANAGER
    @Patch(':id/toggle-active')
    @Roles(Role.OWNER, Role.MANAGER)
    toggleActive(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.toggleActive(id);
    }

    // Eliminar - solo OWNER
    @Delete(':id')
    @Roles(Role.OWNER)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }
}