import { Categories } from 'src/modules/categories/entities/categories.entity';
import { PurchasesDetails } from 'src/modules/purchases/entities/purchases.details';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Products{
    @PrimaryGeneratedColumn({ name: 'id_product' })
    id_product: number;

    @Column({type: 'varchar', length: 60,})
    name: string;

    @Column({type: 'varchar', length: 60, nullable:true})
    brand: string;

    @Column({ name:'stock_current', type: 'int', default: 0})
    stock_current: number;

    @Column({ name:'stock_minimum', type: 'int', default: 0})
    stock_minimum: number;

    @ManyToOne( () => Categories, (categories) => categories.products)// con eager quiere decir que siempre vas a traer los datos relacionados, pero es recomendable hacerlo en el servicio
    @JoinColumn({ name: 'id_category' })
    categories: Categories; //no hay que colocar un array porque solo voy a pasar una categoria x producto

    @OneToMany( () => PurchasesDetails, (purchaseDetails) => purchaseDetails.id_purchaseDetails )
    purchaseDetails: PurchasesDetails[];



}