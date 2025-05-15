import { TransactionTable } from "@/app/admin/users/[userId]/components/transaction-table";
import { getUserTransactions, getUsers } from "@/app/utils";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params;
  if (!userId) return notFound();

  // optionally fetch user for display (not just transactions)
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return notFound();

  const transactions = await getUserTransactions(userId);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-xl font-bold mb-1 text-white">
        {user.name} ({user.email}) - Balance: ${user.balance}
      </h1>
      <h3 className="text-lg font-bold mb-4 text-white">
        User ID: {user.id}
      </h3>
      <h2 className="text-lg font-semibold mb-2 text-gray-300">Transactions</h2>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
