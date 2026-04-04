import { Body, Controller, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientDto } from './dto/clients.dto';

@Controller('clients')
export class ClientsController {

    constructor(
        private readonly clientsService: ClientsService 
    ){}

    @Post('new')
    create(@Body() clientDto: ClientDto){
        return this.clientsService.create(clientDto);
    }

}
