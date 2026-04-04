import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class ProductsDto{

    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @MaxLength(20)
    name: string;

    @IsString()
    @IsNotEmpty({message: 'La marca es obligatoria'})
    @MaxLength(20)
    brand: string;

    @IsInt()
    @Min(0, {message: 'La cantidad debe ser mayor o igual a 0'})
    @IsNotEmpty({message: 'La categoria es obligatoria'})
    id_category: number;

    @IsNumber()
    @Min(0, {message: 'Numero debe ser mayor o igual a 0'})
    @IsNotEmpty({message: 'Stock actual obligatorio'})
    stock_current: number;

    @IsNumber()
    @Min(0, {message: 'El numero debe ser mayor o igual a 0'})
    @IsNotEmpty({message: 'Stock minimo obligatorio'})
    stock_minimum: number;

}