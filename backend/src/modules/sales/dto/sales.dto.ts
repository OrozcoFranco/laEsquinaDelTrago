import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { PaymentMethod } from '../entities/sales.entity';

export class CreateSaleDetailDto {
    @IsInt()
    @IsNotEmpty({ message: 'El producto es obligatorio' })
    id_product!: number;

    @IsInt()
    @IsNotEmpty({ message: 'La cantidad es obligatoria' })
    @Min(1, { message: 'La cantidad debe ser mayor a 0' })
    quantity!: number;
}

export class CreateSaleDto {
    @IsInt()
    @IsNotEmpty({ message: 'El cliente es obligatorio' })
    id_client!: number;

    @IsEnum(PaymentMethod, {
        message: 'El método de pago debe ser: cash, transfer o check',
    })
    @IsNotEmpty({ message: 'El método de pago es obligatorio' })
    paymentMethod!: PaymentMethod;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSaleDetailDto)
    details!: CreateSaleDetailDto[];

    @IsString()
    @IsOptional()
    notes?: string; 
}