import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Provider } from '../../providers/entities/providers.entity';
import { User } from '../../users/entities/user.entity';
import { PurchaseDetail } from './purchases-details.entity';

export enum PurchaseStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn()
    id_purchase!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    totalAmount!: number;

    @Column({
        type: 'enum',
        enum: PurchaseStatus,
        default: PurchaseStatus.COMPLETED,
    })
    status!: PurchaseStatus;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @ManyToOne(() => Provider, (provider) => provider.purchases)
    @JoinColumn({ name: 'id_provider' })
    provider!: Provider;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_user' })
    registeredBy!: User; // Quién registró la compra

    @OneToMany(() => PurchaseDetail, (detail) => detail.purchase, {
        cascade: true,
    })
    details!: PurchaseDetail[];

    @CreateDateColumn()
    createdAt!: Date;
}