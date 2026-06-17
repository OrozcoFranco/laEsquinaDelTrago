import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min, IsOptional, IsPositive } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    @MaxLength(60)
    name!: string;

    @IsString()
    @IsOptional()
    @MaxLength(60)
    brand?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    presentation?: string;

    @IsNotEmpty({ message: 'La categoría es obligatoria' })
    @IsInt({ message: 'La categoría no es válida' })
    id_category!: number;

    @IsNotEmpty({ message: 'El precio de costo es obligatorio' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'El precio de costo no puede ser negativo' })
    purchasePrice!: number;

    @IsNotEmpty({ message: 'El precio de venta es obligatorio' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive({ message: 'El precio de venta debe ser mayor a 0' })
    salePrice!: number;

    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Número no válido' })
    @Min(0, { message: 'El stock actual no puede ser negativo' })
    @IsOptional()
    stockCurrent?: number;

    @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Número no válido' })
    @Min(0, { message: 'El stock mínimo no puede ser negativo' })
    @IsOptional()
    stockMinimum?: number;
}