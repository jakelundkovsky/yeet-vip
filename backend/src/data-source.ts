import "reflect-metadata";
import { DataSource } from "typeorm";

import { Transaction } from "./entities/transaction";
import { User } from "./entities/user";

const dbUrl = process.env['DATABASE_URL'] || "postgresql://postgres:postgres@localhost:5432/yeet_vip";
const url = new URL(dbUrl);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: url.hostname,
    port: parseInt(url.port || "5432"),
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1),
    synchronize: false,
    logging: true,
    entities: [User, Transaction],
    migrations: ["./src/migrations/*.ts"],
    subscribers: [],
}) 