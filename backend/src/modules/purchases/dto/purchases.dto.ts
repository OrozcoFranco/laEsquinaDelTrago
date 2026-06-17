import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class CreatePurchaseDetailDto {
    @IsInt()
    @IsNotEmpty({ message: 'El producto es obligatorio' })
    id_product!: number;

    @IsInt()
    @IsNotEmpty({ message: 'La cantidad es obligatoria' })
    @Min(1, { message: 'La cantidad debe ser mayor a 0' })
    quantity!: number;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Precio no válido' })
    @IsNotEmpty({ message: 'El precio de compra es obligatorio' })
    @Min(0)
    purchasePrice!: number;
}

export class CreatePurchaseDto {
    @IsInt()
    @IsNotEmpty({ message: 'El proveedor es obligatorio' })
    id_provider!: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseDetailDto)
    details!: CreatePurchaseDetailDto[];

    @IsString()
    @IsOptional()
    notes?: string;
}