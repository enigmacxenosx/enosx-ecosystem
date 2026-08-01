# Enosx Ecosystem Management Dashboard

A comprehensive management platform for the Enosx ecosystem, providing admin and user dashboards to manage repositories, deployments, integrations, and users.

## Features

### Admin Dashboard
- **User Management**: View and manage all system users, assign admin roles
- **Repository Management**: Track all repositories across the ecosystem
- **Deployment Monitoring**: Monitor deployment status and history
- **Integration Management**: Manage third-party integrations
- **Audit Logging**: Comprehensive audit trail of all actions
- **Statistics**: Overview of users, repositories, and deployments

### User Dashboard
- **Personal Repositories**: View your assigned repositories
- **Deployment History**: Track your recent deployments
- **Status Monitoring**: Monitor deployment statuses in real-time
- **Quick Stats**: Overview of your activity and joining date

### Security
- Email/password authentication with Better Auth
- Role-based access control (admin/user)
- Session management with secure cookies
- Audit logging for all actions
- Per-user data scoping with Neon PostgreSQL

## Tech Stack

- **Frontend**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Deployment**: Vercel-ready Next.js app

## Database Schema

### Core Tables
- **user**: System users with roles (admin/user)
- **session**: User session management
- **account**: OAuth account linking (future)
- **verification**: Email verification tokens

### App Tables
- **repository**: Git repositories with metadata
- **deployment**: Deployment records with status tracking
- **integration**: Third-party integration configurations
- **auditLog**: Complete audit trail of system actions

## Getting Started

### Prerequisites
- Node.js 18+
- Neon PostgreSQL database
- Vercel deployment (or local development)

### Environment Setup

1. Set up environment variables:
```bash
# .env.local
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
```

2. Install dependencies:
```bash
pnpm install
```

3. Run dev server:
```bash
pnpm dev
```

4. Open http://localhost:3000

## Authentication

### Sign Up
- Navigate to `/sign-up`
- Create account with email and password
- New users are created with `user` role by default

### Sign In
- Navigate to `/sign-in`
- Enter credentials
- Redirected to appropriate dashboard based on role

### Admin Access
- Create initial admin account
- Use admin dashboard to promote other users to admin role
- Admins have access to `/admin` routes

## Routes

### Public Routes
- `/sign-in` - User login
- `/sign-up` - User registration

### Protected Routes (All Users)
- `/` - Home (redirects to dashboard)
- `/user` - User dashboard
- `/user/repositories` - User's repositories
- `/user/deployments` - User's deployments

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/repositories` - All repositories
- `/admin/users` - User management
- `/admin/integrations` - Integration management

## Server Actions

### Repository Actions
- `createRepository()` - Create new repository
- `updateRepository()` - Update repository metadata
- `deleteRepository()` - Delete repository
- `syncGitHubRepositories()` - Sync from GitHub (admin only)

### Deployment Actions
- `createDeployment()` - Record new deployment
- `updateDeploymentStatus()` - Update deployment status

### User Actions
- `updateUserRole()` - Promote/demote users (admin only)
- `getAllUsers()` - Fetch all users (admin only)
- `getAuditLogs()` - Fetch audit logs (admin only)

## Development

### Add a New Page
1. Create page in `app/<route>/page.tsx`
2. Add auth check and role validation
3. Create corresponding components in `components/`

### Add a New Database Table
1. Define schema in `lib/db/schema.ts`
2. Use Neon MCP to create table with `CREATE TABLE` statement
3. Create server actions in `app/actions/`

### Styling
- Uses semantic design tokens in `globals.css`
- Tailwind v4 with built-in theme system
- Dark mode by default

## Deployment

Deploy to Vercel:
```bash
vercel deploy
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`

## Architecture

### Client-Server Model
- RSC for initial page loads and data fetching
- Server actions for mutations
- SWR optional for client-side sync (future)

### Security Model
- No Row Level Security (Neon limitation)
- Every query filters by `userId` in server actions
- Session-based auth with secure cookies
- Audit logging for all mutations

### Data Flow
1. User requests page → RSC fetches data with userId filter
2. User submits form → Server action runs validation + mutation
3. Mutation logged to audit log
4. Response sent back to client
5. Cache revalidated for affected pages

## Future Enhancements

- GitHub API integration for automatic repo sync
- Webhook support for deployment tracking
- Real-time notifications
- Advanced filtering and search
- Export audit logs
- Multi-team support
- API tokens for programmatic access

## Support

For issues or questions, refer to the codebase documentation and Better Auth/Neon skill documentation.

## License

Private repository for Enosx Technologies
