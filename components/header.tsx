"use client"

import { Button } from "@/components/ui/button"
import { User } from "firebase/auth"

interface HeaderProps {
  user: User | null
  onLogin: () => void
  onLogout: () => void
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        Job<span className="text-orange-500">Advisor</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user ? user.displayName : "Non loggato"}
        </span>
        {user ? (
          <Button variant="outline" size="sm" onClick={onLogout}>
            Logout
          </Button>
        ) : (
          <Button size="sm" onClick={onLogin}>
            Login
          </Button>
        )}
      </div>
    </header>
  )
}
