import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sales } from "./sales.entity";
import { Products } from "src/modules/products/entities/products.entity";


@Entity()
export class SalesDetails{
    
    @PrimaryGeneratedColumn({name: 'id_detailsSales'})
    id_detailsSales: number;

    @Column({name: 'id_sale'})
    id_sale: number;

    @Column({name: 'id_product'})
    id_product: number;

    @Column({type: 'int'})
    amount: number;

    @Column({name: 'price_sale', type: 'decimal', precision: 10, scale: 2})
    price_sale: number;

    @ManyToMany( () => Sales, (sale) => sale.details)
    @JoinColumn({ name: 'id_sale'})
    sale: Sales[];

    @ManyToMany( () => Products)
    @JoinColumn({ name: 'id_product'})
    products: Products[];

}