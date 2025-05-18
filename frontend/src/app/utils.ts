import { User, Transaction } from "./types";

const BASE_API_URL = 'http://localhost:3001/api';

export async function getUser(userId: string): Promise<User> {
    const res = await fetch(`${BASE_API_URL}/users/${userId}`, { cache: 'no-store' });
    const data = await res.json();
    return data.user;
}

export async function getUsers(sortBy?: string, sortOrder?: 'ASC' | 'DESC', page?: number): Promise<{ users: User[]; pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
} }> {
    const params = new URLSearchParams();
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);
    if (page) params.append('page', page.toString());

    const res = await fetch(`${BASE_API_URL}/users?${params.toString()}`, { 
        cache: 'no-store',
        credentials: 'include'
    });
    const data = await res.json();

    return data;
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

export function toMoneyString(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}