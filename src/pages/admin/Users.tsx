import { useStore } from '../../store';
import { Shield, User as UserIcon } from 'lucide-react';

export default function AdminUsers() {
  const { users } = useStore();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-serif font-bold text-amber-950 mb-8">Registered Users</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/50 border-b border-amber-900/10 text-amber-900/60 text-sm">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-amber-900/5 last:border-0 hover:bg-amber-50/30 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      {user.role === 'admin' ? <Shield size={18} /> : <UserIcon size={18} />}
                    </div>
                    <div>
                      <div className="font-bold text-amber-950">{user.name}</div>
                      <div className="text-xs text-amber-900/60">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-amber-900/60">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
