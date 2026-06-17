import { Body, Controller, Post } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-providers.dto';

@Controller('providers')
export class ProvidersController {
    constructor(
        private readonly providersService: ProvidersService
    ) {}

    @Post('new')
    create(@Body() providerDto: CreateProviderDto){
        return this.providersService.create(providerDto);
    }

}



