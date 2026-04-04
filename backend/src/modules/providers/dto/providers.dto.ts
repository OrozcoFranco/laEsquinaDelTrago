import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ProviderDto{
    @IsString()
    @IsNotEmpty({message:'El nombre el obligatorio'})
    name:string;

    @IsNumber()
    @IsNotEmpty({message:'El telefono es obligatorio'})
    phone:number;

    @IsString()
    @IsNotEmpty({message:'El email es obligatorio'})
    email:string;

    @IsString()
    @IsNotEmpty({message:'La direccion es obligatoria'})
    adress:string
}