'use client';

import { User } from "@/app/types";
import { updateUserCredit } from "@/app/utils";
import { fetchUsers } from "@/app/actions";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

interface Props {
    users: User[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

export function UserTable({ users: initialUsers, pagination: initialPagination }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [pagination, setPagination] = useState(initialPagination);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const usersPerPage = pagination.itemsPerPage;

  useEffect(() => {
    const fetchSortedUsers = async () => {
      const { users: sortedUsers, pagination: newPagination } = await fetchUsers(sortBy, sortOrder, currentPage);
      console.log('Fetched users:', sortedUsers);
      console.log('New pagination:', newPagination);
      setUsers(sortedUsers);
      setPagination(newPagination);
    };
    fetchSortedUsers();
  }, [sortBy, sortOrder, currentPage]);

  const currentUsers = users;

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <span className="ml-1 text-gray-400">↕</span>;
    return <span className="ml-1">{sortOrder === 'ASC' ? '↑' : '↓'}</span>;
  };

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
      try {
        await updateUserCredit(selectedUser.id, amount);

        setShowConfirm(false);
        setSelectedUser(null);
        setAmount(0);
        setEditingUserId(null);
        
        toast.success(`Success! ${selectedUser.name}'s balance updated by $${amount}`);

      } catch (error) {
        toast.error('Failed to update user balance. Please try again.');
      }
    }
  };

  const handlePageChange = async (page: number) => {
    const { users: newUsers, pagination: newPagination } = await fetchUsers(sortBy, sortOrder, page);
    setCurrentPage(page);
    setUsers(newUsers);
    setPagination(newPagination);
  };

  return (
    <>
      <div className="overflow-x-auto h-full flex flex-col">
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg flex-1">
          <thead>
            <tr className="bg-gray-700 text-xs">
              <th className="px-3 py-2 text-left text-gray-200 w-[110px]">ID</th>
              <th 
                className="px-3 py-2 text-left text-gray-200 cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon field="name" />
              </th>
              <th 
                className="px-3 py-2 text-left text-gray-200 w-[160px] cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('email')}
              >
                Email <SortIcon field="email" />
              </th>
              <th 
                className="px-3 py-2 text-left text-gray-200 cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('balance')}
              >
                Balance <SortIcon field="balance" />
              </th>
              <th 
                className="px-3 py-2 text-left text-gray-200 cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort('createdAt')}
              >
                Created At <SortIcon field="createdAt" />
              </th>
              <th className="px-3 py-2 text-left text-gray-200 w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer text-xs"
                onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
              >
                <td className="px-3 py-2 text-gray-300 max-w-[110px] truncate" title={user.id}>
                  {user.id.slice(0, 6)}...{user.id.slice(-4)}
                </td>
                <td className="px-3 py-2 text-gray-300">{user.name}</td>
                <td className="px-3 py-2 text-gray-300 max-w-[160px] truncate" title={user.email}>
                  {user.email.length > 18 ? `${user.email.slice(0, 10)}...${user.email.slice(-8)}` : user.email}
                </td>
                <td className="px-3 py-2 text-gray-300">${Number(user.balance).toFixed(2)}</td>
                <td className="px-3 py-2 text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-gray-300">
                  <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                    {editingUserId === user.id ? (
                      <>
                        <input
                          type="number"
                          placeholder="Amt"
                          className="w-16 px-1 py-0.5 bg-gray-700 text-white rounded border border-gray-600 text-xs"
                          onChange={(e) => {
                            setAmount(Number(e.target.value));
                            setSelectedUser(user);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={handleApplyCredit}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded text-base border border-green-400 shadow-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
                          disabled={!amount}
                          title="Apply"
                        >
                          <span className="text-white">✓</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingUserId(null);
                            setAmount(0);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-base border border-red-400 shadow-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
                          title="Cancel"
                        >
                          <span className="text-white">X</span>
                        </button>
                      </>
                    ) : (
                      <div className="relative group">
                        <button
                          onClick={(e) => handleShowCreditInput(user, e)}
                          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-xs flex items-center justify-center"
                          title="Credit/Debit"
                        >
                          <span className="material-icons text-sm whitespace-nowrap">credit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center gap-2 mt-4 mb-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="cursor-pointer px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-300">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="cursor-pointer px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
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
                className="cursor-pointer px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="cursor-pointer px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
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