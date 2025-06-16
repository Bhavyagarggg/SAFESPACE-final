"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  LockIcon,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
  FileText,
  BookOpen,
  Settings,
  Home,
  Upload,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TopNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    { name: "Home", href: "/home", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Files", href: "/files", icon: <FileText className="h-4 w-4 mr-2" /> },
    { name: "Journal", href: "/journal", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-4 w-4 mr-2" /> },
  ]

  // Admin users get additional navigation options
  const isAdmin = user?.email === "admin@safespace.com" || user?.user_metadata?.role === "admin"
  if (isAdmin) {
    navItems.push({ name: "Dashboard", href: "/admin", icon: <BarChart className="h-4 w-4 mr-2" /> })
  }

  const handleLogout = async () => {
    try {
      // Clear demo user if exists
      localStorage.removeItem("safeSpaceUser")

      // Sign out from Supabase if logged in
      if (user) {
        await signOut()
      }

      router.push("/auth")
    } catch (error) {
      console.error("Error during sign out:", error)
      router.push("/auth")
    }
  }

  // Handle demo user case
  const demoUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("safeSpaceUser") || "null") : null
  const displayUser = user || demoUser

  if (loading && !demoUser) return null

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <LockIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Safe Space</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <TooltipProvider>
              {navItems.map((item) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                        isActive(item.href)
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to {item.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.push("/upload")}
                    className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload new files</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                    {theme === "light" ? (
                      <Moon className="h-5 w-5 text-slate-600" />
                    ) : (
                      <Sun className="h-5 w-5 text-slate-400" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle {theme === "light" ? "dark" : "light"} mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                  <Avatar>
                    <AvatarImage src={displayUser?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {displayUser?.user_metadata?.full_name?.charAt(0) ||
                        displayUser?.email?.charAt(0) ||
                        displayUser?.name?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="rounded-full w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    {displayUser?.user_metadata?.full_name?.charAt(0) ||
                      displayUser?.email?.charAt(0) ||
                      displayUser?.name?.charAt(0) ||
                      "U"}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {displayUser?.user_metadata?.full_name || displayUser?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {displayUser?.email || "demo@example.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <Button
              onClick={() => {
                router.push("/upload")
                setMobileMenuOpen(false)
              }}
              className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
