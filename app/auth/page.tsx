"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Shield,
  FileText,
  ImageIcon,
  Film,
  Music,
  BookOpen,
  Moon,
  Sun,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react"

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [currentFeature, setCurrentFeature] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const { signIn, signUp, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  // Set mounted state to handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to home")
      router.push("/home")
    }
  }, [user, router])

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Advanced Security",
      description: "Your data is protected with industry-standard encryption",
    },
    {
      icon: <FileText className="h-8 w-8 text-violet-500" />,
      title: "Secure File Storage",
      description: "Store and organize all your important files safely",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-fuchsia-500" />,
      title: "Private Journal",
      description: "Keep your thoughts and memories secure",
    },
    {
      icon: <Lock className="h-8 w-8 text-indigo-500" />,
      title: "Privacy First",
      description: "Your personal data stays private and secure",
    },
  ]

  // Cycle through features
  useEffect(() => {
    if (!mounted) return

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length, mounted])

  const validateEmail = (email: string) => {
    if (!email.includes("@")) {
      setEmailError("Email must contain @ symbol")
      return false
    }
    setEmailError("")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!validateEmail(email)) {
      return
    }

    setLoading(true)
    setError("")
    setDebugInfo(null)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setError(error.message || "Sign up failed")
          setDebugInfo(`Sign up error: ${JSON.stringify(error)}`)
        } else {
          // Success message for sign up
          setError("Account created! Please check your email for verification.")
          setTimeout(() => {
            setIsSignUp(false)
          }, 3000)
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message || "Sign in failed")
          setDebugInfo(`Sign in error: ${JSON.stringify(error)}`)
        } else {
          // If no error, the auth context will handle the redirect
          console.log("Sign in successful, waiting for redirect...")
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      setError(error.message || "Authentication failed")
      setDebugInfo(`Unexpected error: ${JSON.stringify(error)}`)
    } finally {
      setLoading(false)
    }
  }

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
    if (strength <= 3) return "bg-orange-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    const strength = passwordStrength()
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
  }

  // Don't render until client-side hydration is complete
  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Animated Tech Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-violet-500/10 rotate-45 animate-bounce"></div>
        <div
          className="absolute bottom-32 left-20 w-24 h-24 bg-fuchsia-500/10 rounded-lg animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
        <div className="absolute bottom-20 right-32 w-12 h-12 bg-indigo-500/10 rounded-full animate-ping"></div>

        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-indigo-500/20 rounded"></div>
            ))}
          </div>
        </div>

        {/* Floating icons */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <FileText className="h-6 w-6 text-indigo-400/30" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: "1s" }}>
          <ImageIcon className="h-6 w-6 text-fuchsia-400/30" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-float" style={{ animationDelay: "2s" }}>
          <Music className="h-6 w-6 text-violet-400/30" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-float" style={{ animationDelay: "3s" }}>
          <Film className="h-6 w-6 text-indigo-400/30" />
        </div>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/30 dark:border-gray-700/30"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          ) : (
            <Sun className="h-5 w-5 text-gray-800 dark:text-gray-200" />
          )}
        </Button>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Main content */}
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          {/* Logo and branding */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-2xl">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-fuchsia-500 rounded-full flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
                  Safe Space
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Your Digital Vault</p>
              </div>
            </div>

            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              The most secure and intuitive way to store, organize, and access your digital life. Advanced security
              meets beautiful design.
            </p>
          </div>

          {/* Feature showcase */}
          <div className="w-full max-w-4xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.slice(0, 2).map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${
                    currentFeature % 2 === index
                      ? "bg-white/80 dark:bg-gray-800/80 border-indigo-200 dark:border-indigo-800 scale-105 shadow-xl"
                      : "bg-white/40 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    {feature.icon}
                    <h3 className="font-bold text-gray-800 dark:text-white">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* App features grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-4xl">
            {[
              { icon: <FileText className="h-6 w-6 text-indigo-500" />, label: "Documents", count: "Secure" },
              { icon: <ImageIcon className="h-6 w-6 text-fuchsia-500" />, label: "Photos", count: "Private" },
              { icon: <Film className="h-6 w-6 text-violet-500" />, label: "Videos", count: "Encrypted" },
              { icon: <Music className="h-6 w-6 text-indigo-500" />, label: "Audio", count: "Protected" },
              { icon: <BookOpen className="h-6 w-6 text-fuchsia-500" />, label: "Journal", count: "Personal" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-center hover:scale-105 transition-transform"
              >
                <div className="flex justify-center mb-2">{item.icon}</div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="w-full max-w-md p-8 flex flex-col justify-center">
          <div className="relative">
            {/* Sign In Form */}
            <div
              className={`backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-gray-700/50 transition-all duration-700 ${
                isSignUp ? "translate-x-full opacity-0 absolute inset-0" : "translate-x-0 opacity-100"
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Welcome Back</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email-signin" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email-signin"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (e.target.value && !e.target.value.includes("@")) {
                          setEmailError("Email must contain @ symbol")
                        } else {
                          setEmailError("")
                        }
                      }}
                      required
                      className={`pl-12 h-12 text-gray-800 dark:text-white bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl ${
                        emailError ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {emailError && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        <X size={16} />
                      </div>
                    )}
                  </div>
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password-signin" className="text-gray-700 dark:text-gray-300 font-medium">
                      Password
                    </Label>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password-signin"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-12 text-gray-800 dark:text-white bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-xl"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{error}</p>
                      {debugInfo && (
                        <details className="mt-1 text-xs opacity-80">
                          <summary>Technical details</summary>
                          <p className="mt-1">{debugInfo}</p>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 gradient-primary hover:opacity-90 transition-opacity text-white font-semibold rounded-xl shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true)
                      setError("")
                    }}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </div>

            {/* Sign Up Form */}
            <div
              className={`backdrop-blur-md bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-gray-700/50 transition-all duration-700 ${
                isSignUp ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">Join Safe Space</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300 font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-12 h-12 text-gray-800 dark:text-white bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (e.target.value && !e.target.value.includes("@")) {
                          setEmailError("Email must contain @ symbol")
                        } else {
                          setEmailError("")
                        }
                      }}
                      required
                      className={`pl-12 h-12 text-gray-800 dark:text-white bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl ${
                        emailError ? "border-red-500 dark:border-red-500" : ""
                      }`}
                    />
                    {emailError && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        <X size={16} />
                      </div>
                    )}
                  </div>
                  {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password-signup"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-12 text-gray-800 dark:text-white bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {password && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Password strength:</span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: getStrengthColor().replace("bg-", "text-") }}
                        >
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
                        <PasswordRequirement
                          met={/[^A-Za-z0-9]/.test(password)}
                          text="At least one special character"
                        />
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the{" "}
                    <button className="text-violet-600 dark:text-violet-400 hover:underline">Terms of Service</button>{" "}
                    and <button className="text-violet-600 dark:text-violet-400 hover:underline">Privacy Policy</button>
                  </Label>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{error}</p>
                      {debugInfo && (
                        <details className="mt-1 text-xs opacity-80">
                          <summary>Technical details</summary>
                          <p className="mt-1">{debugInfo}</p>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 gradient-secondary hover:opacity-90 transition-opacity text-white font-semibold rounded-xl shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false)
                      setError("")
                    }}
                    className="text-violet-600 dark:text-violet-400 hover:underline font-semibold"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className={`flex-shrink-0 rounded-full p-0.5 ${
          met
            ? "text-green-500 bg-green-50 dark:bg-green-900/20"
            : "text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-800"
        }`}
      >
        <CheckCircle size={12} />
      </span>
      <span className={met ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"}>{text}</span>
    </li>
  )
}
