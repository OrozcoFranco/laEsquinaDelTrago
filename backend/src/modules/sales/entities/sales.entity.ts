import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "src/modules/clients/entities/clients.entity";
import { SalesDetails } from "./salesDatails.entity";


@Entity()
export class Sales{
    @PrimaryGeneratedColumn({ name: 'id_purchase' })
    id_sale: number;

    @CreateDateColumn({ name : 'date'})
    date: Date;

    @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2})
    total: number;

    @ManyToMany(()=> Client)
    @JoinColumn({ name: 'id_client' })    
    id_client: number;

    @OneToMany( () => SalesDetails, (detail) => detail.sale, {cascade: true})
    details: SalesDetails[];

}