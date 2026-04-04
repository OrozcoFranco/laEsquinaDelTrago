import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class ClientDto {

    @IsString()
    @IsNotEmpty({message:'El nombre el obligatorio'})
    name:string;

    @IsString()
    @Matches(/^\+?\d{7,15}$/)
    @IsNotEmpty({message:'El telefono es obligatorio'})
    phone:number;

    @IsString()
    @IsNotEmpty({message:'La direccion es obligatoria'})
    adress:string

    @IsString()
    @IsNotEmpty({message:'El tipo de cliente es obligatorio'})
    type_client:string;

}