import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/providers.entity';
import { CreateProviderDto } from './dto/create-providers.dto';
import { UpdateProviderDto } from './dto/update-providers.dto';

@Injectable()
export class ProvidersService {
    constructor(
        @InjectRepository(Provider)
        private readonly providerRepository: Repository<Provider>,
    ) {}

    // ─── CREAR ───────────────────────────────────────────────────────
    async create(createProviderDto: CreateProviderDto) {
        const existing = await this.providerRepository.findOne({
            where: { email: createProviderDto.email },
        });

        if (existing) {
            throw new ConflictException('Ya existe un proveedor con ese email');
        }

        const provider = this.providerRepository.create(createProviderDto);
        await this.providerRepository.save(provider);

        return {
            message: 'Proveedor creado exitosamente',
            provider,
        };
    }

    // ─── LISTAR TODOS ────────────────────────────────────────────────
    async findAll() {
        const providers = await this.providerRepository.find({
            order: { name: 'ASC' },
        });

        return {
            total: providers.length,
            providers,
        };
    }

    // ─── LISTAR ACTIVOS ──────────────────────────────────────────────
    async findAllActive() {
        const providers = await this.providerRepository.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });

        return {
            total: providers.length,
            providers,
        };
    }

    // ─── VER UNO ─────────────────────────────────────────────────────
    async findOne(id: number) {
        const provider = await this.providerRepository.findOne({
            where: { id_provider: id},
            relations: ['purchases'],
        });

        if (!provider) {
            throw new NotFoundException('Proveedor no encontrado');
        }

        return provider;
    }

    // ─── EDITAR ──────────────────────────────────────────────────────
    async update(id: number, updateProviderDto: UpdateProviderDto) {
        const provider = await this.providerRepository.findOne({ where: { id_provider: id} });

        if (!provider) {
            throw new NotFoundException('Proveedor no encontrado');
        }

        if (updateProviderDto.email && updateProviderDto.email !== provider.email) {
            const existing = await this.providerRepository.findOne({
                where: { email: updateProviderDto.email },
            });
            if (existing) {
                throw new ConflictException('Ya existe un proveedor con ese email');
            }
        }

        Object.assign(provider, updateProviderDto);
        await this.providerRepository.save(provider);

        return {
            message: 'Proveedor actualizado exitosamente',
            provider,
        };
    }

    // ─── ACTIVAR / DESACTIVAR ────────────────────────────────────────
    async toggleActive(id: number) {
        const provider = await this.providerRepository.findOne({ where: { id_provider: id} });

        if (!provider) {
            throw new NotFoundException('Proveedor no encontrado');
        }

        provider.isActive = !provider.isActive;
        await this.providerRepository.save(provider);

        return {
            message: `Proveedor ${provider.isActive ? 'activado' : 'desactivado'} exitosamente`,
            provider,
        };
    }

    // ─── ELIMINAR ────────────────────────────────────────────────────
    async remove(id: number) {
        const provider = await this.providerRepository.findOne({
            where: { id_provider: id},
            relations: ['purchases'],
        });

        if (!provider) {
            throw new NotFoundException('Proveedor no encontrado');
        }

        if (provider.purchases && provider.purchases.length > 0) {
            throw new ConflictException(
                `No se puede eliminar el proveedor porque tiene ${provider.purchases.length} compra(s) asociada(s). Desactivalo en su lugar.`,
            );
        }

        await this.providerRepository.remove(provider);

        return { message: 'Proveedor eliminado exitosamente' };
    }
}