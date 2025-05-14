import { UserTable } from "../components/user-table";
import { getUsers } from "../utils";

export default async function AdminPage() {
  const users = await getUsers();

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Yeet VIP Admin Panel</h1>
      <UserTable users={users} />
    </div>
  );
} 