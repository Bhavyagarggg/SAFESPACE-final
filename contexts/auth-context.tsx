"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)

        console.log("Initial session check:", session ? "Logged in" : "Not logged in")
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "Session exists" : "No session")
      setUser(session?.user ?? null)
      setLoading(false)

      // Redirect based on auth state
      if (event === "SIGNED_IN" && window.location.pathname === "/login") {
        router.push("/home")
      } else if (event === "SIGNED_OUT") {
        router.push("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in with:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Sign in result:", error ? `Error: ${error.message}` : "Success")

      if (data.user) {
        console.log("User signed in:", data.user.email)
      }

      return { error }
    } catch (error: any) {
      console.error("Unexpected error during sign in:", error)
      return { error: { message: "An unexpected error occurred" } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Attempting sign up with:", email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      console.log("Sign up result:", error ? `Error: ${error.message}` : "Success")

      if (data.user) {
        console.log("User signed up:", data.user.email)

        // Create a profile record for the new user
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            full_name: fullName,
            avatar_url: "",
            updated_at: new Date().toISOString(),
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }

      return { error }
    } catch (error: any) {
      console.error("Unexpected error during sign up:", error)
      return { error: { message: "An unexpected error occurred" } }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      console.log("User signed out")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
