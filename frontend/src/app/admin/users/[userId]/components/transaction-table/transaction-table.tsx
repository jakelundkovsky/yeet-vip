'use client';

import { Transaction } from '@/app/types';
import { toMoneyString } from '@/app/utils';
import { useEffect, useState } from 'react';

interface Props {
    transactions: Transaction[];
}

export function TransactionTable({ transactions }: Props) {
  return (
    <div className="overflow-x-auto h-full flex flex-col">
      <div className="min-w-full w-full bg-gray-800 border border-gray-700 rounded-lg flex-1">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full">
          <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs">ID</div>
          <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs">Amount</div>
          <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs">Type</div>
          <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs">Transaction Date</div>
        </div>
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="grid grid-cols-[1fr_1fr_1fr_1fr] border-t border-gray-700 hover:bg-gray-700 text-xs"
          >
            <div className="px-3 py-2 text-gray-300" title={transaction.id}>
              {transaction.id}
            </div>
            <div className="px-3 py-2 text-gray-300">
              {toMoneyString(transaction.amount)}
            </div>
            <div className="px-3 py-2 text-gray-300">
              {transaction.type}
            </div>
            <div className="px-3 py-2 text-gray-300">
              <FormattedDate date={transaction.createdAt} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FormattedDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = useState<string>("");
  
  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleString());
  }, [date]);

  return <span>{formattedDate}</span>;
}
