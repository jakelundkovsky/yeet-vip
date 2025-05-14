import { User, Transaction } from "./types";

export async function getUsers(): Promise<User[]> {
    const res = await fetch('http://localhost:3001/api/users', { cache: 'no-store' });
    const data = await res.json();
    return data.users;
}

export async function getUserTransactions(userId: number): Promise<Transaction[]> {
    const res = await fetch(`http://localhost:3001/api/users/${userId}/transactions`, { cache: 'no-store' });
    const data = await res.json();
    return data.transactions;
}