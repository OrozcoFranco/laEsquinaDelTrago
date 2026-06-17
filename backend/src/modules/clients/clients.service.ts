import { Injectable } from '@nestjs/common';
import { ClientDto } from './dto/clients.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/clients.entity';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/products.entity';

@Injectable()
export class ClientsService {

    constructor(
        @InjectRepository(Client) private readonly clientsRepository: Repository<Client>,
        @InjectRepository(Product) private readonly productsRepository: Repository<Product>
    ){}

    create(clientDto: ClientDto) {
        const client = new Client();
        client.name = clientDto.name;
        client.phone = clientDto.phone;
        client.adress = clientDto.adress;
        client.type_client = clientDto.type_client;
        return this.clientsRepository.save(client);
    }

    findAll(id: number){
        return this.clientsRepository.delete(id);

    }
}
