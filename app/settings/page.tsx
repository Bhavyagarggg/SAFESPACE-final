"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  Shield,
  Bell,
  Moon,
  Sun,
  Save,
  Upload,
  Lock,
  Key,
  Eye,
  EyeOff,
  Globe,
  Clock,
  LogOut,
  UserCircle,
  History,
  Fingerprint,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = getSupabaseClient()

  // Profile settings
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: true,
    decoyMode: false,
    autoLock: true,
    rememberMe: true,
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    security: true,
    updates: false,
    marketing: false,
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    activityLog: true,
    dataCollection: false,
    locationTracking: false,
  })

  // Login history (mock data)
  const [loginHistory, setLoginHistory] = useState([
    {
      id: 1,
      date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      device: "Chrome on Windows",
      location: "New York, USA",
      ip: "192.168.1.1",
      status: "success",
    },
    {
      id: 2,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      device: "Safari on iPhone",
      location: "New York, USA",
      ip: "192.168.1.2",
      status: "success",
    },
    {
      id: 3,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      device: "Firefox on Mac",
      location: "Boston, USA",
      ip: "192.168.1.3",
      status: "failed",
    },
  ])

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)

        if (!user) {
          router.push("/login")
          return
        }

        // Get user profile from Supabase
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching profile:", error)
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          })
        } else if (profile) {
          // Set form values
          setName(profile.full_name || "")
          setEmail(user.email || "")
          setAvatarUrl(profile.avatar_url || "")
          setBio(profile.bio || "")
          setPhone(profile.phone || "")
        }
      } catch (error) {
        console.error("Error in loadUserProfile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [user, router, supabase, toast])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)

    try {
      // Validate passwords if changing
      if (password) {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          })
          setSaving(false)
          return
        }

        if (password.length < 8) {
          toast({
            title: "Error",
            description: "Password must be at least 8 characters",
            variant: "destructive",
          })
          setSaving(false)
          return
        }

        // Update password
        const { error: passwordError } = await supabase.auth.updateUser({
          password: password,
        })

        if (passwordError) {
          throw new Error(passwordError.message)
        }
      }

      // Update profile in Supabase
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: name,
          bio: bio,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (profileError) {
        throw new Error(profileError.message)
      }

      // Clear password fields
      setPassword("")
      setConfirmPassword("")

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSecurity = async () => {
    setSaving(true)

    try {
      // In a real app, you would save these settings to your database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)

    try {
      // In a real app, you would save these settings to your database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    setSaving(true)

    try {
      // In a real app, you would save these settings to your database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy settings have been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${user?.id}/avatar.${fileExt}`

      // Upload avatar to storage
      const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage.from("profiles").getPublicUrl(filePath)

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user?.id)

      if (updateError) {
        throw updateError
      }

      setAvatarUrl(data.publicUrl)

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    const diffSecs = Math.floor(diffMs / 1000)
    if (diffSecs < 60) return `${diffSecs} seconds ago`

    const diffMins = Math.floor(diffSecs / 60)
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`
  }

  const handleExportData = async () => {
    try {
      toast({
        title: "Exporting Data",
        description: "Your data export has started. You'll receive a download link shortly.",
      })

      // In a real app, you would generate and download the user's data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create a sample data object
      const userData = {
        profile: {
          name,
          email,
          phone,
          bio,
        },
        settings: {
          security,
          notifications,
          privacy,
        },
        // In a real app, you would include journal entries, files, etc.
      }

      // Convert to JSON and create download link
      const dataStr = JSON.stringify(userData, null, 2)
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

      const exportFileDefaultName = `safe-space-data-${new Date().toISOString().split("T")[0]}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()

      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
    )

    if (confirmed) {
      try {
        toast({
          title: "Processing",
          description: "Your account deletion request is being processed...",
        })

        // In a real app, you would delete the user's data and account
        await new Promise((resolve) => setTimeout(resolve, 2000))

        await signOut()
        router.push("/login")

        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Account Settings</h2>
            <p className="text-slate-600 dark:text-slate-400">Manage your profile and preferences</p>
          </div>

          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-white/20 dark:bg-slate-800/20 p-1 rounded-lg">
            <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Lock className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <History className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          readOnly
                          className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="border-slate-200 dark:border-slate-700 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 mb-4">
                      <Avatar className="w-32 h-32">
                        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
                        <AvatarFallback className="text-4xl">
                          {name ? name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                        <Upload className="h-4 w-4" />
                        <span>Change Avatar</span>
                      </div>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </Label>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border-slate-200 dark:border-slate-700 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-slate-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Leave blank if you don't want to change your password
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Security Settings</CardTitle>
                <CardDescription>Manage your security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Biometric Authentication</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Use fingerprint or face recognition to unlock
                      </p>
                    </div>
                    <Switch
                      checked={security.biometric}
                      onCheckedChange={(checked) => setSecurity({ ...security, biometric: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Decoy Mode</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Create a decoy vault for emergency situations
                      </p>
                    </div>
                    <Switch
                      checked={security.decoyMode}
                      onCheckedChange={(checked) => setSecurity({ ...security, decoyMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Auto-Lock</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Automatically lock after 5 minutes of inactivity
                      </p>
                    </div>
                    <Switch
                      checked={security.autoLock}
                      onCheckedChange={(checked) => setSecurity({ ...security, autoLock: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Remember Me</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Stay logged in on this device</p>
                    </div>
                    <Switch
                      checked={security.rememberMe}
                      onCheckedChange={(checked) => setSecurity({ ...security, rememberMe: checked })}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Security Keys</h3>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">Recovery Key</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Use this key if you lose access to your account
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-indigo-600 dark:text-indigo-400">
                      Generate Key
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-4">
                <Button
                  onClick={handleSaveSecurity}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Email Notifications</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Push Notifications</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications on your device</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>

                  <Separator className="my-4" />

                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Notification Types</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Security Alerts</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about security events</p>
                    </div>
                    <Switch
                      checked={notifications.security}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Product Updates</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive updates about new features</p>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Marketing</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive marketing and promotional emails
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-4">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Activity Log</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Track login activity and file access</p>
                    </div>
                    <Switch
                      checked={privacy.activityLog}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, activityLog: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Data Collection</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Allow anonymous usage data collection to improve the app
                      </p>
                    </div>
                    <Switch
                      checked={privacy.dataCollection}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, dataCollection: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-200">Location Tracking</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Allow location tracking for security purposes
                      </p>
                    </div>
                    <Switch
                      checked={privacy.locationTracking}
                      onCheckedChange={(checked) => setPrivacy({ ...privacy, locationTracking: checked })}
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Data Management</h3>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      className="text-indigo-600 dark:text-indigo-400"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button variant="outline" className="text-red-600 dark:text-red-400" onClick={handleDeleteAccount}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete My Account
                    </Button>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Deleting your account will permanently remove all your data. This action cannot be undone.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-4">
                <Button
                  onClick={handleSavePrivacy}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Login Activity</CardTitle>
                <CardDescription>Recent sign-ins to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loginHistory.map((login) => (
                    <div
                      key={login.id}
                      className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        login.status === "success" ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 p-2 rounded-full ${
                            login.status === "success"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {login.status === "success" ? (
                            <Fingerprint className="h-5 w-5" />
                          ) : (
                            <AlertTriangle className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-800 dark:text-slate-200">
                              {login.status === "success" ? "Successful Login" : "Failed Login Attempt"}
                            </h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{getTimeAgo(login.date)}</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            <span className="font-medium">{login.device}</span> • {login.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Globe className="h-3 w-3" />
                              <span>IP: {login.ip}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(login.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {login.status === "failed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/20"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Secure Account
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-200">Appearance</CardTitle>
                <CardDescription>Customize how Safe Space looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Theme</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose between light and dark mode</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className={`h-5 w-5 ${theme === "light" ? "text-amber-500" : "text-slate-400"}`} />
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                    <Moon className={`h-5 w-5 ${theme === "dark" ? "text-indigo-500" : "text-slate-400"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
