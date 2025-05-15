'use client';

import { Transaction } from "@/app/types";

interface Props {
    transactions: Transaction[];
}

export function TransactionTable({ transactions }: Props) {
  return (
    <div className="overflow-x-auto h-full flex flex-col">
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg flex-1">
        <thead>
          <tr className="bg-gray-700 text-xs">
            <th className="px-3 py-2 text-left text-gray-200">ID</th>
            <th className="px-3 py-2 text-left text-gray-200">Amount</th>
            <th className="px-3 py-2 text-left text-gray-200">Created At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-gray-700 hover:bg-gray-700 text-xs">
              <td className="px-3 py-2 text-gray-300">{transaction.id}</td>
              <td className="px-3 py-2 text-gray-300">${Number(transaction.amount).toFixed(2)}</td>
              <td className="px-3 py-2 text-gray-300">{new Date(transaction.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 