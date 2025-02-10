"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import { Switch } from "@/components/distpach/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/distpach/ui/tabs"
import { useToast } from "@/components/distpach/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/distpach/ui/select"
import {
  User,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Clock,
  AlertTriangle,
  Camera,
  Pencil,
  Trash,
  Lock,
  LogOut,
} from "lucide-react"
import { useTheme } from "@/contexts/distpach/ThemeContext"
import { Eye, EyeOff, Shield, History, Key } from "lucide-react"
import { Progress } from "@/components/distpach/ui/progress"
import { Slider } from "@/components/distpach/ui/slider"
import { Checkbox } from "@/components/distpach/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/distpach/ui/radio-group"
import { Textarea } from "@/components/distpach/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/distpach/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/distpach/ui/dialog"
import { Loader2 } from "lucide-react"

function calculatePasswordStrength(password: string): number {
  let strength = 0
  if (password.length > 6) strength += 20
  if (password.length > 10) strength += 20
  if (/[A-Z]/.test(password)) strength += 20
  if (/[0-9]/.test(password)) strength += 20
  if (/[^A-Za-z0-9]/.test(password)) strength += 20
  return strength
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("english")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    role: "Manager",
    department: "Operations",
    bio: "Experienced manager with a passion for efficient operations.",
    avatar: "/placeholder.svg?height=128&width=128",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
    },
    preferences: {
      emailUpdates: true,
      profileVisibility: "public",
    },
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    frequency: "realtime",
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00",
    },
    categories: {
      newOrders: true,
      orderUpdates: true,
      lowStockAlerts: true,
      deliveryUpdates: true,
      systemAlerts: true,
    },
    urgencyLevel: 50,
  })

  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false)
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false)
  const [isLogoutAllDevicesDialogOpen, setIsLogoutAllDevicesDialogOpen] = useState(false)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsChangePasswordDialogOpen(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    })
  }

  const handleLogoutAllDevices = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsLogoutAllDevicesDialogOpen(false)
    toast({
      title: "Logged Out",
      description: "You have been logged out of all devices.",
    })
  }

  const handleDeleteAccount = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsDeleteAccountDialogOpen(false)
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    })
  }

  const handleNotificationChange = (key: string, value: any) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      categories: { ...prev.categories, [category]: checked },
    }))
  }

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    toast({
      title: "Notification Preferences Saved",
      description: "Your notification settings have been updated successfully.",
    })
  }

  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "profile") {
      // Set the active tab to "profile"
      // This assumes you're using some state to control the active tab
      // Update this to match your tab state management
      // For example:
      // setActiveTab("profile")
    }
  }, [searchParams])

  return (
    <Layout>
      <Tabs defaultValue="profile" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-full sm:w-auto justify-start">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              User Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              Notification Settings
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security Settings
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs sm:text-sm">
              Account Actions
            </TabsTrigger>
            <TabsTrigger value="general" className="text-xs sm:text-sm">
              General Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardContent className="space-y-6 p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
                        <AvatarFallback>
                          {profile.firstName[0]}
                          {profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 text-center">
                        <h3 className="text-2xl font-semibold">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{profile.role}</p>
                      </div>
                      <div>
                        <Label htmlFor="avatar" className="cursor-pointer">
                          <div className="flex items-center space-x-2 rounded-md border px-3 py-2 text-sm">
                            <Camera className="h-4 w-4" />
                            <span>Change Avatar</span>
                          </div>
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Social Links</Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="LinkedIn URL"
                            value={profile.socialLinks.linkedin}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                              }))
                            }
                          />
                          <Input
                            placeholder="Twitter URL"
                            value={profile.socialLinks.twitter}
                            onChange={(e) =>
                              setProfile((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, twitter: e.target.value },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profile.firstName}
                            onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profile.lastName}
                            onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={profile.role}
                          onValueChange={(value) => setProfile((prev) => ({ ...prev, role: value }))}
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Dispatcher">Dispatcher</SelectItem>
                            <SelectItem value="Driver">Driver</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Profile Visibility</Label>
                        <Select
                          value={profile.preferences.profileVisibility}
                          onValueChange={(value) =>
                            setProfile((prev) => ({
                              ...prev,
                              preferences: { ...prev.preferences, profileVisibility: value },
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="team-only">Team Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="emailUpdates"
                          checked={profile.preferences.emailUpdates}
                          onCheckedChange={(checked) =>
                            setProfile((prev) => ({
                              ...prev,
                              preferences: { ...prev.preferences, emailUpdates: checked as boolean },
                            }))
                          }
                        />
                        <Label htmlFor="emailUpdates">Receive email updates about new features and announcements</Label>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Profile"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <Card>
                <CardContent className="space-y-6 p-6">
                  <form onSubmit={handleSaveNotifications} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Channels</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-5 w-5" />
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={notificationSettings.email}
                            onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-5 w-5" />
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={notificationSettings.push}
                            onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-5 w-5" />
                            <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          </div>
                          <Switch
                            id="sms-notifications"
                            checked={notificationSettings.sms}
                            onCheckedChange={(checked) => handleNotificationChange("sms", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                          </div>
                          <Switch
                            id="in-app-notifications"
                            checked={notificationSettings.inApp}
                            onCheckedChange={(checked) => handleNotificationChange("inApp", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Categories</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {Object.entries(notificationSettings.categories).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={value}
                              onCheckedChange={(checked) => handleCategoryChange(key, checked as boolean)}
                            />
                            <Label htmlFor={key}>
                              {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Frequency</h3>
                      <RadioGroup
                        value={notificationSettings.frequency}
                        onValueChange={(value) => handleNotificationChange("frequency", value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="realtime" id="realtime" />
                          <Label htmlFor="realtime">Real-time</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hourly" id="hourly" />
                          <Label htmlFor="hourly">Hourly Digest</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily">Daily Digest</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Quiet Hours</h3>
                        <Switch
                          checked={notificationSettings.quietHours.enabled}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("quietHours", {
                              ...notificationSettings.quietHours,
                              enabled: checked,
                            })
                          }
                        />
                      </div>
                      {notificationSettings.quietHours.enabled && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="quiet-hours-start">Start Time</Label>
                            <Input
                              id="quiet-hours-start"
                              type="time"
                              value={notificationSettings.quietHours.start}
                              onChange={(e) =>
                                handleNotificationChange("quietHours", {
                                  ...notificationSettings.quietHours,
                                  start: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quiet-hours-end">End Time</Label>
                            <Input
                              id="quiet-hours-end"
                              type="time"
                              value={notificationSettings.quietHours.end}
                              onChange={(e) =>
                                handleNotificationChange("quietHours", {
                                  ...notificationSettings.quietHours,
                                  end: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Urgency Level</h3>
                      <div className="flex items-center space-x-4">
                        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                        <Slider
                          value={[notificationSettings.urgencyLevel]}
                          onValueChange={(value) => handleNotificationChange("urgencyLevel", value[0])}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-12 text-right">{notificationSettings.urgencyLevel}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Adjust the slider to set the minimum urgency level for notifications you want to receive.
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Notification Settings"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <Card>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <Button onClick={() => setIsChangePasswordDialogOpen(true)}>Change Password</Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center space-x-2">
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                      <Label>Enable Two-Factor Authentication</Label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Login History</h3>
                    <Button variant="outline">View Login History</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <Card>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Account Actions</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Button variant="outline" onClick={() => setIsLogoutAllDevicesDialogOpen(true)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out of All Devices
                      </Button>
                      <Button variant="destructive" onClick={() => setIsDeleteAccountDialogOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="general">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <Card>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme</h3>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="theme-select">Select Theme</Label>
                      <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark")}>
                        <SelectTrigger id="theme-select">
                          <SelectValue placeholder="Choose a theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Language</h3>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="language-select">Select Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language-select">
                          <SelectValue placeholder="Choose a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="tamil">Tamil</SelectItem>
                          <SelectItem value="sinhala">Sinhala</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => {
                  setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  setPasswordStrength(calculatePasswordStrength(e.target.value))
                }}
              />
              <Progress value={passwordStrength} className="h-2 w-full" />
              <p className="text-sm text-muted-foreground">
                {passwordStrength < 33 && "Weak"}
                {passwordStrength >= 33 && passwordStrength < 66 && "Medium"}
                {passwordStrength >= 66 && "Strong"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isLogoutAllDevicesDialogOpen} onOpenChange={setIsLogoutAllDevicesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Out of All Devices</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of all devices? This will end all active sessions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutAllDevicesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogoutAllDevices} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging Out...
                </>
              ) : (
                "Log Out of All Devices"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteAccountDialogOpen} onOpenChange={setIsDeleteAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <style jsx>{`
        .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 640px) {
          .overflow-x-auto {
            margin-left: -1rem;
            margin-right: -1rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </Layout>
  )
}

