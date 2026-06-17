import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ClientDto {

    @IsNotEmpty({message:'El nombre el obligatorio'})
    @IsString()
    name!:string;

    @IsNotEmpty({message:'El telefono es obligatorio'})
    @IsString()
    @Matches(/^\+?\d{7,15}$/)
    phone!:string;

    @IsNotEmpty({message:'La direccion es obligatoria'})
    @IsString()
    adress!:string

    @IsNotEmpty({message:'El tipo de cliente es obligatorio'})
    @IsString()
    type_client!:string;

}