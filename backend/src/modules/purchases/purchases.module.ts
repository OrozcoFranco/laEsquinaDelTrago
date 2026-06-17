import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { Purchase } from './entities/purchases.entity';
import { PurchaseDetail } from './entities/purchases-details.entity';
import { Product } from '../products/entities/products.entity';
import { Provider } from '../providers/entities/providers.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Purchase, PurchaseDetail, Product, Provider]),
    ],
    controllers: [PurchasesController],
    providers: [PurchasesService],
    exports: [PurchasesService],
})
export class PurchasesModule {}