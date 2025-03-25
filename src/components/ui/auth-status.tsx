"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
}

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated by trying to get user data
        const response = await fetch("/api/auth/me")
        
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return <div className="opacity-70 text-sm">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <Link href="/login" className="w-full">
          <Button variant="outline" size="sm" className="opacity-100 w-full">
            Sign In
          </Button>
        </Link>
        <Link href="/register" className="w-full">
          <Button size="sm" className="w-full">
            Register
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-4">
      <div className="text-xs sm:text-sm text-center sm:text-left">
        <span className="opacity-70 mr-1">Signed in as</span>
        <span className="font-medium">{user.name}</span>
        <div className="text-xs opacity-70 truncate max-w-[120px]">{user.email}</div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="opacity-100 w-full sm:w-auto"
        onClick={handleLogout}
      >
        Sign Out
      </Button>
    </div>
  )
}