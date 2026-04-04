import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Products } from 'src/modules/products/entities/products.entity';
import { Sales } from 'src/modules/sales/entities/sales.entity';


@Entity()
export class Client{

    @PrimaryGeneratedColumn({ name: 'id_client' })
    id_client: number;

    @Column( { type: 'varchar', length: 20} )
    name: string;

    @Column({type: 'varchar', length: 20})
    phone: number;

    @Column( { type: 'varchar', length: 20})
    adress: string;

    @Column(  { type: 'varchar', length: 20})
    type_client: string;

    @OneToMany( () => Products, products => products.id_product )
    products: Products[];

    @OneToMany( () => Sales, sales => sales.id_client )
    sales: Sales[];


}