import { Purchases } from "src/modules/purchases/entities/purchases.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Providers{
    @PrimaryGeneratedColumn( { name: 'id_provider'} )
    id_provider: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'bigint' })
    phone: number;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    adress: string;

    @OneToMany(() => Purchases, (purchase) => purchase.providers)
    purchases: Purchases[];


}