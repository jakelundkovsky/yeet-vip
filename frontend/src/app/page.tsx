export default async function Home() {
  const users = await getUsers();

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">Yeet VIP Admin Panel</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-left text-gray-200">ID</th>
              <th className="px-6 py-3 text-left text-gray-200">Name</th>
              <th className="px-6 py-3 text-left text-gray-200">Email</th>
              <th className="px-6 py-3 text-left text-gray-200">Role</th>
              <th className="px-6 py-3 text-left text-gray-200">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700">
                <td className="px-6 py-4 text-gray-300">{user.id}</td>
                <td className="px-6 py-4 text-gray-300">{user.name}</td>
                <td className="px-6 py-4 text-gray-300">{user.email}</td>
                <td className="px-6 py-4 text-gray-300">{user.role}</td>
                <td className="px-6 py-4 text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

async function getUsers(): Promise<User[]> {
  const res = await fetch('http://localhost:3001/api/users', { cache: 'no-store' });
  const data = await res.json();
  return data.users;
}