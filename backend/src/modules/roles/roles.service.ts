import {Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './enums/role.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async changeRole(targetUserId: number, newRole: Role, requestingUser: User) {
        // Solo el OWNER puede cambiar roles
        if (requestingUser.role !== Role.OWNER) {
            throw new ForbiddenException('Solo el dueño puede cambiar roles');
        }

        // El OWNER no puede cambiar su propio rol
        if (requestingUser.id === targetUserId) {
            throw new ForbiddenException('No podés cambiar tu propio rol');
        }

        const targetUser = await this.userRepository.findOne({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // No se puede asignar OWNER a otro usuario
        if (newRole === Role.OWNER) {
            throw new ForbiddenException('No se puede asignar el rol de dueño');
        }

        targetUser.role = newRole;
        await this.userRepository.save(targetUser);

        return {
            message: `Rol actualizado exitosamente`,
            user: {
                id: targetUser.id,
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role,
            },
        };
    }

    async getAllRoles() {
        return {
            roles: Object.values(Role),
            description: {
                [Role.OWNER]: 'Acceso total al sistema',
                [Role.MANAGER]: 'Gestión operativa: productos, pedidos y operarios',
                [Role.OPERATOR]: 'Operaciones básicas: ver productos y registrar pedidos',
            },
        };
    }
}