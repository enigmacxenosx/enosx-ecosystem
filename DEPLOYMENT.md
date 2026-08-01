# Deployment Guide

## Vercel Deployment

This application is optimized for deployment on Vercel.

### Prerequisites
- GitHub account connected to Vercel
- Neon PostgreSQL database
- Environment variables configured

### Step 1: Connect GitHub Repository
1. Push code to GitHub (already done on branch `enosx-technologies-management`)
2. Go to [vercel.com](https://vercel.com)
3. Click "Add New" → "Project"
4. Import the GitHub repository: `enigmacxenosx/enosx-ecosystem`
5. Select the `enosx-technologies-management` branch

### Step 2: Configure Environment Variables
In the Vercel project settings, add the following environment variables:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
```

The `DATABASE_URL` should be your Neon connection string with connection pooling enabled.

### Step 3: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Access the app at the provided Vercel URL

### Step 4: First Admin Setup
1. Navigate to `/sign-up`
2. Create first account (will be created with `user` role by default)
3. Stop the deployment and manually update the user role to `admin` in Neon:
   ```sql
   UPDATE "user" SET "role" = 'admin' WHERE email = 'your-email@example.com';
   ```
4. Or use the admin dashboard to promote users (if you have another admin account)

## Production Configuration

### Security Headers
The app includes hardened security headers in `next.config.js`:
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Strict-Transport-Security: max-age=63072000

### Database Connection
For production, use:
- **Pooled connection** for HTTP/serverless functions
- **Unpooled connection** for long-running processes (not applicable here)

The app uses pooled connections via `pg.Pool` with the pooled connection string.

### Session Security
- Secure cookies with SameSite=Strict in production
- Session tokens are httpOnly and secure
- Automatic session cleanup (expired sessions removed)

## Troubleshooting

### Build Fails: Database URL Not Found
Ensure `DATABASE_URL` is set in Vercel environment variables before deploying.

### Authentication Not Working
1. Verify `BETTER_AUTH_SECRET` is set and is at least 32 characters
2. Check that the database tables exist in Neon (should be created before first deployment)
3. Review Better Auth logs in Vercel dashboard

### 500 Errors After Deployment
1. Check Vercel function logs
2. Verify database connection is working: `SELECT 1`
3. Ensure all env vars are properly set

## Development vs Production

### Development
- Hot module reloading enabled
- Verbose logging
- Relaxed CORS for cross-origin iframe (v0 preview)
- SameSite=None cookies for iframe session persistence

### Production
- Optimized build with Turbopack
- Production-grade logging
- Strict CORS policies
- SameSite=Strict cookies
- Security headers enforced

## Monitoring

Monitor these areas in production:
1. **Database Performance**: Check Neon dashboard for connection pooling
2. **Function Runtime**: Monitor Vercel analytics for function duration
3. **Error Rates**: Set up error tracking in Vercel
4. **User Growth**: Track new signups and deployments

## Scaling

The app is designed to scale horizontally:
- Stateless functions (no server-side session storage beyond database)
- Database connection pooling handles concurrent users
- Static assets cached on Vercel CDN

No changes needed for scaling up to thousands of users.

## Maintenance

### Regular Tasks
1. Monitor database disk usage
2. Review audit logs monthly
3. Update dependencies quarterly
4. Test disaster recovery (database backups)

### Backup Strategy
Neon automatically backs up daily. To restore:
1. Go to Neon dashboard
2. Select project
3. Use restore from backup feature
4. Update DATABASE_URL if needed

## Rollback

To rollback a deployment:
1. Go to Vercel project
2. Click on "Deployments"
3. Select previous successful deployment
4. Click "Promote to Production"

No database migration needed as deployments don't change schema automatically.

## Next Steps

1. Push to main branch and merge PR
2. Deploy to production via Vercel
3. Create first admin account
4. Invite team members to start using the dashboard
5. Configure GitHub token for automatic repo syncing (future enhancement)
