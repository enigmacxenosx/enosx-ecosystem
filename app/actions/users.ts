'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, auditLog } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

async function isAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.role === 'admin'
}

export async function updateUserRole(targetUserId: string, newRole: string) {
  const userId = await getUserId()
  const admin = await isAdmin()

  if (!admin) {
    throw new Error('Only admins can update user roles')
  }

  if (newRole !== 'admin' && newRole !== 'user') {
    throw new Error('Invalid role')
  }

  const [updated] = await db
    .update(user)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(user.id, targetUserId))
    .returning()

  // Log action
  await db.insert(auditLog).values({
    userId,
    action: 'update',
    entityType: 'user',
    entityId: targetUserId,
    changes: JSON.stringify({ role: newRole }),
  })

  revalidatePath('/admin')

  return updated
}

export async function getAllUsers() {
  const userId = await getUserId()
  const admin = await isAdmin()

  if (!admin) {
    throw new Error('Only admins can view all users')
  }

  return db.select().from(user).orderBy(user.createdAt)
}

export async function getAuditLogs(limit = 50) {
  const userId = await getUserId()
  const admin = await isAdmin()

  if (!admin) {
    throw new Error('Only admins can view audit logs')
  }

  return db.select().from(auditLog).orderBy(auditLog.createdAt).limit(limit)
}
