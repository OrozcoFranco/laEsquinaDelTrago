import { IsNotEmpty, IsNumber, IsString, MaxLength} from 'class-validator';

export class ProductsDto{

    @IsNumber()
    @IsNotEmpty({message: 'El id del producto es obligatorio'})
    id_product: number;

    @IsString()
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @MaxLength(20)
    name: string;

    @IsString()
    @IsNotEmpty({message: 'La marca es obligatoria'})
    @MaxLength(20)
    brand: string;

    @IsString()
    @IsNotEmpty({message: 'El tipo es obligatorio'})
    @MaxLength(20)
    type: string;

    @IsNumber()
    @IsNotEmpty({message: 'Precio de compra es obligatorio'})
    price_purchase: number;

    @IsNumber()
    @IsNotEmpty({message: 'Precio de venta es obligatorio'})
    price_sale: number;

}