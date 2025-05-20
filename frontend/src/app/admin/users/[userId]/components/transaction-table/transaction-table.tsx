'use client';

import { useEffect, useState } from 'react';

import { Transaction } from '@/app/types';
import { toMoneyString } from '@/app/utils';

interface Props {
    transactions: Transaction[];
}

export function TransactionTable({ transactions }: Props) {
 const headerClassName = "px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10";
 const headerNames = ['ID', 'Amount', 'Type', 'Transaction Date'];

  if (!transactions.length) {
    return (
      <div className="overflow-x-auto h-full flex flex-col rounded-lg">
        <div className="min-w-full w-full bg-gray-800 border border-gray-700 flex-1 rounded-lg">
          <div className="grid grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_1.2fr] w-full">
            {headerNames.map((name) => (
              <div key={name} className={headerClassName}>
                {name}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 place-items-center h-32">
            <span className="text-gray-400 text-sm">No transactions yet</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto h-full flex flex-col">
      <div className="min-w-full w-full bg-gray-800 border border-gray-700 rounded-lg flex-1">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr] w-full">
          {headerNames.map((name) => (
            <div key={name} className={headerClassName}>
              {name}
            </div>
          ))}
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
