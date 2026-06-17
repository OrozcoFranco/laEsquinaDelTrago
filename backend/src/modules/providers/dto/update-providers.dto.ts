import { IsString, IsEmail, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProviderDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    phone?: string;

    @IsEmail({}, { message: 'El email no es válido' })
    @IsOptional()
    @MaxLength(100)
    email?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    address?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    contactPerson?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}