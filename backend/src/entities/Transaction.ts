import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    // consideration: crypto and decimal
    @Column({ type: "decimal", precision: 10, scale: 2 })
    amount!: number

    @ManyToOne(() => User, user => user.transactions)
    @JoinColumn({ name: "userId" })
    user!: User

    @Column()
    userId!: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
} 