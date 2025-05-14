import { TransactionTable } from "@/app/components/transaction-table";
import { getUserTransactions, getUsers } from "@/app/utils";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function UserDetailPage({ params }: Props) {
  const { userId: userIdString } = await params;
  if (!userIdString) return notFound();

  const userId = Number(userIdString);

  // Optionally fetch user for display (not just transactions)
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return notFound();

  const transactions = await getUserTransactions(userId);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">
        {user.name} ({user.email})
      </h1>
      <h2 className="text-lg font-semibold mb-2 text-gray-300">Transactions</h2>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
