"use client"

import { Button } from "@/components/ui/button"
import { LockIcon, LogOut } from "lucide-react"
import Link from "next/link"

interface NavbarProps {
  user?: any
  onLogout?: () => void
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <LockIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Safe Space</h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/files"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Files
            </Link>
            <Link
              href="/journal"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Journal
            </Link>
            <Link
              href="/settings"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Settings
            </Link>
            {onLogout && (
              <Button variant="outline" onClick={onLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
