import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"

import { User } from "./user"

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column({ type: "decimal"})
    amount!: number

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user!: User

    @Column({ name: "user_id" })
    userId!: string

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date
}