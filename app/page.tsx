import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  // Redirect based on role
  if (session.user.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/user')
  }
}
