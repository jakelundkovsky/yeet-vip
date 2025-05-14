'use client';

import { User } from "@/app/types";
import { updateUserCredit } from "@/app/utils";
import { useState } from "react";

interface Props {
    users: User[];
}

export function UserTable({ users }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleShowCreditInput = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingUserId(user.id);
    setSelectedUser(user);
  };

  const handleApplyCredit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (selectedUser) {
      await updateUserCredit(selectedUser.id, amount);
      setShowConfirm(false);
      setSelectedUser(null);
      setAmount(0);
      setEditingUserId(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left text-gray-200">ID</th>
              <th className="px-6 py-3 text-left text-gray-200">Name</th>
              <th className="px-6 py-3 text-left text-gray-200">Email</th>
              <th className="px-6 py-3 text-left text-gray-200">Balance</th>
              <th className="px-6 py-3 text-left text-gray-200">Created At</th>
              <th className="px-6 py-3 text-left text-gray-200 w-[280px]">Credit/Debit</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer"
                onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
              >
                <td className="px-6 py-4 text-gray-300">{user.id}</td>
                <td className="px-6 py-4 text-gray-300">{user.name}</td>
                <td className="px-6 py-4 text-gray-300">{user.email}</td>
                <td className="px-6 py-4 text-gray-300">${Number(user.balance).toFixed(2)}</td>
                <td className="px-6 py-4 text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-gray-300">
                  <div className="flex items-center gap-2 w-[280px]" onClick={e => e.stopPropagation()}>
                    {editingUserId === user.id ? (
                      <>
                        <input
                          type="number"
                          placeholder="Amount"
                          className="w-24 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600"
                          onChange={(e) => {
                            setAmount(Number(e.target.value));
                            setSelectedUser(user);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleApplyCredit}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          disabled={!amount}
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => {
                            setEditingUserId(null);
                            setAmount(0);
                          }}
                          className="text-gray-400 hover:text-gray-300 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => handleShowCreditInput(user, e)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Credit/Debit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded-lg w-80">
            <p className="text-gray-300 mb-4">
              Confirm {amount > 0 ? 'credit' : 'debit'} of ${Math.abs(amount)} for {selectedUser?.name}?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}