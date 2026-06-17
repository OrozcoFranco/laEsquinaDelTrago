import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';
import { Category } from './entities/categories.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    // ─── CREAR ───────────────────────────────────────────────────────
    async create(createCategoryDto: CreateCategoryDto) {
        const existing = await this.categoryRepository.findOne({
            where: { name: createCategoryDto.name },
        });

        if (existing) {
            throw new ConflictException('Ya existe una categoría con ese nombre');
        }

        const category = this.categoryRepository.create(createCategoryDto);
        await this.categoryRepository.save(category);

        return {
            message: 'Categoría creada exitosamente',
            category,
        };
    }

    // ─── LISTAR TODAS ────────────────────────────────────────────────
    async findAll() {
        const categories = await this.categoryRepository.find({
            order: { name: 'ASC' },
        });

        return {
            total: categories.length,
            categories,
        };
    }

    // ─── LISTAR ACTIVAS (para selects en frontend) ───────────────────
    async findAllActive() {
        const categories = await this.categoryRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });

        return {
            total: categories.length,
            categories,
        };
    }

    // ─── VER UNA ─────────────────────────────────────────────────────
    async findOne(id: number) {
        const category = await this.categoryRepository.findOne({
            where: { id_category: id},
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }

        return category;
    }

    // ─── EDITAR ──────────────────────────────────────────────────────
    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepository.findOne({ where: { id_category: id} });

        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.categoryRepository.findOne({
                where: { name: updateCategoryDto.name },
            });
            if (existing) {
                throw new ConflictException('Ya existe una categoría con ese nombre');
            }
        }

        Object.assign(category, updateCategoryDto);
        await this.categoryRepository.save(category);

        return {
            message: 'Categoría actualizada exitosamente',
            category,
        };
    }

    // ─── ACTIVAR / DESACTIVAR ────────────────────────────────────────
    async toggleActive(id: number) {
        const category = await this.categoryRepository.findOne({ where: { id_category: id} });

        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }

        category.isActive = !category.isActive;
        await this.categoryRepository.save(category);

        return {
            message: `Categoría ${category.isActive ? 'activada' : 'desactivada'} exitosamente`,
            category,
        };
    }

    // ─── ELIMINAR ────────────────────────────────────────────────────
    async remove(id: number) {
        const category = await this.categoryRepository.findOne({
            where: { id_category: id},
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException('Categoría no encontrada');
        }

        // No eliminar si tiene productos asociados
        if (category.products && category.products.length > 0) {
            throw new ConflictException(
                `No se puede eliminar la categoría porque tiene ${category.products.length} producto(s) asociado(s). Desactivala en su lugar.`,
            );
        }

        await this.categoryRepository.remove(category);

        return { message: 'Categoría eliminada exitosamente' };
    }
}