import { User, Transaction } from "./types";

const BASE_API_URL = 'http://localhost:3001/api';

export async function getUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_API_URL}/users`, { cache: 'no-store' });
    const data = await res.json();
    return data.users;
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
    const res = await fetch(`${BASE_API_URL}/users/${userId}/transactions`, { cache: 'no-store' });
    const data = await res.json();
    return data.transactions;
}

export async function updateUserCredit(userId: string, amount: number): Promise<void> {
    await fetch(`${BASE_API_URL}/users/${userId}/credit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    });
}