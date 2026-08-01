import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { repository, deployment } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import UserNav from '@/components/user-nav'
import UserRepositoryList from '@/components/user-repository-list'
import UserDeploymentList from '@/components/user-deployment-list'

export default async function UserDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const [userRepos, userDeployments] = await Promise.all([
    db
      .select()
      .from(repository)
      .where(eq(repository.userId, session.user.id))
      .orderBy(desc(repository.createdAt)),
    db
      .select()
      .from(deployment)
      .where(eq(deployment.userId, session.user.id))
      .orderBy(desc(deployment.createdAt)),
  ])

  return (
    <div className="min-h-screen bg-background">
      <UserNav user={session.user} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">My Repositories</div>
            <div className="text-3xl font-bold text-foreground mt-2">{userRepos.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Deployments</div>
            <div className="text-3xl font-bold text-foreground mt-2">{userDeployments.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted-foreground">Member Since</div>
            <div className="text-sm text-foreground mt-2">
              {session.user.createdAt
                ? new Date(session.user.createdAt as unknown as string).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Repositories */}
          <div>
            <UserRepositoryList repositories={userRepos} />
          </div>

          {/* Deployments */}
          <div>
            <UserDeploymentList deployments={userDeployments} />
          </div>
        </div>
      </main>
    </div>
  )
}
