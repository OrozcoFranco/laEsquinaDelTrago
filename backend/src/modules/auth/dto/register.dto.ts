import { IsNumber, IsNotEmpty, IsEmail, MinLength, MaxLength, IsString } from "class-validator";



export class CreateRegisterDto{
    @IsString()
    @IsNotEmpty({message: 'El nombre completo es obligatorio'})
    @MaxLength(20)
    name!: string;

    @IsNumber()
    @IsNotEmpty({message: 'El DNI es obligatorio'})
    dni!: number;
    
    @IsEmail()
    @IsNotEmpty({message: 'El correo electrónico es obligatorio'})
    email!: string;


    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })    
    password!: string;

}