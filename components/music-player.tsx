"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Song {
  id: number
  title: string
  artist: string
  duration: number
  url: string
}

interface MusicPlayerProps {
  songs: Song[]
  initialSongIndex?: number
}

export default function MusicPlayer({ songs, initialSongIndex = 0 }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSong = songs[currentSongIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const setAudioData = () => {
      setDuration(audio.duration)
    }

    const setAudioProgress = () => {
      setProgress(audio.currentTime)
    }

    const handleEnded = () => {
      if (currentSongIndex < songs.length - 1) {
        setCurrentSongIndex(currentSongIndex + 1)
      } else {
        setCurrentSongIndex(0)
        setIsPlaying(false)
      }
    }

    // Add event listeners
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioProgress)
    audio.addEventListener("ended", handleEnded)

    // Set volume
    audio.volume = volume

    // Play/pause based on state
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }

    // Cleanup
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioProgress)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [isPlaying, currentSongIndex, volume, songs.length])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false)
    }
  }

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0]
    setProgress(newProgress)
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress
    }
  }

  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1))
  }

  const playNext = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1))
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="glass-effect card-shadow rounded-lg p-4">
      <audio ref={audioRef} src={currentSong.url} />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-gray-800 dark:text-white">{currentSong.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{currentSong.artist}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <div className="w-20">
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="h-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(progress)}</span>
          <Slider
            value={[progress]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleProgressChange}
            className="h-1"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300" onClick={playPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300" onClick={playNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
