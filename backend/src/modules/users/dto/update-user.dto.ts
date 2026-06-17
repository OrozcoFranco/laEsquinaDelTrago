import {IsString, IsEmail, IsNumber, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(20)
    name?: string;

    @IsNumber()
    @IsOptional()
    dni?: number;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}