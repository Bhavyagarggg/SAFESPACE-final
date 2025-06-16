"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Share2,
  MoreVertical,
  FolderOpen,
  ArrowLeft,
  SortAsc,
  SortDesc,
  Grid,
  List,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { uploadFile, deleteFile, listFiles, getFileUrl } from "@/lib/supabase-storage"
import { useAuth } from "@/contexts/auth-context"

const fileCategories = [
  {
    id: "documents",
    name: "Documents",
    icon: FileText,
    color: "blue",
    description: "PDFs, Word docs, spreadsheets",
    count: 0,
    bucket: "documents",
    acceptedTypes: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
  },
  {
    id: "photos",
    name: "Photos",
    icon: ImageIcon,
    color: "pink",
    description: "Images, screenshots, artwork",
    count: 0,
    bucket: "images",
    acceptedTypes: ".jpg,.jpeg,.png,.gif,.webp,.svg",
  },
  {
    id: "videos",
    name: "Videos",
    icon: Video,
    color: "purple",
    description: "Movies, clips, recordings",
    count: 0,
    bucket: "videos",
    acceptedTypes: ".mp4,.mov,.avi,.webm,.mkv",
  },
  {
    id: "audio",
    name: "Audio",
    icon: Music,
    color: "green",
    description: "Music, podcasts, voice notes",
    count: 0,
    bucket: "audio",
    acceptedTypes: ".mp3,.wav,.ogg,.m4a,.flac",
  },
  {
    id: "archives",
    name: "Archives",
    icon: Archive,
    color: "orange",
    description: "ZIP files, backups, compressed",
    count: 0,
    bucket: "archives",
    acceptedTypes: ".zip,.rar,.7z,.tar,.gz",
  },
]

export default function FilesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [files, setFiles] = useState<any[]>([])
  const [categories, setCategories] = useState(fileCategories)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load files for the selected category
  useEffect(() => {
    if (selectedCategory && user) {
      loadFiles(selectedCategory)
    } else if (user) {
      // Load file counts for all categories
      loadFileCounts()
    }
  }, [selectedCategory, user])

  const loadFileCounts = async () => {
    if (!user) return

    try {
      const updatedCategories = [...categories]

      for (let i = 0; i < updatedCategories.length; i++) {
        const category = updatedCategories[i]
        try {
          const files = await listFiles(category.bucket, user.id)
          updatedCategories[i] = {
            ...category,
            count: files.length,
          }
        } catch (error) {
          console.error(`Error loading count for ${category.name}:`, error)
        }
      }

      setCategories(updatedCategories)
    } catch (error) {
      console.error("Error loading file counts:", error)
      toast({
        title: "Error",
        description: "Failed to load file counts. Please try again.",
        variant: "destructive",
      })
    }
  }

  const loadFiles = async (categoryId: string) => {
    if (!user) return

    try {
      const category = categories.find((cat) => cat.id === categoryId)
      if (!category) return

      const files = await listFiles(category.bucket, user.id)

      // Transform the files to match our expected format
      const formattedFiles = files.map((file) => ({
        id: file.id,
        name: file.name,
        size: formatFileSize(file.file_size || 0),
        modified: new Date(file.created_at).toLocaleDateString(),
        type: file.file_type || "unknown",
        path: file.file_path,
      }))

      setFiles(formattedFiles)
    } catch (error) {
      console.error("Error loading files:", error)
      toast({
        title: "Error",
        description: "Failed to load files. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUploadClick = (category: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files.",
        variant: "destructive",
      })
      return
    }
    setSelectedCategory(category)
    setUploadDialogOpen(true)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles || selectedFiles.length === 0 || !user) return

    setUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    const category = categories.find((cat) => cat.id === selectedCategory)
    if (!category) {
      setUploadError("Category not found")
      setUploading(false)
      return
    }

    try {
      // Process each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const progress = Math.round(((i + 1) / selectedFiles.length) * 100)
        setUploadProgress(progress)

        await uploadFile(file, category.bucket, "", user.id)
      }

      // Reload files after upload
      await loadFiles(selectedCategory!)

      // Update file count for the category
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory ? { ...cat, count: cat.count + selectedFiles.length } : cat,
      )
      setCategories(updatedCategories)

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${selectedFiles.length} file(s)`,
      })

      // Close dialog after a short delay
      setTimeout(() => {
        setUploadDialogOpen(false)
        setUploading(false)
      }, 1000)
    } catch (error) {
      console.error("Error uploading files:", error)
      setUploadError("Failed to upload files. Please try again.")
      setUploading(false)
    }
  }

  const handleDeleteFile = async (filePath: string) => {
    if (!selectedCategory || !user) return

    const category = categories.find((cat) => cat.id === selectedCategory)
    if (!category) return

    try {
      await deleteFile(filePath, category.bucket, user.id)

      // Remove file from state
      setFiles(files.filter((file) => file.path !== filePath))

      // Update file count for the category
      const updatedCategories = categories.map((cat) =>
        cat.id === selectedCategory ? { ...cat, count: Math.max(0, cat.count - 1) } : cat,
      )
      setCategories(updatedCategories)

      toast({
        title: "File Deleted",
        description: "The file has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDownloadFile = async (file: any) => {
    if (!selectedCategory) return

    const category = categories.find((cat) => cat.id === selectedCategory)
    if (!category) return

    try {
      const url = await getFileUrl(file.path, category.bucket)
      const link = document.createElement("a")
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Download Started",
        description: `Downloading ${file.name}...`,
      })
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShareFile = async (file: any) => {
    if (!selectedCategory) return

    const category = categories.find((cat) => cat.id === selectedCategory)
    if (!category) return

    try {
      const url = await getFileUrl(file.path, category.bucket)
      await navigator.clipboard.writeText(url)

      toast({
        title: "Share Link Copied",
        description: `Share link for ${file.name} copied to clipboard.`,
      })
    } catch (error) {
      console.error("Error sharing file:", error)
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    if (sortBy === "size") {
      // Parse size strings like "2.4 MB" for proper comparison
      const aSize = Number.parseFloat(aValue.split(" ")[0])
      const bSize = Number.parseFloat(bValue.split(" ")[0])
      const aUnit = aValue.split(" ")[1]
      const bUnit = bValue.split(" ")[1]

      const units = ["Bytes", "KB", "MB", "GB", "TB"]
      const aUnitIndex = units.indexOf(aUnit)
      const bUnitIndex = units.indexOf(bUnit)

      if (aUnitIndex !== bUnitIndex) {
        return sortOrder === "asc" ? aUnitIndex - bUnitIndex : bUnitIndex - aUnitIndex
      }

      return sortOrder === "asc" ? aSize - bSize : bSize - aSize
    }

    const comparison = String(aValue).localeCompare(String(bValue))
    return sortOrder === "asc" ? comparison : -comparison
  })

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Authentication Required</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to access your secure file vault.</p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Navigation */}
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/home" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Files</h1>
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/home" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                  Home
                </Link>
                <Link href="/journal" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                  Journal
                </Link>
                <Link href="/settings" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-slate-800 dark:text-slate-200 mb-2">Your Secure File Vault</h2>
            <p className="text-slate-600 dark:text-slate-400">Organize and manage your files by category</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div
                      className={`w-16 h-16 mx-auto bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className={`w-8 h-8 text-${category.color}-600 dark:text-${category.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">{category.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{category.description}</p>
                      <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{category.count} files</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className={`flex-1 bg-${category.color}-600 hover:bg-${category.color}-700 text-white`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCategory(category.id)
                        }}
                      >
                        Open
                      </Button>
                      <Button
                        className={`flex-1 bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200 dark:bg-${category.color}-900/30 dark:text-${category.color}-400 dark:hover:bg-${category.color}-900/50`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUploadClick(category.id)
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}

              {!uploading ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Drag and drop files here, or click to select files
                  </p>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    accept={categories.find((cat) => cat.id === selectedCategory)?.acceptedTypes}
                    onChange={handleFileSelect}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Select Files
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-slate-600 dark:text-slate-400">Uploading files...</p>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">{uploadProgress}%</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const currentCategory = categories.find((cat) => cat.id === selectedCategory)
  const IconComponent = currentCategory?.icon || FileText

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Files
              </Button>
              <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5 text-indigo-600" />
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{currentCategory?.name}</h1>
              </div>
            </div>
            <Button onClick={() => setUploadDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Upload className="h-4 w-4 mr-2" />
              Upload {currentCategory?.name}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* File Management Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder={`Search ${currentCategory?.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Sort: {sortBy}
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("modified")}>Date Modified</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("size")}>Size</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  {sortOrder === "asc" ? "Descending" : "Ascending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border border-slate-200 dark:border-slate-700 rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Files Display */}
        {sortedFiles.length === 0 ? (
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-12 text-center">
              <IconComponent className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-600 dark:text-slate-400 mb-2">
                No {currentCategory?.name.toLowerCase()} found
              </h3>
              <p className="text-slate-500 dark:text-slate-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : `Upload your first ${currentCategory?.name.toLowerCase()}`}
              </p>
              <Button
                onClick={() => setUploadDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload {currentCategory?.name}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-2"
            }
          >
            {sortedFiles.map((file) => (
              <Card
                key={file.id}
                className="group hover:shadow-md transition-all duration-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <CardContent className={viewMode === "grid" ? "p-4" : "p-3"}>
                  <div className={`flex ${viewMode === "grid" ? "flex-col" : "items-center justify-between"} gap-3`}>
                    <div
                      className={`flex ${viewMode === "grid" ? "flex-col items-center text-center" : "items-center"} gap-3`}
                    >
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className={viewMode === "grid" ? "text-center" : "flex-1"}>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {file.size} • {file.modified}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShareFile(file)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteFile(file.path)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload {currentCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {uploadError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}

            {!uploading ? (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Drag and drop files here, or click to select files
                </p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept={currentCategory?.acceptedTypes}
                  onChange={handleFileSelect}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Select Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-center text-slate-600 dark:text-slate-400">Uploading files...</p>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">{uploadProgress}%</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
