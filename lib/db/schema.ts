import { pgTable, text, timestamp, boolean, serial, integer } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('user'), // 'admin' or 'user'
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ---
export const repository = pgTable('repository', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  url: text('url').notNull(),
  language: text('language'),
  stars: integer('stars').default(0),
  syncedAt: timestamp('syncedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const deployment = pgTable('deployment', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  repositoryId: integer('repositoryId').notNull(),
  status: text('status').notNull(), // 'pending', 'building', 'live', 'failed'
  environment: text('environment').notNull(), // 'production', 'staging', 'preview'
  url: text('url'),
  commitSha: text('commitSha'),
  deployedAt: timestamp('deployedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const integration = pgTable('integration', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(), // 'github', 'vercel', 'database', etc.
  type: text('type').notNull(),
  config: text('config'), // JSON string
  isActive: boolean('isActive').notNull().default(true),
  lastSyncedAt: timestamp('lastSyncedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const auditLog = pgTable('auditLog', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  action: text('action').notNull(), // 'created', 'updated', 'deleted'
  entityType: text('entityType').notNull(), // 'repository', 'deployment', etc.
  entityId: text('entityId').notNull(),
  changes: text('changes'), // JSON string
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
