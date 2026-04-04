import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Purchases } from './entities/purchases.entity';
import { PurchasesDetails } from './entities/purchases.details';
import { Products } from '../products/entities/products.entity';
import { PurchasesDto } from './dto/purchases.dto';

@Injectable()
export class PurchasesService {
    create //     private readonly purchasesRepository: Repository<Purchases>,
        (purchaseDto: PurchasesDto) {
            throw new Error('Method not implemented.');
    }

    // constructor(
    //     @InjectRepository(Purchases)
    //     private readonly purchasesRepository: Repository<Purchases>,
    //     @InjectRepository(PurchasesDetails)
    //     private readonly purchasesDetailsRepository: Repository<PurchasesDetails>,
    //     @InjectRepository(Products)
    //     private readonly productsRepository: Repository<Products>,

    //     private readonly dataSource: DataSource,
        
    // ){}

    // create(createPurchaseDto: Purchases){
    //     const purchase = new Purchases();
    //     purchase.name = createPurchaseDto.name;
        
    // }

}
