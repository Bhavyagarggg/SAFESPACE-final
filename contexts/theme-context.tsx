"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem("safe-space-theme") as Theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      if (savedTheme) {
        setTheme(savedTheme)
      } else if (prefersDark) {
        setTheme("dark")
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      localStorage.setItem("safe-space-theme", theme)

      // Remove existing theme classes
      document.documentElement.classList.remove("light", "dark")
      // Add current theme class
      document.documentElement.classList.add(theme)

      // Update CSS variables for proper contrast
      if (theme === "dark") {
        document.documentElement.style.setProperty("--text-primary", "#ffffff")
        document.documentElement.style.setProperty("--text-secondary", "#e5e7eb")
        document.documentElement.style.setProperty("--bg-primary", "#111827")
      } else {
        document.documentElement.style.setProperty("--text-primary", "#111827")
        document.documentElement.style.setProperty("--text-secondary", "#374151")
        document.documentElement.style.setProperty("--bg-primary", "#ffffff")
      }
    } catch (error) {
      console.error("Error setting theme:", error)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
