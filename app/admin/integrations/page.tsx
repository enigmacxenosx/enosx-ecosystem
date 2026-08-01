import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { integration } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import AdminNav from '@/components/admin-nav'

export default async function AdminIntegrations() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  if (session.user.role !== 'admin') {
    redirect('/user')
  }

  const integrations = await db
    .select()
    .from(integration)
    .orderBy(desc(integration.createdAt))

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={session.user} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">
            Manage third-party integrations for the ecosystem
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-2 px-4 text-sm font-semibold text-muted-foreground">
                    Last Synced
                  </th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((int) => (
                  <tr key={int.id} className="border-b border-border hover:bg-secondary transition">
                    <td className="py-3 px-4 text-sm text-foreground">{int.name}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{int.type}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          int.isActive
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-gray-500/10 text-gray-600'
                        }`}
                      >
                        {int.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {int.lastSyncedAt
                        ? new Date(int.lastSyncedAt).toLocaleString()
                        : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
