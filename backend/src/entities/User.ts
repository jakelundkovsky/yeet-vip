import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Transaction } from "./Transaction"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column()
    name!: string

    @Column({ unique: true })
    email!: string

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    balance!: number

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions!: Transaction[]
} 