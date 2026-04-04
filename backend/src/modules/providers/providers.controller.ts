import { Body, Controller, Post } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProviderDto } from './dto/providers.dto';

@Controller('providers')
export class ProvidersController {
    constructor(
        private readonly providersService: ProvidersService
    ) {}

    @Post('new')
    create(@Body() providerDto: ProviderDto){
        return this.providersService.create(providerDto);
    }

}



