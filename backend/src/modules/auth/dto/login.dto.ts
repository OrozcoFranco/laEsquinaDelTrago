import{ IsString, IsNotEmpty, MaxLength, IsEmail, MinLength } from 'class-validator';

export class LoginDto{
    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @MaxLength(20)
    name: string;

    @IsEmail()
    @IsNotEmpty({message: 'El correo electrónico es obligatorio'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    @MinLength(8, {message: 'La contraseña debe tener al menos 8 caracteres'})
    password: string;

}