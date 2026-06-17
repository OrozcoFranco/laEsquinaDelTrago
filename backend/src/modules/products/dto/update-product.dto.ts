import { IsInt, IsNumber, IsString, MaxLength, Min, IsOptional, IsBoolean, IsPositive } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    @MaxLength(60)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(60)
    brand?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    presentation?: string;

    @IsInt()
    @IsOptional()
    id_category?: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @IsOptional()
    purchasePrice?: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @IsOptional()
    salePrice?: number;

    @IsNumber({ maxDecimalPlaces: 0 })
    @Min(0)
    @IsOptional()
    stockCurrent?: number;

    @IsNumber({ maxDecimalPlaces: 0 })
    @Min(0)
    @IsOptional()
    stockMinimum?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}