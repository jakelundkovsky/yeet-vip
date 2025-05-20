import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import { User } from './user';

export enum TransactionType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    BET = 'bet',
    WIN = 'win',
    ADMIN_ADJUST = 'admin-adjust',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id!: string;

    @Column({ type: 'decimal' })
    amount!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'user_id' })
    userId!: string;

    @Column({
        name: 'type',
        type: 'enum',
        enum: TransactionType,
    })
    type!: TransactionType;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}