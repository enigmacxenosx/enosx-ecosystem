import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import Link from 'next/link'

export default async function SignUp() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Enosx Ecosystem</h1>
          <p className="text-muted-foreground">Management Dashboard</p>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Create Account</h2>
          <AuthForm mode="sign-up" />

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
