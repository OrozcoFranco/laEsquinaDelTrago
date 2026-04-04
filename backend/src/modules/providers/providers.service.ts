import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderDto } from './dto/providers.dto';
import { Repository } from 'typeorm';
import { Providers } from './entities/providers.entity';

@Injectable()
export class ProvidersService {
    constructor(
        @InjectRepository(Providers) private readonly providersRepository: Repository<Providers>
    ){}

    create(createProviderDto: ProviderDto){
        const provider = new Providers();
        provider.name = createProviderDto.name;
        provider.phone = createProviderDto.phone;
        provider.email = createProviderDto.email;
        provider.adress = createProviderDto.adress;
        return this.providersRepository.save(provider);
    }

    findAll(id: number){
        return this.providersRepository.delete(id);
    }

}
