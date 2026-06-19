import { IsString, IsNotEmpty, IsEmail, IsNumber, MinLength, MaxLength, IsEnum, IsOptional,} from 'class-validator';
import { Role } from '../../roles/enums/role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(20)
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'El DNI es obligatorio' })
    dni!: string;

    @IsEmail()
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password!: string;

    @IsEnum(Role, { message: 'El rol debe ser: manager u operator' })
    @IsOptional()
    role?: Role;
}