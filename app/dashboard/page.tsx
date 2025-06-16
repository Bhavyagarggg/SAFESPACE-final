"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  FolderIcon,
  ImageIcon,
  FileTextIcon,
  FilmIcon,
  SearchIcon,
  UploadIcon,
  TrashIcon,
  MoreVerticalIcon,
  Target,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useMobile } from "@/hooks/use-mobile"
import TopNavbar from "@/components/top-navbar"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState([])
  const [goals, setGoals] = useState([])
  const [newGoal, setNewGoal] = useState("")
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [showCompletedGoals, setShowCompletedGoals] = useState(false)
  const router = useRouter()
  const isMobile = useMobile()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("safeSpaceUser")
    if (!userData) {
      router.push("/auth")
      return
    }

    setUser(JSON.parse(userData))

    // Load demo files
    setFiles([
      {
        id: 1,
        name: "Vacation Photos",
        type: "folder",
        items: 12,
        lastModified: new Date(2023, 5, 15),
      },
      {
        id: 2,
        name: "Financial Documents",
        type: "folder",
        items: 8,
        lastModified: new Date(2023, 6, 22),
      },
      {
        id: 3,
        name: "Passport Scan.pdf",
        type: "document",
        size: "2.4 MB",
        lastModified: new Date(2023, 7, 3),
      },
      {
        id: 4,
        name: "Family Photo.jpg",
        type: "image",
        size: "3.8 MB",
        lastModified: new Date(2023, 7, 10),
      },
      {
        id: 5,
        name: "Wedding Video.mp4",
        type: "video",
        size: "128 MB",
        lastModified: new Date(2023, 8, 5),
      },
      {
        id: 6,
        name: "Medical Records",
        type: "folder",
        items: 5,
        lastModified: new Date(2023, 8, 12),
      },
      {
        id: 7,
        name: "Tax Return 2023.pdf",
        type: "document",
        size: "1.2 MB",
        lastModified: new Date(2023, 9, 1),
      },
      {
        id: 8,
        name: "House Deed.pdf",
        type: "document",
        size: "4.5 MB",
        lastModified: new Date(2023, 9, 15),
      },
    ])

    // Load demo goals
    setGoals([
      { id: 1, text: "Organize personal documents", completed: false },
      { id: 2, text: "Create a private photo vault", completed: true },
      { id: 3, text: "Store important videos safely", completed: false },
      { id: 4, text: "Build a personal audio library", completed: false },
      { id: 5, text: "Maintain a private journal", completed: true },
    ])
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("safeSpaceUser")
    router.push("/auth")
  }

  const handleUpload = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setUploading(false)
          setUploadProgress(0)
          setUploadDialogOpen(false)

          // Add new files to the list (in a real app, this would come from the server)
          const newFiles = Array.from(files).map((file, index) => {
            let type = "document"
            if (file.type.startsWith("image/")) type = "image"
            if (file.type.startsWith("video/")) type = "video"

            return {
              id: Date.now() + index,
              name: file.name,
              type,
              size: formatFileSize(file.size),
              lastModified: new Date(),
            }
          })

          setFiles((prev) => [...newFiles, ...prev])
        }, 500)
      }
    }, 100)
  }

  const handleAddGoal = () => {
    if (!newGoal.trim()) return

    const newGoalItem = {
      id: Date.now(),
      text: newGoal,
      completed: false,
    }

    setGoals((prev) => [...prev, newGoalItem])
    setNewGoal("")
    setGoalDialogOpen(false)
  }

  const toggleGoalCompletion = (id) => {
    setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)))
  }

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
    else return (bytes / 1073741824).toFixed(1) + " GB"
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getFileIcon = (type) => {
    switch (type) {
      case "folder":
        return <FolderIcon className="h-6 w-6 text-indigo-500" />
      case "image":
        return <ImageIcon className="h-6 w-6 text-fuchsia-500" />
      case "document":
        return <FileTextIcon className="h-6 w-6 text-violet-500" />
      case "video":
        return <FilmIcon className="h-6 w-6 text-indigo-500" />
      default:
        return <FileTextIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const completedGoalsCount = goals.filter((goal) => goal.completed).length
  const goalProgress = goals.length > 0 ? (completedGoalsCount / goals.length) * 100 : 0

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <TopNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Goals */}
          <div className="lg:col-span-1">
            <Card className="glass-effect card-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-500" />
                  My Goals
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 dark:text-indigo-400"
                  onClick={() => setGoalDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Goal
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {completedGoalsCount} of {goals.length} completed
                    </span>
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {Math.round(goalProgress)}%
                    </span>
                  </div>
                  <Progress value={goalProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="space-y-3">
                  {goals
                    .filter((goal) => !goal.completed || showCompletedGoals)
                    .map((goal, index) => (
                      <div
                        key={goal.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          goal.completed
                            ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
                        } transition-all duration-300`}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          transform: `translateY(0)`,
                          opacity: 1,
                          transition: `transform 300ms ease ${index * 50}ms, opacity 300ms ease ${index * 50}ms`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={goal.completed}
                            onCheckedChange={() => toggleGoalCompletion(goal.id)}
                            className={goal.completed ? "text-green-500" : ""}
                          />
                          <span
                            className={`${goal.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200"}`}
                          >
                            {goal.text}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>

                {goals.length > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setShowCompletedGoals(!showCompletedGoals)}
                    className="mt-4 text-indigo-600 dark:text-indigo-400"
                  >
                    {showCompletedGoals ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide completed
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show completed
                      </>
                    )}
                  </Button>
                )}

                {goals.length === 0 && (
                  <div className="text-center py-6">
                    <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No goals yet. Add your first goal!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Files */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Recent Files</h2>

              <div className="flex gap-3">
                <div className="relative max-w-xs">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search files..."
                    className="pl-10 border-indigo-200 dark:border-indigo-800 focus:border-indigo-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      <span>Upload</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Files</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                      {!uploading ? (
                        <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-lg p-8 text-center">
                          <UploadIcon className="mx-auto h-12 w-12 text-indigo-300 dark:text-indigo-700 mb-4" />
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Drag and drop files here, or click to select files
                          </p>
                          <Input type="file" multiple className="hidden" id="file-upload" onChange={handleUpload} />
                          <label htmlFor="file-upload">
                            <Button className="gradient-primary hover:opacity-90" asChild>
                              <span>Select Files</span>
                            </Button>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-center text-gray-600 dark:text-gray-300">
                            Uploading and encrypting files with ChaCha...
                          </p>
                          <div className="h-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                            <div
                              className="h-full gradient-primary rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-center text-sm text-gray-500 dark:text-gray-400">{uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="mb-6 bg-white/20 dark:bg-gray-800/20 p-1 rounded-lg">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:gradient-primary data-[state=active]:text-white"
                >
                  All Files
                </TabsTrigger>
                <TabsTrigger
                  value="recent"
                  className="data-[state=active]:gradient-secondary data-[state=active]:text-white"
                >
                  Recent
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:gradient-secondary data-[state=active]:text-white"
                >
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:gradient-primary data-[state=active]:text-white"
                >
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="data-[state=active]:gradient-accent data-[state=active]:text-white"
                >
                  Videos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {filteredFiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFiles.map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No files found. Try a different search or upload some files.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles
                    .sort((a, b) => b.lastModified - a.lastModified)
                    .slice(0, 6)
                    .map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="images">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles
                    .filter((file) => file.type === "image")
                    .map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles
                    .filter((file) => file.type === "document")
                    .map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFiles
                    .filter((file) => file.type === "video")
                    .map((file) => (
                      <FileCard key={file.id} file={file} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-goal" className="text-gray-700 dark:text-gray-300 mb-2 block">
              Goal Description
            </Label>
            <Input
              id="new-goal"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Enter your goal..."
              className="mb-4"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary" onClick={handleAddGoal}>
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  function FileCard({ file }) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-indigo-50 dark:border-indigo-900 hover:shadow-md transition-shadow overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {getFileIcon(file.type)}
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[180px]">{file.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {file.type === "folder" ? `${file.items} items` : file.size}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Open menu</span>
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="px-4 py-2 bg-indigo-50/50 dark:bg-indigo-900/20 text-xs text-gray-500 dark:text-gray-400 border-t border-indigo-100 dark:border-indigo-900/30">
          Last modified: {formatDate(file.lastModified)}
        </div>
      </div>
    )
  }
}
