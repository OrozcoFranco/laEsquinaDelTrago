import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Sale, SaleStatus } from './entities/sales.entity';
import { SaleDetail } from './entities/sales-details.entity';
import { Product } from '../products/entities/products.entity';
import { Client } from '../clients/entities/clients.entity';
import { User } from '../users/entities/user.entity';
import { CreateSaleDto } from './dto/sales.dto';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,
        @InjectRepository(SaleDetail)
        private readonly saleDetailRepository: Repository<SaleDetail>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
        private readonly dataSource: DataSource,
    ) { }

    // ─── CREAR VENTA ─────────────────────────────────────────────────
    async create(createSaleDto: CreateSaleDto, requestingUser: User) {
        const { id_client, details, paymentMethod, notes } = createSaleDto;

        const client = await this.clientRepository.findOne({
                where: { id_client },
            });
            if (!client) throw new NotFoundException('Cliente no encontrado');
            if (!client.isActive) throw new BadRequestException('El cliente está desactivado');

            if (!details || details.length === 0) {
                throw new BadRequestException('La venta debe tener al menos un producto');
            }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let totalAmount = 0;
            const saleDetails: SaleDetail[] = [];

            for (const detailDto of details) {
                const product = await queryRunner.manager.findOne(Product, {
                    where: { id_product: detailDto.id_product },
                });

                if (!product) throw new NotFoundException(`Producto con id ${detailDto.id_product} no encontrado`);
                if (!product.isActive) throw new BadRequestException(`El producto "${product.name}" está desactivado`);
                if (product.stockCurrent < detailDto.quantity) {
                    throw new BadRequestException(
                        `Stock insuficiente para "${product.name}". Stock actual: ${product.stockCurrent}, solicitado: ${detailDto.quantity}`,
                    );
                }

                const subtotal = detailDto.quantity * product.salePrice;
                totalAmount += subtotal;

                // Descontar stock
                product.stockCurrent -= detailDto.quantity;
                await queryRunner.manager.save(product);

                const detail = queryRunner.manager.create(SaleDetail, {
                    quantity: detailDto.quantity,
                    salePrice: product.salePrice,
                    subtotal,
                    product,
                });
                saleDetails.push(detail);
            }

            const sale = queryRunner.manager.create(Sale, {
                client,
                registeredBy: requestingUser,
                totalAmount,
                paymentMethod,
                status: SaleStatus.COMPLETED,
                notes,
                details: saleDetails,
            });

            await queryRunner.manager.save(sale);

    

            await queryRunner.commitTransaction();
            
            return {
                message: 'Venta registrada exitosamente',
                sale,
            };
        } catch (error) {
            console.error('Error al crear venta:', error);

            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }

            throw error;
        } finally {
            await queryRunner.release();
        }
    }
  // ─── LISTAR TODAS ────────────────────────────────────────────────
    async findAll() {
        const sales = await this.saleRepository.find({
            relations: ['client', 'registeredBy', 'details', 'details.product'],
            order: { createdAt: 'DESC' },
        });

        return {
            total: sales.length,
            sales: sales.map(s => this.sanitizeSale(s)),
        };
    }

    // ─── VER UNA ─────────────────────────────────────────────────────
    async findOne(id: number) {
        const sale = await this.saleRepository.findOne({
            where: { id_sale: id },
            relations: ['client', 'registeredBy', 'details', 'details.product'],
        });

        if (!sale) {
            throw new NotFoundException('Venta no encontrada');
        }

        return this.sanitizeSale(sale);
    }

    // ─── CANCELAR VENTA ──────────────────────────────────────────────
    async cancel(id: number) {
        const sale = await this.saleRepository.findOne({
            where: { id_sale: id },
            relations: ['details', 'details.product'],
        });

        if (!sale) {
            throw new NotFoundException('Venta no encontrada');
        }
        if (sale.status === SaleStatus.CANCELLED) {
            throw new BadRequestException('La venta ya está cancelada');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Revertir stock
            for (const detail of sale.details) {
                detail.product.stockCurrent += detail.quantity;
                await queryRunner.manager.save(detail.product);
            }

            sale.status = SaleStatus.CANCELLED;
            await queryRunner.manager.save(sale);
            await queryRunner.commitTransaction();

            return {
                message: 'Venta cancelada y stock revertido exitosamente',
                sale: this.sanitizeSale(sale),
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // ─── VENTAS POR CLIENTE ──────────────────────────────────────────
    async findByClient(clientId: number) {
        const client = await this.clientRepository.findOne({
            where: { id_client: clientId },
        });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        const sales = await this.saleRepository.find({
            where: { id_client: { id_client: clientId } },
            relations: ['details', 'details.product'],
            order: { createdAt: 'DESC' },
        });

        const total = sales
            .filter(s => s.status === SaleStatus.COMPLETED)
            .reduce((sum, s) => sum + Number(s.totalAmount), 0);

        return {
            client: client.name,
            totalSales: sales.length,
            totalRevenue: total,
            sales: sales.map(s => this.sanitizeSale(s)),
        };
    }

    // ─── REPORTE DIARIO ──────────────────────────────────────────────
    async getDailyReport(date?: string) {
        const targetDate = date ? new Date(date) : new Date();
        const start = new Date(targetDate.setHours(0, 0, 0, 0));
        const end = new Date(targetDate.setHours(23, 59, 59, 999));

        const sales = await this.saleRepository.find({
            where: {
                createdAt: Between(start, end),
                status: SaleStatus.COMPLETED,
            },
            relations: ['id_client', 'details', 'details.product'],
        });

        const totalRevenue = sales.reduce(
            (sum, s) => sum + Number(s.totalAmount), 0,
        );

        return {
            date: start.toISOString().split('T')[0],
            totalSales: sales.length,
            totalRevenue,
            sales: sales.map(s => this.sanitizeSale(s)),
        };
    }

    // ─── REPORTE MENSUAL ─────────────────────────────────────────────
    async getMonthlyReport(year: number, month: number) {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);

        const sales = await this.saleRepository.find({
            where: {
                createdAt: Between(start, end),
                status: SaleStatus.COMPLETED,
            },
            relations: ['client', 'details', 'details.product'],
        });

        const totalRevenue = sales.reduce(
            (sum, s) => sum + Number(s.totalAmount), 0,
        );

        return {
            year,
            month,
            totalSales: sales.length,
            totalRevenue,
            sales: sales.map(s => this.sanitizeSale(s)),
        };
    }

    // ─── HELPER: elimina password del usuario ────────────────────────
    private sanitizeSale(sale: Sale) {
        if (sale.registeredBy) {
            const { password, ...user } = sale.registeredBy as any;
            sale.registeredBy = user;
        }
        return sale;
    }
}