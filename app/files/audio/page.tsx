"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Music, Search, Plus, MoreVertical, Play, Pause, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TopNavbar from "@/components/top-navbar"
import MusicPlayer from "@/components/music-player"

export default function AudioPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Calm Meditation",
      artist: "Relaxation Sounds",
      duration: 183,
      url: "https://example.com/audio/calm-meditation.mp3",
      category: "Meditation",
      dateAdded: "May 15, 2023",
    },
    {
      id: 2,
      title: "Focus Music",
      artist: "Productivity Beats",
      duration: 245,
      url: "https://example.com/audio/focus-music.mp3",
      category: "Work",
      dateAdded: "June 3, 2023",
    },
    {
      id: 3,
      title: "Sleep Sounds",
      artist: "Dream Waves",
      duration: 320,
      url: "https://example.com/audio/sleep-sounds.mp3",
      category: "Sleep",
      dateAdded: "July 12, 2023",
    },
    {
      id: 4,
      title: "Nature Ambience",
      artist: "Earth Tones",
      duration: 278,
      url: "https://example.com/audio/nature-ambience.mp3",
      category: "Nature",
      dateAdded: "August 5, 2023",
    },
    {
      id: 5,
      title: "Positive Affirmations",
      artist: "Self Growth",
      duration: 156,
      url: "https://example.com/audio/positive-affirmations.mp3",
      category: "Motivation",
      dateAdded: "September 18, 2023",
    },
  ])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const togglePlaySong = (id: number) => {
    setCurrentlyPlaying(currentlyPlaying === id ? null : id)
  }

  const connectToSpotify = () => {
    // In a real app, this would redirect to Spotify OAuth
    window.open("https://open.spotify.com", "_blank")
  }

  const connectToAppleMusic = () => {
    window.open("https://music.apple.com", "_blank")
  }

  const connectToYouTubeMusic = () => {
    window.open("https://music.youtube.com", "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg-light dark:gradient-bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg-light dark:gradient-bg-dark">
      <TopNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">Audio Library</h2>
            <p className="text-gray-600 dark:text-gray-400">Listen to your secure audio collection</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search audio..."
                className="pl-10 border-cyan-200 dark:border-cyan-800 focus:border-cyan-400 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              onClick={() => router.push("/upload")}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 transition-opacity"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Audio</span>
            </Button>
          </div>
        </div>

        {/* Current Playing */}
        {currentlyPlaying !== null && (
          <div className="mb-8">
            <MusicPlayer songs={songs} initialSongIndex={songs.findIndex((song) => song.id === currentlyPlaying)} />
          </div>
        )}

        {/* Audio List */}
        <Card className="glass-effect card-shadow border-0">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">#</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Artist</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                      <Clock className="h-4 w-4" />
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                      <Calendar className="h-4 w-4" />
                    </th>
                    <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((song, index) => (
                    <tr
                      key={song.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${
                              currentlyPlaying === song.id
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                            onClick={() => togglePlaySong(song.id)}
                          >
                            {currentlyPlaying === song.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4 ml-0.5" />
                            )}
                          </Button>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{song.title}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{song.artist}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {song.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDuration(song.duration)}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{song.dateAdded}</td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-effect">
                            <DropdownMenuItem className="cursor-pointer">Add to playlist</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Download</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSongs.length === 0 && (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-cyan-300 dark:text-cyan-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No audio files found. Try a different search or upload some audio.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Music Services Integration */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Connect Music Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              onClick={connectToSpotify}
              variant="outline"
              className="h-auto py-4 flex items-center justify-center gap-3 border-2 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Music className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-gray-800 dark:text-white">Connect Spotify</span>
            </Button>

            <Button
              onClick={connectToAppleMusic}
              variant="outline"
              className="h-auto py-4 flex items-center justify-center gap-3 border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/20"
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-200 flex items-center justify-center">
                <Music className="h-4 w-4 text-white dark:text-gray-800" />
              </div>
              <span className="font-medium text-gray-800 dark:text-white">Connect Apple Music</span>
            </Button>

            <Button
              onClick={connectToYouTubeMusic}
              variant="outline"
              className="h-auto py-4 flex items-center justify-center gap-3 border-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <Music className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-gray-800 dark:text-white">Connect YouTube Music</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
