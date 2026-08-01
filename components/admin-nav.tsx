'use client'

import { authClient } from '@/lib/auth-client'
import { User } from '@/lib/db/schema'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Settings } from 'lucide-react'

export default function AdminNav({ user }: { user: any }) {
  const router = useRouter()

  const handleLogout = async () => {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/admin" className="text-xl font-bold text-primary">
            Enosx Admin
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/repositories"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Repositories
            </Link>
            <Link
              href="/admin/users"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Users
            </Link>
            <Link
              href="/admin/integrations"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Integrations
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
