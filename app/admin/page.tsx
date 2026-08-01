import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { user, repository, deployment, auditLog } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import AdminNav from '@/components/admin-nav'
import RepositoryList from '@/components/repository-list'
import UserList from '@/components/user-list'
import DeploymentStats from '@/components/deployment-stats'
import AuditLog from '@/components/audit-log'

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  if (session.user.role !== 'admin') {
    redirect('/user')
  }

  const [users, repos, deployments, logs] = await Promise.all([
    db.select().from(user).orderBy(desc(user.createdAt)),
    db.select().from(repository).orderBy(desc(repository.createdAt)).limit(50),
    db.select().from(deployment).orderBy(desc(deployment.createdAt)).limit(20),
    db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(30),
  ])

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={session.user} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-3xl font-bold text-foreground mt-2">{users.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Total Repositories</div>
            <div className="text-3xl font-bold text-foreground mt-2">{repos.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Recent Deployments</div>
            <div className="text-3xl font-bold text-foreground mt-2">{deployments.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Audit Logs</div>
            <div className="text-3xl font-bold text-foreground mt-2">{logs.length}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Repositories */}
          <div className="lg:col-span-2">
            <RepositoryList repositories={repos} />
          </div>

          {/* Deployment Stats */}
          <div>
            <DeploymentStats deployments={deployments} />
          </div>
        </div>

        {/* Users Management */}
        <div>
          <UserList users={users} />
        </div>

        {/* Audit Log */}
        <div>
          <AuditLog logs={logs} />
        </div>
      </main>
    </div>
  )
}
