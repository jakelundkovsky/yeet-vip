import { UserTable } from "@/app/components/user-table";
import { getUsers } from "@/app/utils";
import Logo from "@/app/static/logo.jpg";
import Image from "next/image";

export default async function AdminPage() {
  const { users, pagination } = await getUsers();

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