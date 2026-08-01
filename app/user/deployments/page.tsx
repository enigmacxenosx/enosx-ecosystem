import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { deployment } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import UserNav from '@/components/user-nav'
import UserDeploymentList from '@/components/user-deployment-list'

export default async function UserDeployments() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const deployments = await db
    .select()
    .from(deployment)
    .where(eq(deployment.userId, session.user.id))
    .orderBy(desc(deployment.createdAt))

  return (
    <div className="min-h-screen bg-background">
      <UserNav user={session.user} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">My Deployments</h1>
          <p className="text-muted-foreground">
            Track your recent deployments
          </p>
        </div>

        <UserDeploymentList deployments={deployments} />
      </main>
    </div>
  )
}
