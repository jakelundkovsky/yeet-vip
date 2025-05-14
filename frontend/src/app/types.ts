export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface Transaction {
    id: number;
    userId: number;
    amount: number;
    type: 'credit' | 'debit';
    createdAt: string;
}