import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/categories.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockOperation, UpdateStockDto } from './dto/update-stock.dto';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    // ─── CREAR ───────────────────────────────────────────────────────
    async create(createProductDto: CreateProductDto) {
        const { id_category, ...rest } = createProductDto;

        const category = await this.categoryRepository.findOne({
            where: { id_category: id_category },
        });

        if (!category) {
            throw new NotFoundException('La categoría no existe');
        }

        if (!category.isActive) {
            throw new BadRequestException('La categoría está desactivada');
        }

        const existing = await this.productRepository.findOne({
            where: { name: rest.name, brand: rest.brand },
        });

        if (existing) {
            throw new ConflictException('Ya existe un producto con ese nombre y marca');
        }

        const product = this.productRepository.create({ ...rest, category });
        await this.productRepository.save(product);

        return {
            message: 'Producto creado exitosamente',
            product,
        };
    }

    // ─── LISTAR TODOS (admin) ────────────────────────────────────────
    async findAll(id_category?: number, brand?: string, search?: string) {
        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .orderBy('product.name', 'ASC');

        if (id_category) {
            query.andWhere('category.id = :id_category', { id_category });
        }
        if (brand) {
            query.andWhere('product.brand = :brand', { brand });
        }
        if (search) {
            query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
        }

        const products = await query.getMany();

        return {
            total: products.length,
            products,
        };
    }

    // ─── LISTAR ACTIVOS (para operarios) ─────────────────────────────
    async findAllActive(id_category?: number, search?: string) {
        const query = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.isActive = true')
            .orderBy('product.name', 'ASC');

        if (id_category) {
            query.andWhere('category.id = :categoryId', { id_category });
        }
        if (search) {
            query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
        }

        const products = await query.getMany();

        return {
            total: products.length,
            products,
        };
    }

    // ─── VER UNO ─────────────────────────────────────────────────────
    async findOne(id: number) {
        const product = await this.productRepository.findOne({
            where: { id_product: id},
            relations: ['category'],
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        return product;
    }

    // ─── EDITAR ──────────────────────────────────────────────────────
    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.findOne(id);
        const { id_category, ...rest } = updateProductDto;

        if (id_category) {
            const category = await this.categoryRepository.findOne({
                where: { id_category: id_category },
            });
            if (!category) {
                throw new NotFoundException('La categoría no existe');
            }
            product.category = category;
        }

        Object.assign(product, rest);
        await this.productRepository.save(product);

        return {
            message: 'Producto actualizado exitosamente',
            product,
        };
    }

    // ─── ACTUALIZAR STOCK ────────────────────────────────────────────
    async updateStock(id: number, updateStockDto: UpdateStockDto) {
        const product = await this.findOne(id);
        const { quantity, operation } = updateStockDto;

        switch (operation) {
            case StockOperation.ADD:
                product.stockCurrent += quantity;
                break;
            case StockOperation.SUBTRACT:
                if (product.stockCurrent < quantity) {
                    throw new BadRequestException(
                        `Stock insuficiente. Stock actual: ${product.stockCurrent}`,
                    );
                }
                product.stockCurrent -= quantity;
                break;
            case StockOperation.SET:
                product.stockCurrent = quantity;
                break;
        }

        await this.productRepository.save(product);

        const isLowStock = product.stockCurrent <= product.stockMinimum;

        return {
            message: 'Stock actualizado exitosamente',
            product,
            alert: isLowStock
                ? `⚠️ Stock bajo: quedan ${product.stockCurrent} unidades`
                : null,
        };
    }

    // ─── PRODUCTOS CON STOCK BAJO ────────────────────────────────────
    async findLowStock() {
        const products = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.stockCurrent <= product.stockMinimum')
            .andWhere('product.isActive = true')
            .orderBy('product.stockCurrent', 'ASC')
            .getMany();

        return {
            total: products.length,
            products,
            
        };
    }

    // ─── ACTIVAR / DESACTIVAR ────────────────────────────────────────
    async toggleActive(id: number) {
        const product = await this.findOne(id);
        product.isActive = !product.isActive;
        await this.productRepository.save(product);

        return {
            message: `Producto ${product.isActive ? 'activado' : 'desactivado'} exitosamente`,
            product,
        };
    }

    // ─── ELIMINAR ────────────────────────────────────────────────────
    async remove(id: number) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
        return { message: 'Producto eliminado exitosamente' };
    }
}