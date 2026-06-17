import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Purchase } from '../../purchases/entities/purchases.entity';

@Entity('providers')
export class Provider {
    @PrimaryGeneratedColumn()
    id_provider!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @Column({ type: 'varchar', length: 20 })
    phone!: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255 })
    address!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    contactPerson?: string; // Persona de contacto en el proveedor

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany(() => Purchase, (purchase) => purchase.provider)
    purchases!: Purchase[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}