"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  Smile,
  Frown,
  Meh,
  Heart,
  ThumbsDown,
  Activity,
  BarChart,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"

// Mood options with colors and icons
const moodOptions = [
  { value: "amazing", label: "Amazing", icon: Heart, color: "text-pink-500 bg-pink-100 dark:bg-pink-900/30" },
  { value: "happy", label: "Happy", icon: Smile, color: "text-green-500 bg-green-100 dark:bg-green-900/30" },
  { value: "okay", label: "Okay", icon: Meh, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" },
  { value: "terrible", label: "Terrible", icon: ThumbsDown, color: "text-red-500 bg-red-100 dark:bg-red-900/30" },
]

// Get mood by value
const getMood = (value: string) => {
  return moodOptions.find((mood) => mood.value === value) || moodOptions[2] // Default to "okay"
}

export default function JournalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = getSupabaseClient()
  const [activeTab, setActiveTab] = useState("entries")
  const [entries, setEntries] = useState<any[]>([])
  const [newEntryOpen, setNewEntryOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [entryTitle, setEntryTitle] = useState("")
  const [entryContent, setEntryContent] = useState("")
  const [entryMood, setEntryMood] = useState("okay")
  const [entryTags, setEntryTags] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [moodStreak, setMoodStreak] = useState(0)
  const [moodStats, setMoodStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load entries from Supabase on component mount
  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  const loadEntries = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      const formattedEntries = data.map((entry) => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: [], // We'll add tags support later
        date: entry.created_at,
        lastEdited: entry.updated_at,
      }))

      setEntries(formattedEntries)
      calculateMoodStats(formattedEntries)
      calculateMoodStreak(formattedEntries)
    } catch (error: any) {
      console.error("Error loading entries:", error)
      toast({
        title: "Error",
        description: "Failed to load journal entries. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate mood stats
  const calculateMoodStats = (entriesList: any[]) => {
    const stats: Record<string, number> = {}
    moodOptions.forEach((mood) => {
      stats[mood.value] = 0
    })

    entriesList.forEach((entry) => {
      if (stats[entry.mood] !== undefined) {
        stats[entry.mood]++
      }
    })

    setMoodStats(stats)
  }

  // Calculate mood streak
  const calculateMoodStreak = (entriesList: any[]) => {
    if (entriesList.length === 0) {
      setMoodStreak(0)
      return
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...entriesList].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Get today's date without time
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if there's an entry for today
    const todayEntry = sortedEntries.find((entry) => {
      const entryDate = new Date(entry.date)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === today.getTime()
    })

    if (!todayEntry) {
      setMoodStreak(0)
      return
    }

    // Count consecutive days with entries
    let streak = 1
    const currentDate = new Date(today)

    for (let i = 1; i <= 365; i++) {
      // Check previous day
      currentDate.setDate(currentDate.getDate() - 1)

      const hasEntryForDay = sortedEntries.some((entry) => {
        const entryDate = new Date(entry.date)
        entryDate.setHours(0, 0, 0, 0)
        return entryDate.getTime() === currentDate.getTime()
      })

      if (hasEntryForDay) {
        streak++
      } else {
        break
      }
    }

    setMoodStreak(streak)
  }

  // Handle adding a new entry
  const handleAddEntry = async () => {
    if (!entryTitle.trim() || !entryContent.trim() || !user) {
      toast({
        title: "Error",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const { data, error } = await supabase
        .from("diary_entries")
        .insert({
          user_id: user.id,
          title: entryTitle,
          content: entryContent,
          mood: entryMood,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      const newEntry = {
        id: data.id,
        title: data.title,
        content: data.content,
        mood: data.mood,
        tags: [],
        date: data.created_at,
        lastEdited: data.updated_at,
      }

      const updatedEntries = [newEntry, ...entries]
      setEntries(updatedEntries)
      calculateMoodStats(updatedEntries)
      calculateMoodStreak(updatedEntries)

      resetEntryForm()
      setNewEntryOpen(false)

      toast({
        title: "Entry Added",
        description: "Your journal entry has been saved successfully.",
      })
    } catch (error: any) {
      console.error("Error adding entry:", error)
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle updating an entry
  const handleUpdateEntry = async () => {
    if (!editingEntry || !entryTitle.trim() || !entryContent.trim() || !user) {
      toast({
        title: "Error",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const { data, error } = await supabase
        .from("diary_entries")
        .update({
          title: entryTitle,
          content: entryContent,
          mood: entryMood,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingEntry.id)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      const updatedEntries = entries.map((entry) =>
        entry.id === editingEntry.id
          ? {
              ...entry,
              title: data.title,
              content: data.content,
              mood: data.mood,
              lastEdited: data.updated_at,
            }
          : entry,
      )

      setEntries(updatedEntries)
      calculateMoodStats(updatedEntries)
      calculateMoodStreak(updatedEntries)

      resetEntryForm()
      setEditingEntry(null)

      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error updating entry:", error)
      toast({
        title: "Error",
        description: "Failed to update journal entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle deleting an entry
  const handleDeleteEntry = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("diary_entries").delete().eq("id", id).eq("user_id", user.id)

      if (error) {
        throw error
      }

      const updatedEntries = entries.filter((entry) => entry.id !== id)
      setEntries(updatedEntries)
      calculateMoodStats(updatedEntries)
      calculateMoodStreak(updatedEntries)

      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      })
    } catch (error: any) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete journal entry. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Start editing an entry
  const startEditEntry = (entry: any) => {
    setEntryTitle(entry.title)
    setEntryContent(entry.content)
    setEntryMood(entry.mood)
    setEntryTags(entry.tags.join(", "))
    setEditingEntry(entry)
  }

  // Reset the entry form
  const resetEntryForm = () => {
    setEntryTitle("")
    setEntryContent("")
    setEntryMood("okay")
    setEntryTags("")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get days in month for calendar
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: 0, mood: null })
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      date.setHours(0, 0, 0, 0)

      // Find entry for this day
      const entry = entries.find((e) => {
        const entryDate = new Date(e.date)
        entryDate.setHours(0, 0, 0, 0)
        return entryDate.getTime() === date.getTime()
      })

      days.push({
        day,
        mood: entry ? entry.mood : null,
        entry: entry || null,
      })
    }

    return days
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Format month name
  const formatMonthName = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Authentication Required</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to access your journal.</p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-light text-slate-800 dark:text-slate-200 mb-2">My Journal</h2>
            <p className="text-slate-600 dark:text-slate-400">Record your thoughts and track your mood</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/home")}
              className="text-slate-600 dark:text-slate-400"
            >
              Back to Home
            </Button>
            <Dialog open={newEntryOpen} onOpenChange={setNewEntryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>New Journal Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Input
                      placeholder="Entry title"
                      value={entryTitle}
                      onChange={(e) => setEntryTitle(e.target.value)}
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Write your thoughts..."
                      value={entryContent}
                      onChange={(e) => setEntryContent(e.target.value)}
                      className="min-h-[200px] border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">How are you feeling?</p>
                    <div className="flex flex-wrap gap-2">
                      {moodOptions.map((mood) => {
                        const MoodIcon = mood.icon
                        return (
                          <Button
                            key={mood.value}
                            type="button"
                            variant="outline"
                            className={`flex-1 ${entryMood === mood.value ? mood.color : ""}`}
                            onClick={() => setEntryMood(mood.value)}
                          >
                            <MoodIcon className="h-4 w-4 mr-2" />
                            {mood.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewEntryOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleAddEntry}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Entry
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/30"
              onClick={() => setActiveTab("calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>

            <Button
              variant="outline"
              className="border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-900/30"
              onClick={() => setActiveTab("insights")}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Insights
            </Button>
          </div>
        </div>

        {/* Mood Streak Card */}
        <Card className="mb-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    {moodStreak} Day{moodStreak !== 1 ? "s" : ""}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">Current Mood Streak</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap justify-center md:justify-end">
                {moodOptions.map((mood) => {
                  const MoodIcon = mood.icon
                  const count = moodStats[mood.value] || 0
                  return (
                    <div key={mood.value} className={`px-3 py-2 rounded-full flex items-center gap-2 ${mood.color}`}>
                      <MoodIcon className="h-4 w-4" />
                      <span>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white/20 dark:bg-slate-800/20 p-1 rounded-lg">
            <TabsTrigger value="entries" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Entries
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>

          {/* Entries Tab */}
          <TabsContent value="entries" className="space-y-6">
            {entries.length > 0 ? (
              entries.map((entry) => {
                const mood = getMood(entry.mood)
                const MoodIcon = mood.icon
                return (
                  <Card
                    key={entry.id}
                    className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <MoodIcon className={`h-5 w-5 ${mood.color.split(" ")[0]}`} />
                          {entry.title}
                        </CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {formatDate(entry.date)}
                          {entry.lastEdited &&
                            entry.lastEdited !== entry.date &&
                            ` (edited ${formatDate(entry.lastEdited)})`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-purple-600"
                          onClick={() => startEditEntry(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{entry.content}</p>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-2">
                    No journal entries yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    Start writing your thoughts and tracking your mood
                  </p>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => setNewEntryOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Entry
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">
                  {formatMonthName(currentMonth)}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center py-2 text-sm font-medium text-slate-500">
                      {day}
                    </div>
                  ))}

                  {generateCalendarDays().map((day, index) => {
                    if (day.day === 0) {
                      return <div key={`empty-${index}`} className="p-2" />
                    }

                    const mood = day.mood ? getMood(day.mood) : null
                    const MoodIcon = mood?.icon

                    return (
                      <div
                        key={`day-${day.day}`}
                        className={`p-2 text-center rounded-md ${
                          day.mood ? `cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700` : ""
                        }`}
                        onClick={() => {
                          if (day.entry) {
                            startEditEntry(day.entry)
                          }
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-sm">{day.day}</span>
                          {mood && MoodIcon && (
                            <div className={`mt-1 ${mood.color} rounded-full p-1`}>
                              <MoodIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moodOptions.map((mood) => {
                      const count = moodStats[mood.value] || 0
                      const total = entries.length
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
                      const MoodIcon = mood.icon

                      return (
                        <div key={mood.value} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MoodIcon className={`h-5 w-5 ${mood.color.split(" ")[0]}`} />
                              <span className="text-slate-700 dark:text-slate-300">{mood.label}</span>
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${mood.color.split(" ")[0]} rounded-full`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Journal Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">{entries.length}</div>
                      <p className="text-slate-500 dark:text-slate-400">Total Entries</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{moodStreak}</div>
                        <p className="text-slate-500 dark:text-slate-400">Day Streak</p>
                      </div>

                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {entries.length > 0
                            ? new Date(entries[0].date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "-"}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">Last Entry</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Entry Dialog */}
      {editingEntry && (
        <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Input
                  placeholder="Entry title"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Write your thoughts..."
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className="min-h-[200px] border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">How are you feeling?</p>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map((mood) => {
                    const MoodIcon = mood.icon
                    return (
                      <Button
                        key={mood.value}
                        type="button"
                        variant="outline"
                        className={`flex-1 ${entryMood === mood.value ? mood.color : ""}`}
                        onClick={() => setEntryMood(mood.value)}
                      >
                        <MoodIcon className="h-4 w-4 mr-2" />
                        {mood.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingEntry(null)}>
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleUpdateEntry}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Entry
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
