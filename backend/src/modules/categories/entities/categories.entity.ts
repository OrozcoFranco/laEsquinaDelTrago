import { Products } from 'src/modules/products/entities/products.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity()
export class Categories{
    @PrimaryGeneratedColumn({ name: 'id_category' })
    id_category: number;

    @Column({ type: 'varchar', length: 60 })
    name: string;

    @OneToMany( () => Products, (products) => products.categories, { cascade: true })
    products: Products[];

}