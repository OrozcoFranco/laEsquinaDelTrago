import { Injectable, UnauthorizedException, ConflictException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { CreateRegisterDto } from './dto/register.dto';
import { Role } from '../roles/enums/role.enum';
import { User } from './../users/entities/user.entity';


@Injectable()
export class AuthService {
    constructor( @InjectRepository(User)private readonly userRepository: Repository<User>, private readonly jwtService: JwtService,
    ) { }

    async register(createRegisterDto: CreateRegisterDto) {
        const { name, dni, email, password } = createRegisterDto;

        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('El correo electrónico ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // El primer usuario registrado será OWNER, el resto OPERATOR por defecto
        const userCount = await this.userRepository.count();
        const role = userCount === 0 ? Role.OWNER : Role.OPERATOR;

        const user = this.userRepository.create({
            name,
            dni,
            email,
            password: hashedPassword,
            role,
        });

        await this.userRepository.save(user);

        return {
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        };

        const token = this.jwtService.sign(payload);

        return {
            message: 'Login exitoso',
            access_token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }
}