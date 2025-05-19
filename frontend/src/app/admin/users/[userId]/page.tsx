import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import { TransactionTable } from "@/app/admin/users/[userId]/components/transaction-table";
import Logo from "@/app/static/logo.jpg";
import { getUser, getUserTransactions, toMoneyString } from "@/app/utils";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUser(userId);
  
  if (!user) {
    return {
      title: "User Not Found | VIP Admin | Yeet"
    };
  }

  return {
    title: `${user.name} | VIP Admin | Yeet`
  };
}

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params;
  if (!userId) return notFound();

  const user = await getUser(userId);
  if (!user) return notFound();

  const transactions = await getUserTransactions(userId);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Image src={Logo} alt="Logo" width={40} height={40} className="rounded-md" />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold mb-1 text-white">
            {user.name} ({user.email}) - Balance: {toMoneyString(user.balance)}
          </h1>
          <h3 className="text-lg font-bold text-white">
          User ID: {user.id}
        </h3>
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2 text-gray-300">Transactions</h2>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
