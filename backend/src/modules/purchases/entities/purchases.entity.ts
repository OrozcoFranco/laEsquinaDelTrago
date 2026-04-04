import { CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Providers } from "src/modules/providers/entities/providers.entity";
import { PurchasesDetails } from './purchases.details';
@Entity()
export class Purchases{
    @PrimaryGeneratedColumn({ name: 'id_purchase' })
    id_purchase: number;

    @CreateDateColumn({ name: 'date', type: 'timestamp' })
    date: Date;

    @ManyToOne(() => Providers, (provider) => provider.purchases)
    @JoinColumn({ name: 'id_provider' })
    providers: Providers;


    @OneToMany(() => PurchasesDetails, (detail) => detail.purchase)
    details: PurchasesDetails[];
}