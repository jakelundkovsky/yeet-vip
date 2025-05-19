import { AdminPanel } from "@/app/admin/components/admin-panel";
import { getUsers } from "@/app/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIP Admin | Yeet",
};

export default async function AdminPage() {
  const { users, pagination } = await getUsers();

  return <AdminPanel initialUsers={users} initialPagination={pagination} />;
} 