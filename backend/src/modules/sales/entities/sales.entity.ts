import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/clients.entity';
import { User } from '../../users/entities/user.entity';
import { SaleDetail } from './sales-details.entity';

export enum SaleStatus {
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum PaymentMethod {
    CASH = 'cash',
    TRANSFER = 'transfer',
    CHECK = 'check',
}

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn()
    id_sale!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount!: number;

    @Column({
        type: 'enum',
        enum: SaleStatus,
        default: SaleStatus.COMPLETED,
    })
    status!: SaleStatus;

    @Column({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CASH,
    })
    paymentMethod!: PaymentMethod;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @ManyToOne(() => Client, (client) => client.sales)
    @JoinColumn({ name: 'id_client' })
    id_client!: Client;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_user' })
    registeredBy!: User;

    @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true })
    details!: SaleDetail[];

    @CreateDateColumn()
    createdAt!: Date;
}