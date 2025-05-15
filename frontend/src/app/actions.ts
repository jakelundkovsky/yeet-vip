'use server';

import { getUsers } from './utils';

export async function fetchUsers(sortBy: string, sortOrder: 'ASC' | 'DESC', page: number) {
  return getUsers(sortBy, sortOrder, page);
} 