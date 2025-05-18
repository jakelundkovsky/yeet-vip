export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    type: string;
    createdAt: string;
    updatedAt: string;
}