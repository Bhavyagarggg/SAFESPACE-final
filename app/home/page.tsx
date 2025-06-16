"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LockIcon, LogOut, Moon, Sun, Target, Clock, Heart, Plus, CheckCircle, Circle } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"

const greetings = [
  "Good morning, superstar! ✨",
  "Hello there, pineapple! 🍍",
  "Hey sweetpea! 🌸",
  "What's up, amazing! 🌟",
  "Hi there, champion! 🏆",
  "Hello, sunshine! ☀️",
  "Hey there, rockstar! 🎸",
  "Good day, brilliant! 💎",
]

const quotes = [
  "Every day is a new beginning. Take a deep breath and start again.",
  "You are capable of amazing things. Believe in yourself.",
  "Progress, not perfection. Every step forward counts.",
  "Your potential is endless. Keep growing.",
  "Today is full of possibilities. Make it count.",
  "You are stronger than you think. Keep going.",
  "Small steps lead to big changes. Keep moving forward.",
  "You have the power to create positive change in your life.",
]

const mindfulnessActivities = [
  { name: "Deep Breathing", duration: "5 min", description: "Focus on your breath" },
  { name: "Body Scan", duration: "10 min", description: "Relax each part of your body" },
  { name: "Gratitude Practice", duration: "3 min", description: "Think of three things you're grateful for" },
  { name: "Meditation", duration: "15 min", description: "Clear your mind and find peace" },
  { name: "Mindful Walking", duration: "20 min", description: "Walk with awareness and presence" },
]

export default function HomePage() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [demoUser, setDemoUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [greeting, setGreeting] = useState("")
  const [quote, setQuote] = useState("")
  const [goals, setGoals] = useState<string[]>([])
  const [newGoal, setNewGoal] = useState("")
  const [completedGoals, setCompletedGoals] = useState<boolean[]>([])
  const [selectedMindfulness, setSelectedMindfulness] = useState<number | null>(null)
  const [mindfulnessTimer, setMindfulnessTimer] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Check for demo user in localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("safeSpaceUser")
      if (storedUser) {
        setDemoUser(JSON.parse(storedUser))
      }

      // Load saved goals
      const savedGoals = localStorage.getItem("dailyGoals")
      if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals)
        setGoals(parsedGoals.goals || [])
        setCompletedGoals(parsedGoals.completed || [])
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error)
    }
    setIsLoading(false)
  }, [])

  // Generate random greeting and quote
  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  // Redirect to auth if no user
  useEffect(() => {
    if (!isLoading && !user && !demoUser) {
      router.push("/auth")
    }
  }, [user, demoUser, isLoading, router])

  // Timer effect for mindfulness
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && mindfulnessTimer > 0) {
      interval = setInterval(() => {
        setMindfulnessTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            setSelectedMindfulness(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, mindfulnessTimer])

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("safeSpaceUser")
      setDemoUser(null)
      if (user) {
        await signOut()
      }
      router.push("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
      router.push("/auth")
    }
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      const updatedGoals = [...goals, newGoal.trim()]
      const updatedCompleted = [...completedGoals, false]
      setGoals(updatedGoals)
      setCompletedGoals(updatedCompleted)
      setNewGoal("")

      // Save to localStorage
      localStorage.setItem(
        "dailyGoals",
        JSON.stringify({
          goals: updatedGoals,
          completed: updatedCompleted,
        }),
      )
    }
  }

  const toggleGoalCompletion = (index: number) => {
    const updatedCompleted = [...completedGoals]
    updatedCompleted[index] = !updatedCompleted[index]
    setCompletedGoals(updatedCompleted)

    // Save to localStorage
    localStorage.setItem(
      "dailyGoals",
      JSON.stringify({
        goals,
        completed: updatedCompleted,
      }),
    )
  }

  const startMindfulness = (index: number) => {
    const activity = mindfulnessActivities[index]
    const minutes = Number.parseInt(activity.duration.split(" ")[0])
    setSelectedMindfulness(index)
    setMindfulnessTimer(minutes * 60) // Convert to seconds
    setIsTimerRunning(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <p className="text-slate-600 dark:text-slate-400">Loading your safe space...</p>
        </div>
      </div>
    )
  }

  if (!user && !demoUser) {
    return null
  }

  const currentUser = user || demoUser

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <LockIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Safe Space</h1>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/files"
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
              >
                Files
              </Link>
              <Link
                href="/journal"
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
              >
                Journal
              </Link>
              <Link
                href="/settings"
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
              >
                Settings
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-slate-100 dark:bg-slate-800"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-slate-700" />
                ) : (
                  <Sun className="h-5 w-5 text-slate-300" />
                )}
              </Button>
              <Button
                variant="default"
                onClick={handleSignOut}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-slate-100 dark:bg-slate-800"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-slate-700" />
                ) : (
                  <Sun className="h-5 w-5 text-slate-300" />
                )}
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  const mobileMenu = document.getElementById("mobile-menu")
                  if (mobileMenu) {
                    mobileMenu.classList.toggle("hidden")
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Menu
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          <div id="mobile-menu" className="md:hidden hidden py-4 space-y-2">
            <Link
              href="/files"
              className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              Files
            </Link>
            <Link
              href="/journal"
              className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              Journal
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              Settings
            </Link>
            <Button
              variant="default"
              onClick={handleSignOut}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Section */}
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 dark:text-slate-200">{greeting}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed italic">
            "{quote}"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Goals */}
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Target className="h-5 w-5 text-indigo-600" />
                Daily Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addGoal()}
                  className="flex-1"
                />
                <Button onClick={addGoal} size="icon" className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleGoalCompletion(index)}
                      className="h-6 w-6 p-0"
                    >
                      {completedGoals[index] ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400" />
                      )}
                    </Button>
                    <span
                      className={`flex-1 ${
                        completedGoals[index] ? "line-through text-slate-500" : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {goal}
                    </span>
                  </div>
                ))}
                {goals.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                    No goals set for today. Add one above!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mindfulness Moments */}
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Heart className="h-5 w-5 text-purple-600" />
                Mindfulness Moments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMindfulness !== null && isTimerRunning ? (
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                    {mindfulnessActivities[selectedMindfulness].name}
                  </h3>
                  <div className="text-4xl font-mono text-indigo-600 dark:text-indigo-400">
                    {formatTime(mindfulnessTimer)}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {mindfulnessActivities[selectedMindfulness].description}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsTimerRunning(false)
                      setSelectedMindfulness(null)
                      setMindfulnessTimer(0)
                    }}
                  >
                    Stop Session
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {mindfulnessActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700"
                    >
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">{activity.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.duration}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => startMindfulness(index)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Info */}
        <Card className="mt-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {currentUser?.email || currentUser?.name || "Demo User"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
