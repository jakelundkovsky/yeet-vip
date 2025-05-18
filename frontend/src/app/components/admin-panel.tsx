'use client';

import Image from "next/image";
import { useState } from "react";

import { UserTable } from "@/app/components/user-table";
import Logo from "@/app/static/logo.jpg";
import { User } from "@/app/types";

interface AdminPanelProps {
  initialUsers: User[];
  initialPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export function AdminPanel({ initialUsers, initialPagination }: AdminPanelProps) {
  const [users, setUsers] = useState(initialUsers);
  const [pagination, setPagination] = useState(initialPagination);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <Image src={Logo} alt="Logo" width={40} height={40} className="rounded-md" />
        <h1 className="text-2xl font-bold text-white">VIP Admin Panel</h1>
      </div>

      <UserTable users={users} pagination={pagination} />
    </div>
  );
} 