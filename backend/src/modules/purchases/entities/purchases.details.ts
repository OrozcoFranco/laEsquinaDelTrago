import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Purchases } from "./purchases.entity";
import { Products } from "src/modules/products/entities/products.entity";


@Entity()
export class PurchasesDetails{
@PrimaryGeneratedColumn({ name: 'id_purchaseDetails' })
    id_purchaseDetails: number;

    @Column({ type: 'int' })
    amount: number;

    @Column({ name: 'price_purchase', type: 'decimal', precision: 10, scale: 2 })
    price_purchase: number;

    @ManyToOne(() => Purchases, (purchase) => purchase.details)
    @JoinColumn({ name: 'id_purchase' })
    purchase: Purchases;

    @ManyToOne(() => Products, (product) => product.purchaseDetails)
    @JoinColumn({ name: 'id_product' })
    product: Products;

}

