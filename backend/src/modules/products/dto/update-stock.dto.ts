import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';

export enum StockOperation {
    ADD = 'add',           // Sumar stock (entrada de mercadería)
    SUBTRACT = 'subtract', // Restar stock (salida/venta)
    SET = 'set',           // Establecer stock manualmente
}

export class UpdateStockDto {
    @IsInt()
    @IsNotEmpty({ message: 'La cantidad es obligatoria' })
    @Min(0)
    quantity!: number;

    @IsEnum(StockOperation, { message: 'La operación debe ser: add, subtract o set' })
    @IsNotEmpty()
    operation!: StockOperation;
}