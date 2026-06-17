import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sale } from './sales.entity';
import { Product } from '../../products/entities/products.entity';

@Entity('sale_details')
export class SaleDetail {
    @PrimaryGeneratedColumn()
    id_saleDetail!: number;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    salePrice!: number; // Precio al momento de la venta

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number; // quantity * salePrice

    @ManyToOne(() => Sale, (sale) => sale.details)
    @JoinColumn({ name: 'id_sale' })
    sale!: Sale;

    @ManyToOne(() => Product, (product) => product.saleDetails)
    @JoinColumn({ name: 'id_product' })
    product!: Product;
}