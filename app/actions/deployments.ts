'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { deployment, auditLog } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createDeployment(data: {
  repositoryId: number
  status: string
  environment: string
  url?: string
  commitSha?: string
}) {
  const userId = await getUserId()

  const [newDeployment] = await db
    .insert(deployment)
    .values({
      userId,
      repositoryId: data.repositoryId,
      status: data.status,
      environment: data.environment,
      url: data.url,
      commitSha: data.commitSha,
      deployedAt: new Date(),
    })
    .returning()

  // Log action
  await db.insert(auditLog).values({
    userId,
    action: 'create',
    entityType: 'deployment',
    entityId: newDeployment.id.toString(),
    changes: JSON.stringify(data),
  })

  revalidatePath('/admin')
  revalidatePath('/user')

  return newDeployment
}

export async function updateDeploymentStatus(id: number, status: string) {
  const userId = await getUserId()

  const existing = await db
    .select()
    .from(deployment)
    .where(eq(deployment.id, id))
    .limit(1)

  if (!existing.length) throw new Error('Deployment not found')

  const [updated] = await db
    .update(deployment)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(deployment.id, id))
    .returning()

  // Log action
  await db.insert(auditLog).values({
    userId,
    action: 'update',
    entityType: 'deployment',
    entityId: id.toString(),
    changes: JSON.stringify({ status }),
  })

  revalidatePath('/admin')
  revalidatePath('/user')

  return updated
}
