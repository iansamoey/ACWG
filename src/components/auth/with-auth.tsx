'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface WithAuthProps {
  requireAdmin?: boolean
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requireAdmin = false }: WithAuthProps = {}
) {
  return function ProtectedPage(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'loading') return

      if (!session) {
        router.replace('/auth/login')
        return
      }

      if (requireAdmin && !session.user.isAdmin) {
        router.replace('/dashboard/userDashboard')
      }
    }, [session, status, router])

    if (status === 'loading') {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
    }

    if (!session) {
      return null
    }

    if (requireAdmin && !session.user.isAdmin) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

