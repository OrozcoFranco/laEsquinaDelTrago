import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, Matches, Min, ValidateNested } from 'class-validator';

export class PurchasesDto{
    
    @IsInt()
    @IsNotEmpty()
    id_provider: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PurchasesDetailsDto)
    details: PurchasesDetailsDto[];

}

export class PurchasesDetailsDto{
    @IsInt()
    @IsNotEmpty()
    id_product: number;

    @IsInt()//cambiar a Isnumber tambien y sacar el maxdecimalplaces
    @IsNotEmpty()
    @Min(1)
    amount: number;

    @IsNumber({maxDecimalPlaces: 2}, {message: 'Cantidad no válida'})
    @IsNotEmpty()
    price_purchase: number;

}