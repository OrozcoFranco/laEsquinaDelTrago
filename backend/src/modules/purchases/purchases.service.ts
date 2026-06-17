import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Purchase, PurchaseStatus } from './entities/purchases.entity';
import { PurchaseDetail } from './entities/purchases-details.entity';
import { Product } from '../products/entities/products.entity';
import { Provider } from '../providers/entities/providers.entity';
import { User } from '../users/entities/user.entity';
import { CreatePurchaseDto } from './dto/purchases.dto';

@Injectable()
export class PurchasesService {
    constructor(
        @InjectRepository(Purchase)
        private readonly purchaseRepository: Repository<Purchase>,
        @InjectRepository(PurchaseDetail)
        private readonly purchaseDetailRepository: Repository<PurchaseDetail>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Provider)
        private readonly providerRepository: Repository<Provider>,
        private readonly dataSource: DataSource,
    ) {}

    // ─── CREAR COMPRA ────────────────────────────────────────────────
    // Usa transacción para garantizar que si algo falla,
    // no queden cambios parciales en la base de datos
    async create(createPurchaseDto: CreatePurchaseDto, requestingUser: User) {
        const { id_provider, details, notes } = createPurchaseDto;

        // Verificar proveedor
        const provider = await this.providerRepository.findOne({
            where: { id_provider: id_provider },
        });
        if (!provider) {
            throw new NotFoundException('Proveedor no encontrado');
        }
        if (!provider.isActive) {
            throw new BadRequestException('El proveedor está desactivado');
        }

        // Verificar que el array de detalles no esté vacío
        if (!details || details.length === 0) {
            throw new BadRequestException('La compra debe tener al menos un producto');
        }

        // Transacción: todo o nada
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let totalAmount = 0;
            const purchaseDetails: PurchaseDetail[] = [];

            // Procesar cada detalle
            for (const detailDto of details) {
                const product = await this.productRepository.findOne({
                    where: { id_product: detailDto.id_product },
                });

                if (!product) {
                    throw new NotFoundException(
                        `Producto con id ${detailDto.id_product} no encontrado`,
                    );
                }
                if (!product.isActive) {
                    throw new BadRequestException(
                        `El producto "${product.name}" está desactivado`,
                    );
                }

                const subtotal = detailDto.quantity * detailDto.purchasePrice;
                totalAmount += subtotal;

                // Actualizar stock del producto
                product.stockCurrent += detailDto.quantity;
                product.purchasePrice = detailDto.purchasePrice; // Actualiza precio de costo
                await queryRunner.manager.save(product);

                // Crear detalle
                const detail = this.purchaseDetailRepository.create({
                    quantity: detailDto.quantity,
                    purchasePrice: detailDto.purchasePrice,
                    subtotal,
                    product,
                });
                purchaseDetails.push(detail);
            }

            // Crear la compra
            const purchase = this.purchaseRepository.create({
                provider,
                registeredBy: requestingUser,
                totalAmount,
                status: PurchaseStatus.COMPLETED,
                notes,
                details: purchaseDetails,
            });

            await queryRunner.manager.save(purchase);
            await queryRunner.commitTransaction();

            return {
                message: 'Compra registrada exitosamente',
                purchase: await this.findOne(purchase.id_purchase),
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // ─── LISTAR TODAS ────────────────────────────────────────────────
    async findAll() {
        const purchases = await this.purchaseRepository.find({
            relations: ['provider', 'registeredBy', 'details', 'details.product'],
            order: { createdAt: 'DESC' },
        });

        return {
            total: purchases.length,
            purchases: purchases.map(p => this.sanitizePurchase(p)),
        };
    }

    // ─── VER UNA ─────────────────────────────────────────────────────
    async findOne(id: number) {
        const purchase = await this.purchaseRepository.findOne({
            where: { id_purchase: id},
            relations: ['provider', 'registeredBy', 'details', 'details.product'],
        });

        if (!purchase) {
            throw new NotFoundException('Compra no encontrada');
        }

        return this.sanitizePurchase(purchase);
    }

    // ─── CANCELAR COMPRA ─────────────────────────────────────────────
    async cancel(id: number) {
        const purchase = await this.purchaseRepository.findOne({
            where: { id_purchase: id},
            relations: ['details', 'details.product'],
        });

        if (!purchase) {
            throw new NotFoundException('Compra no encontrada');
        }

        if (purchase.status === PurchaseStatus.CANCELLED) {
            throw new BadRequestException('La compra ya está cancelada');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Revertir stock
            for (const detail of purchase.details) {
                const product = detail.product;
                if (product.stockCurrent < detail.quantity) {
                    throw new BadRequestException(
                        `No se puede cancelar: stock insuficiente en "${product.name}"`,
                    );
                }
                product.stockCurrent -= detail.quantity;
                await queryRunner.manager.save(product);
            }

            purchase.status = PurchaseStatus.CANCELLED;
            await queryRunner.manager.save(purchase);
            await queryRunner.commitTransaction();

            return {
                message: 'Compra cancelada y stock revertido exitosamente',
                purchase: this.sanitizePurchase(purchase),
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // ─── REPORTE POR PROVEEDOR ───────────────────────────────────────
    async findByProvider(providerId: number) {
        const provider = await this.providerRepository.findOne({
            where: { id_provider: providerId },
        });

        if (!provider) {
            throw new NotFoundException('Proveedor no encontrado');
        }

        const purchases = await this.purchaseRepository.find({
            where: { provider: { id_provider: providerId } },
            relations: ['details', 'details.product'],
            order: { createdAt: 'DESC' },
        });

        const total = purchases.reduce((sum, p) => sum + Number(p.totalAmount), 0);

        return {
            provider: provider.name,
            totalPurchases: purchases.length,
            totalSpent: total,
            purchases: purchases.map(p => this.sanitizePurchase(p)),
        };
    }

    // ─── HELPER: elimina password del usuario ────────────────────────
    private sanitizePurchase(purchase: Purchase) {
        if (purchase.registeredBy) {
            const { password, ...user } = purchase.registeredBy as any;
            purchase.registeredBy = user;
        }
        return purchase;
    }
}