"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockIcon, EyeIcon, EyeOffIcon, Mail, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "@/contexts/theme-context"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate login process
    try {
      // In a real app, this would be an API call to authenticate
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user session (in a real app, this would be a JWT token or similar)
      localStorage.setItem("safeSpaceUser", JSON.stringify({ name: "User", email }))

      // Redirect to home
      router.push("/home")
    } catch (error) {
      console.error("Login failed:", error)
      setError("Login failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg-light dark:gradient-bg-dark flex flex-col justify-center">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-white/20 dark:bg-gray-800/20"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-purple-600" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400" />
          )}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 slide-in-top">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 rounded-full gradient-blue-purple flex items-center justify-center">
                <LockIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent gradient-blue-purple">Safe Space</h1>
            </Link>
          </div>

          <div className="glass-effect card-shadow rounded-lg p-8 slide-in-bottom">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">Welcome back</h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 border-blue-200 dark:border-blue-800 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 border-blue-200 dark:border-blue-800 focus:border-blue-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400">
                  Remember me for 30 days
                </Label>
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-blue-purple hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
