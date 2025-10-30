"use client"

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth'
import { useEffect } from 'react'

export default function ProtectedRoute({ role, children }: { 
  role: 'service_provider' | 'home_owner', 
  children: React.ReactNode 
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== role)) {
      router.push('/login')
    }
  }, [user, isLoading, role, router])

  if (isLoading || !user || user.role !== role) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}