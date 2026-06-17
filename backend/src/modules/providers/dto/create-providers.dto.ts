import { IsNotEmpty, IsString, IsEmail, MaxLength, IsOptional } from 'class-validator';

export class CreateProviderDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @MaxLength(20)
    phone!: string;

    @IsEmail({}, { message: 'El email no es válido' })
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @MaxLength(100)
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    @MaxLength(255)
    address!: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    contactPerson?: string;
}