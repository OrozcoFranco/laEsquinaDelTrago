import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/categories.entity';
import { PurchaseDetail } from '../../purchases/entities/purchases-details.entity';
import { SaleDetail } from '../../sales/entities/sales-details.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id_product!: number;

    @Column({ type: 'varchar', length: 60 })
    name!: string;

    @Column({ type: 'varchar', length: 60, nullable: true })
    brand!: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    presentation!: string; // 500ml, 1L, 2.25L, lata, etc.

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    purchasePrice!: number; // Precio de costo

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    salePrice!: number; // Precio de venta

    @Column({ type: 'int', default: 0 })
    stockCurrent!: number;

    @Column({ type: 'int', default: 0 })
    stockMinimum!: number; // Alerta de stock bajo

    @Column({ default: true })
    isActive!: boolean;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'id_category' })
    category!: Category;

    @OneToMany(() => PurchaseDetail, (detail) => detail.product)
    purchaseDetails!: PurchaseDetail[];

    @OneToMany(() => SaleDetail, (detail) => detail.product)
    saleDetails!: SaleDetail[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}