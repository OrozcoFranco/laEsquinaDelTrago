import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn  } from 'typeorm'
import { Product } from '../../products/entities/products.entity';

@Entity()
export class Category{
    @PrimaryGeneratedColumn({ name: 'id_category' })
    id_category!: number;

    @Column({ type: 'varchar', length: 60, unique: true})
    name!: string;

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany( () => Product, (products) => products.category, { cascade: true })
    products!: Product[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}