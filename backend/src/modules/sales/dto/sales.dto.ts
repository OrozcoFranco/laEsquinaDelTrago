import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, Min, ValidateNested } from 'class-validator';


export class SalesDto{
    @IsInt()
    @IsNotEmpty()
    id_client: number;

    @IsNumber()
    @Min(0)
    total: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SalesDetailsDto)
    details: SalesDetailsDto[];


}

export class SalesDetailsDto {
    @IsInt()
    @IsNotEmpty()
    id_product: number;

    @IsInt()
    @Min(1)
    amount: number;

    @IsNumber()
    @Min(0)
    price_sale: number;
}
