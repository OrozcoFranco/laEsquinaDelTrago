import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchases } from './entities/purchases.entity';
import { PurchasesDetails } from './entities/purchases.details';
import { Providers } from '../providers/entities/providers.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Purchases, PurchasesDetails, Providers]) ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
})
export class PurchasesModule {}
