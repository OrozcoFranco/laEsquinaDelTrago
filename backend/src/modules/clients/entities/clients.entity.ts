import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Sale } from '../../sales/entities/sales.entity';
import { Product } from '../../products/entities/products.entity';


@Entity()
export class Client {

    @PrimaryGeneratedColumn({ name: 'id_client' })
    id_client!: number;

    @Column({ type: 'varchar', length: 20 })
    name!: string;

    @Column({ type: 'varchar', length: 20 })
    phone!: string;

    @Column({ type: 'varchar', length: 30 })
    adress!: string;

    @Column({ type: 'varchar', length: 30 })
    type_client!: string;

    @Column({ default: true })
    isActive!: boolean;


    @ManyToOne(() => Client, (client) => client.sales)
    @JoinColumn({ name: 'client_id' })
    client!: Client;

    @OneToMany(() => Product, products => products.id_product)
    products!: Product[];

    @OneToMany(() => Sale, sales => sales.id_client)
    sales!: Sale[];


}