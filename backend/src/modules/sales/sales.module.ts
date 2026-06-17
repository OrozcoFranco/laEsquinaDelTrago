import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { Sale } from './entities/sales.entity';
import { SaleDetail } from './entities/sales-details.entity';
import { Product } from '../products/entities/products.entity';
import { Client } from '../clients/entities/clients.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sale, SaleDetail, Product, Client]),
    ],
    controllers: [SalesController],
    providers: [SalesService],
    exports: [SalesService],
})
export class SalesModule {}