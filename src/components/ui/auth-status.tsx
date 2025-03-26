"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AuthStatus() {
  // Authentication is disabled - showing welcome message instead
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs sm:text-sm text-center sm:text-left">
        <span className="font-medium">Welcome to Horse Racing Predictor</span>
      </div>
      <Link href="/community">
        <Button
          variant="outline"
          size="sm"
          className="opacity-100"
        >
          Community
        </Button>
      </Link>
    </div>
  )
}