import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './purchases.entity';
import { Product } from '../../products/entities/products.entity';

@Entity('purchase_details')
export class PurchaseDetail {
    @PrimaryGeneratedColumn()
    id_purchaseDetail!: number;

    @Column({ type: 'int' })
    quantity!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    purchasePrice!: number; // Precio al momento de la compra

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal!: number; // quantity * purchasePrice

    @ManyToOne(() => Purchase, (purchase) => purchase.details)
    @JoinColumn({ name: 'purchase_id' })
    purchase!: Purchase;

    @ManyToOne(() => Product, (product) => product.purchaseDetails)
    @JoinColumn({ name: 'id_product' })
    product!: Product;
}