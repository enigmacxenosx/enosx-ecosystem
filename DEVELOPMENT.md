# Development Guide

## Project Setup

### Initial Setup
```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Add your DATABASE_URL and BETTER_AUTH_SECRET to .env.local

# Start dev server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Directory Structure

```
app/
├── page.tsx                    # Home page (redirect logic)
├── layout.tsx                  # Root layout with metadata
├── sign-in/page.tsx            # Login page
├── sign-up/page.tsx            # Registration page
├── admin/
│   ├── page.tsx                # Admin dashboard
│   ├── repositories/page.tsx   # Repository management
│   ├── users/page.tsx          # User management
│   └── integrations/page.tsx   # Integration management
├── user/
│   ├── page.tsx                # User dashboard
│   ├── repositories/page.tsx   # User's repositories
│   └── deployments/page.tsx    # User's deployments
├── api/auth/[...all]/route.ts  # Better Auth handler
├── actions/                    # Server actions
│   ├── repositories.ts
│   ├── deployments.ts
│   └── users.ts
components/
├── auth-form.tsx               # Shared login/signup form
├── admin-nav.tsx               # Admin navigation
├── user-nav.tsx                # User navigation
├── repository-list.tsx         # Repository listing
├── deployment-stats.tsx        # Deployment statistics
├── audit-log.tsx               # Audit log viewer
├── user-list.tsx               # User list (admin)
├── user-repository-list.tsx    # User's repos
└── user-deployment-list.tsx    # User's deployments
lib/
├── auth.ts                     # Better Auth config
├── auth-client.ts              # Better Auth client
└── db/
    ├── index.ts                # Drizzle setup
    └── schema.ts               # Database schema
```

## Key Files to Know

### Authentication
- **`lib/auth.ts`**: Better Auth server configuration
  - Handles session management
  - Cookie configuration (with dev-mode overrides for iframe)
  - Database connection setup

- **`lib/auth-client.ts`**: Client-side auth helpers
  - Used by AuthForm component
  - Handles sign-in/sign-up requests

### Database
- **`lib/db/schema.ts`**: Drizzle ORM schema definitions
  - Better Auth tables (user, session, account, verification)
  - App tables (repository, deployment, integration, auditLog)
  - Column definitions and types

- **`lib/db/index.ts`**: Drizzle client singleton
  - Exports `db` instance for queries
  - Shares `pg.Pool` with Better Auth

### Server Actions
Each file exports actions for specific domains:

- **`app/actions/repositories.ts`**
  - `createRepository()`, `updateRepository()`, `deleteRepository()`
  - `syncGitHubRepositories()` (admin-only)
  - `getUserRepositories()`, `getAllRepositories()`

- **`app/actions/deployments.ts`**
  - `createDeployment()`, `updateDeploymentStatus()`
  - `getDeploymentHistory()`, `getUserDeployments()`

- **`app/actions/users.ts`**
  - `getAllUsers()`, `updateUserRole()`
  - `getAuditLogs()`, `logAction()`

## Adding Features

### Add a New Page
1. Create route directory in `app/<route>/`
2. Add `page.tsx` (server component for auth check)
3. Create corresponding components in `components/`
4. Import and use server actions for data

Example:
```tsx
// app/admin/settings/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import SettingsPanel from '@/components/settings-panel'

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/user')
  }
  
  return <SettingsPanel />
}
```

### Add a New Database Table
1. Add schema to `lib/db/schema.ts` using Drizzle
2. Create table in Neon using MCP SQL tool
3. Create server actions for CRUD operations
4. Create components to display/manage data

Example schema:
```ts
export const feature = pgTable('feature', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})
```

### Add a New Server Action
Server actions must:
1. Use `'use server'` directive
2. Call `getUserId()` helper to get current user
3. Validate user permissions
4. Scope all queries by `userId`
5. Log actions to auditLog table

Example:
```ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { feature } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createFeature(data: any) {
  const userId = await getUserId()
  
  const result = await db
    .insert(feature)
    .values({ userId, ...data })
    .returning()
  
  // Log action
  await logAction(userId, 'CREATE', 'feature', result[0].id)
  revalidatePath('/admin')
  
  return result[0]
}
```

## Styling

### Colors
- Primary: Blue (`#0066FF`)
- Secondary: Gray (`#F5F5F5`)
- Foreground: Black/Dark Gray
- Background: White/Light
- Border: Light Gray
- Muted: Medium Gray

### Using Design Tokens
In components, use semantic Tailwind classes:
```tsx
<div className="bg-background text-foreground border border-border">
  <button className="bg-primary text-primary-foreground hover:brightness-110">
    Action
  </button>
</div>
```

### Responsive Design
Mobile-first approach with Tailwind prefixes:
```tsx
<div className="p-4 md:p-8 lg:p-12">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Responsive Title
  </h1>
</div>
```

## Testing Locally

### Test Sign Up Flow
1. Go to `/sign-up`
2. Create account with test@example.com / password123
3. Redirected to home (which redirects to `/user`)
4. User dashboard displayed

### Test Admin Features (Manually)
1. Create regular user account
2. Connect to Neon database
3. Run: `UPDATE "user" SET "role" = 'admin' WHERE email = 'test@example.com'`
4. Sign out and sign in again
5. Access `/admin` routes

### Test Role Separation
1. Create two accounts: admin and user
2. Make one admin via database
3. Verify admin can access `/admin/*`
4. Verify regular user cannot access `/admin/*`

## Database Debugging

### Connect to Neon
```bash
# Using psql
psql "postgresql://user:password@host/database"

# Check tables
\dt

# View data
SELECT * FROM "user";
SELECT * FROM "repository";
SELECT * FROM "auditLog" ORDER BY "createdAt" DESC LIMIT 10;
```

### Common Queries
```sql
-- Find user by email
SELECT * FROM "user" WHERE email = 'test@example.com';

-- Get all repositories for user
SELECT * FROM "repository" WHERE "userId" = 'user-id';

-- Get recent deployments
SELECT * FROM "deployment" 
ORDER BY "createdAt" DESC 
LIMIT 20;

-- Audit trail for user
SELECT * FROM "auditLog" 
WHERE "userId" = 'user-id'
ORDER BY "createdAt" DESC;
```

## Common Issues

### Session Not Persisting
- Check `.env.local` for `BETTER_AUTH_SECRET`
- Verify browser cookies are enabled
- Check dev mode cookie override in `lib/auth.ts`

### Database Connection Errors
- Verify `DATABASE_URL` format
- Check Neon connection is pooled
- Ensure IP allowlist includes your dev machine

### Tailwind Styles Not Applying
- Run `pnpm dev` to rebuild
- Clear Next.js cache: `rm -rf .next`
- Check class names match Tailwind v4 syntax

### 404 on Protected Routes
- Verify page `page.tsx` exists in route
- Check auth redirect logic
- Use `next/navigation` for client redirects

## Performance Tips

1. **Use Server Components**: Default to server components, only use client for interactivity
2. **Minimize API Calls**: Fetch related data in one query when possible
3. **Cache Appropriately**: Use `revalidatePath()` after mutations
4. **Optimize Images**: Use Next.js `Image` component
5. **Bundle Size**: Check imports, avoid unused dependencies

## Contributing

1. Create feature branch from `enosx-technologies-management`
2. Make changes following patterns above
3. Test locally with `pnpm dev`
4. Commit with clear messages
5. Push to GitHub and create PR
6. Deploy via Vercel for preview
7. Merge after review

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Better Auth Docs](https://www.better-auth.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Neon Docs](https://neon.tech/docs)
