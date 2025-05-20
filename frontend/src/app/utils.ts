import { User, Transaction } from './types';

const isServer = typeof window === 'undefined';

function getBaseUrl() {
    if (isServer) {
        return 'http://backend:3001/api';
    }

    return process.env.NEXT_PUBLIC_API_URL 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
        : 'http://localhost:3001/api';
}

const defaultFetchOptions: RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    ...(isServer ? {} : { credentials: 'include' }),
    cache: 'no-store'
};

async function fetchWithError(url: string, options: RequestInit = {}): Promise<Response> {
    const baseUrl = getBaseUrl();
    const fetchUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    
    const response = await fetch(fetchUrl, {
        ...defaultFetchOptions,
        ...options,
        headers: {
            ...defaultFetchOptions.headers,
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response;
}

export async function getUser(userId: string): Promise<User> {
    const res = await fetchWithError(`/users/${userId}`);
    const data = await res.json();
    return data?.user || null;
}

export async function getUsers(sortBy?: string, sortOrder?: 'ASC' | 'DESC', page?: number): Promise<{
    users: User[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    }
    error: string | null;
}> {
    const params = new URLSearchParams();
    
    if (sortBy) {
        params.append('sortBy', sortBy);
    }
    if (sortOrder) {
        params.append('sortOrder', sortOrder);
    }
    if (page) {
        params.append('page', page.toString());
    }

    const queryString = params.toString();
    const res = await fetchWithError(`/users${queryString ? `?${queryString}` : ''}`);
    return await res.json();
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
    const res = await fetchWithError(`/transactions/user/${userId}`);
    const data = await res.json();
    return data?.transactions || [];
}

export async function updateUserCredit(userId: string, amount: number): Promise<void> {
    await fetchWithError(`/users/${userId}/balance`, {
        method: 'PUT',
        body: JSON.stringify({ amount }),
    });
}

export function toMoneyString(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}