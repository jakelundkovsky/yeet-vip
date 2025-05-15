'use client';

import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';

import { fetchUsers } from "@/app/actions";
import { User } from "@/app/types";
import { updateUserCredit } from "@/app/utils";

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

        // Refetch users to update the table
        const { users: updatedUsers, pagination: newPagination } = await fetchUsers(sortBy, sortOrder, currentPage);
        setUsers(updatedUsers);
        setPagination(newPagination);

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

  if (!currentUsers?.length) {
    return (
      <div className="overflow-x-auto h-full flex flex-col rounded-lg">
        <div className="min-w-full w-full bg-gray-800 border border-gray-700 flex-1 rounded-lg">
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1.5fr] w-full">
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">ID</div>
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">Name</div>
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">Email</div>
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">Balance</div>
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">Member Since</div>
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">Actions</div>
          </div>
          <div className="grid grid-cols-1 place-items-center h-32">
            <span className="text-gray-400 text-sm">No users yet</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto h-full flex flex-col">
        <div className="min-w-full w-full bg-gray-800 border border-gray-700 rounded-lg flex-1">
          <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1.5fr] w-full">
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">ID</div>
            <div 
              className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs cursor-pointer hover:bg-gray-600 flex items-center h-10"
              onClick={() => handleSort('name')}
            >
              Name <SortIcon field="name" />
            </div>
            <div 
              className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs cursor-pointer hover:bg-gray-600 flex items-center h-10"
              onClick={() => handleSort('email')}
            >
              Email <SortIcon field="email" />
            </div>
            <div 
              className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs cursor-pointer hover:bg-gray-600 flex items-center h-10"
              onClick={() => handleSort('balance')}
            >
              Balance <SortIcon field="balance" />
            </div>
            <div 
              className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs cursor-pointer hover:bg-gray-600 flex items-center h-10"
              onClick={() => handleSort('createdAt')}
            >
              Member Since <SortIcon field="createdAt" />
            </div>
            <div className="px-3 py-2 text-left text-gray-200 bg-gray-700 text-xs flex items-center h-10">Actions</div>
          </div>
          {currentUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_1.5fr] border-t border-gray-700 hover:bg-gray-700 cursor-pointer text-xs h-10"
              onClick={() => window.open(`/admin/users/${user.id}`, '_blank')}
            >
              <div className="px-3 py-2 text-gray-300 truncate flex items-center" title={user.id}>
                {user.id}
              </div>
              <div className="px-3 py-2 text-gray-300 truncate flex items-center" title={user.name}>
                {user.name}
              </div>
              <div className="px-3 py-2 text-gray-300 truncate flex items-center" title={user.email}>
                {user.email}
              </div>
              <div className="px-3 py-2 text-gray-300 flex items-center">
                ${Number(user.balance).toFixed(2)}
              </div>
              <div className="px-3 py-2 text-gray-300 flex items-center">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="px-3 py-2 text-gray-300 flex items-center" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1 w-full h-6">
                  {editingUserId === user.id ? (
                    <>
                      <input
                        type="number"
                        placeholder="Amt"
                        className="w-16 px-1 py-0.5 bg-gray-700 text-white rounded border border-gray-600 text-xs h-6"
                        onChange={(e) => {
                          setAmount(Number(e.target.value));
                          setSelectedUser(user);
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleApplyCredit}
                        className="bg-green-600 hover:bg-green-700 text-white px-1.5 py-0.5 rounded text-sm border border-green-400 shadow-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer ml-1 mr-0.5 h-6"
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
                        className="bg-red-600 hover:bg-red-700 text-white px-1.5 py-0.5 rounded text-sm border border-red-400 shadow-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer mx-0.5 h-6"
                        title="Cancel"
                      >
                        <span className="text-white">X</span>
                      </button>
                    </>
                  ) : (
                    <div className="relative group">
                      <button
                        onClick={(e) => handleShowCreditInput(user, e)}
                        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-xs flex items-center justify-center h-6"
                        title="Credit/Debit"
                      >
                        <span className="material-icons text-sm whitespace-nowrap">credit</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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