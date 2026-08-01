import { Shield, User } from 'lucide-react'

interface UserItem {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
}

export default function UserList({ users }: { users: UserItem[] }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                Name
              </th>
              <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                Email
              </th>
              <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                Role
              </th>
              <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-secondary transition">
                <td className="py-3 px-4 text-sm text-foreground">{user.name}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <Shield className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span>{user.role}</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
