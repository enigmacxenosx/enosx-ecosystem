'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { repository, auditLog } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createRepository(data: {
  name: string
  description?: string
  url: string
  language?: string
}) {
  const userId = await getUserId()

  const [newRepo] = await db
    .insert(repository)
    .values({
      userId,
      name: data.name,
      description: data.description,
      url: data.url,
      language: data.language,
      syncedAt: new Date(),
    })
    .returning()

  // Log action
  await db.insert(auditLog).values({
    userId,
    action: 'create',
    entityType: 'repository',
    entityId: newRepo.id.toString(),
    changes: JSON.stringify(data),
  })

  revalidatePath('/admin')
  revalidatePath('/user')

  return newRepo
}

export async function updateRepository(id: number, data: {
  name?: string
  description?: string
  language?: string
  stars?: number
}) {
  const userId = await getUserId()

  const existing = await db
    .select()
    .from(repository)
    .where(eq(repository.id, id))
    .limit(1)

  if (!existing.length) throw new Error('Repository not found')

  const [updated] = await db
    .update(repository)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(repository.id, id))
    .returning()

  // Log action
  await db.insert(auditLog).values({
    userId,
    action: 'update',
    entityType: 'repository',
    entityId: id.toString(),
    changes: JSON.stringify(data),
  })

  revalidatePath('/admin')
  revalidatePath('/user')

  return updated
}

export async function deleteRepository(id: number) {
  const userId = await getUserId()

  await db.delete(repository).where(eq(repository.id, id))

  // Log action
  await db.insert(auditLog).values({
    userId,
    action: 'delete',
    entityType: 'repository',
    entityId: id.toString(),
  })

  revalidatePath('/admin')
  revalidatePath('/user')
}

export async function syncGitHubRepositories() {
  const userId = await getUserId()
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user?.role !== 'admin') {
    throw new Error('Only admins can sync repositories')
  }

  // This would integrate with GitHub API
  // For now, this is a placeholder for the sync logic
  console.log('Syncing repositories from GitHub...')

  revalidatePath('/admin')
}
