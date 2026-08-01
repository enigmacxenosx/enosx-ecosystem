import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { repository } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import AdminNav from '@/components/admin-nav'
import RepositoryList from '@/components/repository-list'

export default async function AdminRepositories() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  if (session.user.role !== 'admin') {
    redirect('/user')
  }

  const repos = await db.select().from(repository).orderBy(desc(repository.createdAt))

  return (
    <div className="min-h-screen bg-background">
      <AdminNav user={session.user} />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">All Repositories</h1>
          <p className="text-muted-foreground">
            Manage all repositories across the enosx ecosystem
          </p>
        </div>

        <RepositoryList repositories={repos} />
      </main>
    </div>
  )
}
