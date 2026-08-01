'use client'

import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function UserNav({ user }: { user: any }) {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/user" className="text-xl font-bold text-primary">
            Enosx Ecosystem
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/user"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Dashboard
            </Link>
            <Link
              href="/user/repositories"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Repositories
            </Link>
            <Link
              href="/user/deployments"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Deployments
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground hover:text-foreground"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
