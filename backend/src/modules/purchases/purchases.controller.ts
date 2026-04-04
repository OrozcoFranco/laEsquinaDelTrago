import { Body, Controller, Post } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesDto, PurchasesDetailsDto } from './dto/purchases.dto';

@Controller('purchases')
export class PurchasesController {

    constructor(
        private readonly purchasesService: PurchasesService
    ){}

    @Post('new')
    create(@Body() purchaseDto: PurchasesDto){
        return this.purchasesService.create(purchaseDto);
    }

}
