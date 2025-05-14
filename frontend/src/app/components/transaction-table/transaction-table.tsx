'use client';

import { Transaction } from "@/app/types";

interface Props {
    transactions: Transaction[];
}

export function TransactionTable({ transactions }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-6 py-3 text-left text-gray-200">ID</th>
            <th className="px-6 py-3 text-left text-gray-200">User ID</th>
            <th className="px-6 py-3 text-left text-gray-200">Amount</th>
            <th className="px-6 py-3 text-left text-gray-200">Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-gray-700 hover:bg-gray-700">
              <td className="px-6 py-4 text-gray-300">{transaction.id}</td>
              <td className="px-6 py-4 text-gray-300">{transaction.userId}</td>
              <td className="px-6 py-4 text-gray-300">${Number(transaction.amount).toFixed(2)}</td>
              <td className="px-6 py-4 text-gray-300">{new Date(transaction.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 