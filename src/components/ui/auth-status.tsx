"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface User {
  id: number
  username: string
  role: string
}

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth")
        const data = await response.json()

        if (data.authenticated) {
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
      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "logout",
          username: "",
          password: "",
        }),
      })
      setUser(null)
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (loading) {
    return <div className="opacity-70">Loading...</div>
  }

  if (!user) {
    return (
      <div className="flex space-x-2">
        <Link href="/login">
          <Button variant="outline" size="sm" className="opacity-100">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
            Register
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm">
        <span className="opacity-70 mr-1">Signed in as</span>
        <span className="font-medium">{user.username}</span>
        {user.role === "admin" && (
          <span className="ml-1 text-xs bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded">
            Admin
          </span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="opacity-100"
        onClick={handleLogout}
      >
        Sign Out
      </Button>
    </div>
  )
}