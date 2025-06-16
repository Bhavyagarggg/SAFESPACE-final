"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockIcon, EyeIcon, EyeOffIcon, CheckIcon, User, Mail, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useTheme } from "@/contexts/theme-context"

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const passwordStrength = () => {
    if (!password) return 0
    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return strength
  }

  const getStrengthColor = () => {
    const strength = passwordStrength()
    if (strength <= 2) return "bg-red-500"
    if (strength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    const strength = passwordStrength()
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulate signup process
    try {
      // In a real app, this would be an API call to create a user
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user session (in a real app, this would be a JWT token or similar)
      localStorage.setItem("safeSpaceUser", JSON.stringify({ name, email }))

      // Redirect to home
      router.push("/home")
    } catch (error) {
      console.error("Signup failed:", error)
      setError("Signup failed. Please try again.")
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
              <div className="w-12 h-12 rounded-full gradient-purple-pink flex items-center justify-center">
                <LockIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent gradient-purple-pink">Safe Space</h1>
            </Link>
          </div>

          <div className="glass-effect card-shadow rounded-lg p-8 slide-in-bottom">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6">Create your account</h2>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 border-purple-200 dark:border-purple-800 focus:border-purple-400"
                  />
                </div>
              </div>

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
                    className="pl-10 border-purple-200 dark:border-purple-800 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 border-purple-200 dark:border-purple-800 focus:border-purple-400"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                </div>

                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Password strength:</span>
                      <span className="text-sm font-medium" style={{ color: getStrengthColor() }}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength() / 5) * 100}%` }}
                      ></div>
                    </div>

                    <ul className="mt-3 space-y-1">
                      <PasswordRequirement met={password.length >= 8} text="At least 8 characters" />
                      <PasswordRequirement met={/[A-Z]/.test(password)} text="At least one uppercase letter" />
                      <PasswordRequirement met={/[0-9]/.test(password)} text="At least one number" />
                      <PasswordRequirement met={/[^A-Za-z0-9]/.test(password)} text="At least one special character" />
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-600 dark:text-purple-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-purple-pink hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PasswordRequirement({ met, text }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className={`flex-shrink-0 rounded-full p-0.5 ${met ? "text-green-500 bg-green-50 dark:bg-green-900/20" : "text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800"}`}
      >
        <CheckIcon size={12} />
      </span>
      <span className={met ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>{text}</span>
    </li>
  )
}
