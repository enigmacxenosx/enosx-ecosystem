import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { repository } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import UserNav from '@/components/user-nav'
import UserRepositoryList from '@/components/user-repository-list'

export default async function UserRepositories() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const repos = await db
    .select()
    .from(repository)
    .where(eq(repository.userId, session.user.id))
    .orderBy(desc(repository.createdAt))

  return (
    <div className="min-h-screen bg-background">
      <UserNav user={session.user} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">My Repositories</h1>
          <p className="text-muted-foreground">
            View all your repositories in the ecosystem
          </p>
        </div>

        <UserRepositoryList repositories={repos} />
      </main>
    </div>
  )
}
