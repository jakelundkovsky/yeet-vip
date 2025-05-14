'use client';

import { User } from "@/app/types";

interface Props {
    users: User[];
}

export function UserTable({ users }: Props) {
  return (
    <div className="overflow-x-auto">
    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
      <thead>
        <tr className="bg-gray-700">
          <th className="px-6 py-3 text-left text-gray-200">ID</th>
          <th className="px-6 py-3 text-left text-gray-200">Name</th>
          <th className="px-6 py-3 text-left text-gray-200">Email</th>
          <th className="px-6 py-3 text-left text-gray-200">Created At</th>
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
            <td className="px-6 py-4 text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}