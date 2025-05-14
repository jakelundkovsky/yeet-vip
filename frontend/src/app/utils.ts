import { User } from "./types";

export async function getUsers(): Promise<User[]> {
    const res = await fetch('http://localhost:3001/api/users', { cache: 'no-store' });
    const data = await res.json();
    return data.users;
}