import {Injectable, NotFoundException, ConflictException, ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/enums/role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,


    ) { }

    // ─── CREAR USUARIO ───────────────────────────────────────────────
    async create(createUserDto: CreateUserDto, requestingUser: User) {
        const { name, dni, email, password, role } = createUserDto;

        // Validar email único
        const existingEmail = await this.userRepository.findOne({ where: { email } });
        if (existingEmail) {
            throw new ConflictException('El correo electrónico ya está registrado');
        }

        // Validar DNI único
        const existingDni = await this.userRepository.findOne({ where: { dni } });
        if (existingDni) {
            throw new ConflictException('El DNI ya está registrado');
        }

        // Nadie puede crear un usuario con rol OWNER
        if (role === Role.OWNER) {
            throw new ForbiddenException('No se puede asignar el rol de dueño al crear un usuario');
        }

        // MANAGER solo puede crear OPERATOR
        if (requestingUser.role === Role.MANAGER && role && role !== Role.OPERATOR) {
            throw new ForbiddenException('El encargado solo puede crear operarios');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRole = role ?? Role.OPERATOR;

        const user = this.userRepository.create({
            name,
            dni,
            email,
            password: hashedPassword,
            role: assignedRole,
        });

        await this.userRepository.save(user);

        return {
            message: 'Usuario creado exitosamente',
            user: this.sanitizeUser(user),
        };
    }

    // ─── LISTAR USUARIOS ─────────────────────────────────────────────
    async findAll(requestingUser: User) {
        // OWNER ve absolutamente todos
        if (requestingUser.role === Role.OWNER) {
            const users = await this.userRepository.find({
                order: { createdAt: 'DESC' },
            });
            return {
                total: users.length,
                users: users.map( u => this.sanitizeUser(u)),
            };
        }

        // MANAGER solo ve operarios activos
        const users = await this.userRepository.find({
            where: { role: Role.OPERATOR },
            order: { createdAt: 'DESC' },
        });

        return {
            total: users.length,
            users: users.map(this.sanitizeUser),
        };
    }

    // ─── VER UN USUARIO ──────────────────────────────────────────────
    async findOne(id: number, requestingUser: User) {
        const user = await this.userRepository.findOne({ where: { id: id} });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // MANAGER solo puede ver operarios
        if (requestingUser.role === Role.MANAGER && user.role !== Role.OPERATOR) {
            throw new ForbiddenException('No tenés permiso para ver este usuario');
        }

        return this.sanitizeUser(user);
    }

    // ─── EDITAR USUARIO ──────────────────────────────────────────────
    async update(id: number, updateUserDto: UpdateUserDto, requestingUser: User) {
        const user = await this.userRepository.findOne({ where: { id: id} });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // MANAGER solo puede editar operarios
        if (requestingUser.role === Role.MANAGER && user.role !== Role.OPERATOR) {
            throw new ForbiddenException('No tenés permiso para editar este usuario');
        }

        // Cualquier usuario puede editarse a sí mismo (solo nombre y contraseña)
        if (requestingUser.id === id) {
            const { name, password } = updateUserDto;
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }
            if (name) user.name = name;
            await this.userRepository.save(user);
            return {
                message: 'Perfil actualizado exitosamente',
                user: this.sanitizeUser(user),
            };
        }

        // Validar email único si se está cambiando
        if (updateUserDto.email) {
            const existingEmail = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });
            if (existingEmail && existingEmail.id !== id) {
                throw new ConflictException('El correo electrónico ya está en uso');
            }
        }

        // Validar DNI único si se está cambiando
        if (updateUserDto.dni) {
            const existingDni = await this.userRepository.findOne({
                where: { dni: updateUserDto.dni },
            });
            if (existingDni && existingDni.id !== id) {
                throw new ConflictException('El DNI ya está en uso');
            }
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        Object.assign(user, updateUserDto);
        await this.userRepository.save(user);

        return {
            message: 'Usuario actualizado exitosamente',
            user: this.sanitizeUser(user),
        };
    }

    // ─── ELIMINAR USUARIO ────────────────────────────────────────────
    async remove(id: number, requestingUser: User) {
        // No puede eliminarse a sí mismo
        if (requestingUser.id === id) {
            throw new ForbiddenException('No podés eliminar tu propia cuenta');
        }

        const user = await this.userRepository.findOne({ where: { id: id} });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // No se puede eliminar al OWNER
        if (user.role === Role.OWNER) {
            throw new ForbiddenException('No se puede eliminar al dueño del sistema');
        }

        await this.userRepository.remove(user);

        return { message: 'Usuario eliminado exitosamente' };
    }

    // ─── ACTIVAR / DESACTIVAR ────────────────────────────────────────
    async toggleActive(id: number, requestingUser: User) {
        const user = await this.userRepository.findOne({ where: { id: id} });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // No puede desactivarse a sí mismo
        if (requestingUser.id === id) {
            throw new ForbiddenException('No podés desactivar tu propia cuenta');
        }

        // No se puede desactivar al OWNER
        if (user.role === Role.OWNER) {
            throw new ForbiddenException('No se puede desactivar al dueño del sistema');
        }

        // MANAGER solo puede activar/desactivar operarios
        if (requestingUser.role === Role.MANAGER && user.role !== Role.OPERATOR) {
            throw new ForbiddenException('No tenés permiso para modificar este usuario');
        }

        user.isActive = !user.isActive;
        await this.userRepository.save(user);

        return {
            message: `Usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
            user: this.sanitizeUser(user),
        };
    }

    // ─── TRANSFERIR OWNERSHIP ────────────────────────────────────────
    async transferOwnership(targetUserId: number, requestingUser: User) {
        // Solo el OWNER puede transferir
        if (requestingUser.role !== Role.OWNER) {
            throw new ForbiddenException('Solo el dueño puede transferir la propiedad');
        }

        // No puede transferirse a sí mismo
        if (requestingUser.id === targetUserId) {
            throw new ForbiddenException('No podés transferirte la propiedad a vos mismo');
        }

        const targetUser = await this.userRepository.findOne({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // No se puede transferir a un usuario inactivo
        if (!targetUser.isActive) {
            throw new ForbiddenException(
                'No podés transferir la propiedad a un usuario inactivo',
            );
        }

        // Transferencia atómica: nuevo OWNER sube, anterior baja a MANAGER
        targetUser.role = Role.OWNER;
        requestingUser.role = Role.MANAGER;

        await this.userRepository.save(targetUser);
        await this.userRepository.save(requestingUser);

        return {
            message: 'Propiedad transferida exitosamente',
            newOwner: {
                id: targetUser.id,
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role,
            },
            previousOwner: {
                id: requestingUser.id,
                name: requestingUser.name,
                email: requestingUser.email,
                role: requestingUser.role,
            },
        };
    }

    // ─── PERFIL PROPIO ───────────────────────────────────────────────
    async getProfile(requestingUser: User) {
        const user = await this.userRepository.findOne({
            where: { id: requestingUser.id },
        });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return this.sanitizeUser(user);
    }

    // ─── HELPER: elimina password de la respuesta ────────────────────
    private sanitizeUser(user: User) {
        const { password, ...result } = user;
        return result;
    }
}