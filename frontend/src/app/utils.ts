import { User, Transaction } from "./types";

export async function getUsers(): Promise<User[]> {
    const res = await fetch('http://localhost:3001/api/users', { cache: 'no-store' });
    const data = await res.json();
    return data.users;
}

export async function getUserTransactions(userId: number): Promise<Transaction[]> {
    // const res = await fetch(`http://localhost:3001/api/users/${userId}/transactions`, { cache: 'no-store' });
    // const data = await res.json();

    return Promise.resolve([
        {
            id: 1,
            userId: 1,
            amount: 100,
            type: 'credit',
            createdAt: '2021-01-01',
        },
        {
            id: 2,
            userId: 1,
            amount: 100,
            type: 'debit',
            createdAt: '2021-01-02',
        },
    ]);
}