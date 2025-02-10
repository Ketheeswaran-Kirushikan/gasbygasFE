"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Badge } from "@/components/distpach/ui/badge"
import { useToast } from "@/components/distpach/ui/use-toast"
import { Bell, AlertTriangle, CheckCircle, Clock, X, Filter, Bookmark, Star, Send } from "lucide-react"
import { cn } from "@/lib/distpach/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/distpach/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error" | "stock" | "delivery" | "user"
  category: "delivery" | "stock" | "system" | "user"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
  starred: boolean
  replyable?: boolean
  actions?: {
    primary?: {
      label: string
      action: string
    }
    secondary?: {
      label: string
      action: string
    }
  }
  icon?: string
  color?: string
  replies?: string[]
}

interface ActiveAlert {
  id: string
  title: string
  message: string
  timestamp: string
  type: "critical" | "warning"
  acknowledged: boolean
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  deliveryNotifications: boolean
  stockAlerts: boolean
  systemUpdates: boolean
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "info",
    category: "delivery",
    title: "New delivery request",
    message: "A new delivery request has been submitted for Outlet A",
    timestamp: "2023-06-10 09:30",
    read: false,
    priority: "medium",
    starred: false,
    replyable: false,
  },
  {
    id: "2",
    type: "warning",
    category: "stock",
    title: "Low stock alert",
    message: "Outlet B is running low on Product X",
    timestamp: "2023-06-10 10:15",
    read: false,
    priority: "high",
    starred: false,
    replyable: false,
  },
  {
    id: "3",
    type: "success",
    category: "delivery",
    title: "Delivery completed",
    message: "The delivery to Outlet C has been successfully completed",
    timestamp: "2023-06-10 11:00",
    read: false,
    priority: "low",
    starred: false,
    replyable: false,
  },
  {
    id: "4",
    type: "system",
    category: "system",
    title: "System maintenance",
    message: "Scheduled system maintenance in 1 hour",
    timestamp: "2023-06-10 13:45",
    read: false,
    priority: "high",
    starred: false,
    replyable: false,
  },
  {
    id: "5",
    type: "info",
    category: "delivery",
    title: "Delivery confirmation needed",
    message: "Please confirm the delivery schedule for Outlet D",
    timestamp: "2023-06-10 14:30",
    read: false,
    priority: "high",
    starred: false,
    replyable: true,
  },
  {
    id: "6",
    type: "warning",
    category: "stock",
    title: "Stock discrepancy",
    message: "There's a discrepancy in the stock count for Product Y at Outlet E. Please investigate and report back.",
    timestamp: "2023-06-10 15:45",
    read: false,
    priority: "medium",
    starred: false,
    replyable: true,
  },
]

const initialActiveAlerts: ActiveAlert[] = [
  {
    id: "1",
    title: "Downtown Station",
    message: "Stock level below 20%, Immediate action required.",
    timestamp: "7:51:58 PM",
    type: "critical",
    acknowledged: false,
  },
  {
    id: "2",
    title: "Westside Gas",
    message: "Delivery DL003 is running 30 minutes late",
    timestamp: "7:51:58 PM",
    type: "warning",
    acknowledged: false,
  },
]

const initialNotificationSettings: NotificationSettings = {
  email: true,
  push: true,
  sms: false,
  deliveryNotifications: true,
  stockAlerts: true,
  systemUpdates: false,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeAlerts, setActiveAlerts] = useState(initialActiveAlerts)
  const [filter, setFilter] = useState<
    "all" | "unread" | "high" | "starred" | "stock" | "delivery" | "system" | "user"
  >("all")
  const [categoryFilter, setCategoryFilter] = useState<"all" | "delivery" | "stock" | "system" | "user">("all")
  const [savedNotifications, setSavedNotifications] = useState<Notification[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings)
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isSavedNotificationsDialogOpen, setIsSavedNotificationsDialogOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [timeFilter, setTimeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchTerm, setSearchTerm] = useState("") // Added searchTerm state
  const { toast } = useToast()

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    })
  }

  const starNotification = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, starred: !notification.starred } : notification,
      ),
    )
    toast({
      title: "Notification starred",
      description: "The notification has been starred/unstarred.",
    })
  }

  const acknowledgeAlert = (id: string) => {
    setActiveAlerts(activeAlerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
    toast({
      title: "Alert acknowledged",
      description: "The alert has been acknowledged and will be handled.",
    })
  }

  const dismissAlert = (id: string) => {
    setActiveAlerts(activeAlerts.filter((alert) => alert.id !== id))
    toast({
      title: "Alert dismissed",
      description: "The alert has been dismissed.",
    })
  }

  const replyToNotification = (id: string, reply: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, replies: [...(notification.replies || []), reply] } : notification,
      ),
    )
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully.",
    })
  }

  const saveNotification = (notification: Notification) => {
    setSavedNotifications([...savedNotifications, notification])
    toast({
      title: "Notification saved",
      description: "The notification has been saved for later reference.",
    })
  }

  const removeSavedNotification = (id: string) => {
    setSavedNotifications(savedNotifications.filter((notification) => notification.id !== id))
    toast({
      title: "Saved notification removed",
      description: "The saved notification has been removed.",
    })
  }

  const sendBroadcast = (message: string, recipients: string[]) => {
    console.log(`Sending broadcast: ${message} to ${recipients.join(", ")}`)
    toast({
      title: "Broadcast sent",
      description: `Your message has been sent to ${recipients.length} recipient(s).`,
    })
    setIsBroadcastDialogOpen(false)
  }

  const updateNotificationSettings = (newSettings: NotificationSettings) => {
    setNotificationSettings(newSettings)
    toast({
      title: "Settings updated",
      description: "Your notification settings have been updated.",
    })
    setIsSettingsDialogOpen(false)
  }

  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "unread") return !notification.read
      if (filter === "high") return notification.priority === "high"
      if (filter === "starred") return notification.starred
      if (filter === "stock") return notification.category === "stock"
      if (filter === "delivery") return notification.category === "delivery"
      if (filter === "system") return notification.category === "system"
      if (filter === "user") return notification.category === "user"
      return true
    })
    .filter((notification) => {
      if (categoryFilter === "all") return true
      return notification.category === categoryFilter
    })
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      if (sortBy === "priority") {
        const priorityOrder = ["low", "medium", "high"]
        return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    .filter((notification) => {
      const now = new Date()
      const notificationDate = new Date(notification.timestamp)
      if (timeFilter === "today") return notificationDate.toDateString() === now.toDateString()
      if (timeFilter === "yesterday") {
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        return notificationDate.toDateString() === yesterday.toDateString()
      }
      if (timeFilter === "week") {
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        return notificationDate >= startOfWeek
      }
      if (timeFilter === "month") {
        const startOfMonth = new Date(now)
        startOfMonth.setDate(1)
        return notificationDate >= startOfMonth
      }
      return true
    })
    .filter((notification) => notification.title.toLowerCase().includes(searchTerm.toLowerCase())) // Added search filter

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "system":
        return <Clock className="h-5 w-5 text-purple-500" />
      case "error":
        return <Clock className="h-5 w-5 text-red-500" />
      case "stock":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "delivery":
        return <Send className="h-5 w-5 text-blue-500" />
      case "user":
        return <Star className="h-5 w-5 text-green-500" />
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random()
      if (random > 0.7) {
        const newNotification: Notification = {
          id: Math.random().toString(),
          type: "info",
          category: "delivery",
          title: "Real-time Update",
          message: `New system update at ${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toLocaleString(),
          read: false,
          priority: "medium",
          starred: false,
          replyable: false,
        }
        setNotifications((prev) => [newNotification, ...prev])

        toast({
          title: "New Notification",
          description: "You have received a new notification.",
        })
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  return (
    <Layout unreadCount={unreadCount}>
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <Card className="h-full">
              <CardHeader className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <div className="w-full sm:w-auto overflow-x-auto">
                  <div className="flex items-center space-x-2 min-w-max">
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-[200px] text-sm"
                    />
                    <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
                      <SelectTrigger className="w-[120px] text-xs sm:text-sm">
                        <SelectValue placeholder="All Notifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Notifications</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="starred">Starred</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value)}>
                      <SelectTrigger className="w-[120px] text-xs sm:text-sm">
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs sm:text-sm">
                      Mark all as read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsBroadcastDialogOpen(true)}
                      className="text-xs sm:text-sm"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Broadcast
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start space-x-4 rounded-lg border p-4 transition-colors notification-card",
                        notification.read ? "bg-background" : "bg-muted",
                        notification.type === "stock" && "border-l-4 border-l-red-500",
                        notification.type === "delivery" && "border-l-4 border-l-blue-500",
                        notification.type === "warning" && "border-l-4 border-l-yellow-500",
                        notification.type === "user" && "border-l-4 border-l-green-500",
                        "hover:bg-muted/50",
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{notification.title}</p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                notification.priority === "high"
                                  ? "destructive"
                                  : notification.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline">{notification.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground notification-timestamp">{notification.timestamp}</p>
                        {notification.replyable && (
                          <div className="mt-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Quick Reply
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => replyToNotification(notification.id, "Acknowledged")}>
                                  Acknowledge
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => replyToNotification(notification.id, "In progress")}>
                                  In progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => replyToNotification(notification.id, "Completed")}>
                                  Completed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const reply = prompt("Enter your reply:")
                                    if (reply) replyToNotification(notification.id, reply)
                                  }}
                                >
                                  Custom reply...
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                        {notification.replies && notification.replies.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm font-medium">Replies:</p>
                            {notification.replies.map((reply, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                {reply}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 notification-buttons">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              Mark as {notification.read ? "unread" : "read"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => starNotification(notification.id)}>
                              {notification.starred ? "Unstar" : "Star"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => saveNotification(notification)}>
                              Save for later
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="sm" onClick={() => starNotification(notification.id)}>
                          <Star
                            className={cn(
                              "h-4 w-4",
                              notification.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground",
                            )}
                          />
                        </Button>
                      </div>
                      {notification.actions && (
                        <div className="mt-2 flex gap-2 notification-actions">
                          {notification.actions.primary && (
                            <Button size="sm" variant="default">
                              {notification.actions.primary.label}
                            </Button>
                          )}
                          {notification.actions.secondary && (
                            <Button size="sm" variant="outline">
                              {notification.actions.secondary.label}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle>Active Alerts</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {activeAlerts.length}
                  </Badge>
                </div>
                <Button variant="link" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={cn(
                      "rounded-lg p-4",
                      alert.type === "critical" ? "bg-red-50 dark:bg-red-900/20" : "bg-yellow-50 dark:bg-yellow-900/20",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p
                          className={cn(
                            "font-semibold",
                            alert.type === "critical" ? "text-red-900" : "text-yellow-900",
                          )}
                        >
                          {alert.title}
                        </p>
                        <p className={cn("text-sm", alert.type === "critical" ? "text-red-700" : "text-yellow-700")}>
                          {alert.message}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!alert.acknowledged && (
                          <Button variant="ghost" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                          Dismiss
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {alert.timestamp}
                      {alert.acknowledged && <span className="ml-2 text-green-600">(Acknowledged)</span>}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <Dialog open={isBroadcastDialogOpen} onOpenChange={setIsBroadcastDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Broadcast</DialogTitle>
              <DialogDescription>Send a broadcast message to multiple recipients.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const message = formData.get("message") as string
                const recipients = formData.get("recipients") as string
                sendBroadcast(
                  message,
                  recipients.split(",").map((r) => r.trim()),
                )
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients (comma-separated)</Label>
                  <Input id="recipients" name="recipients" placeholder="john@example.com, jane@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Enter your broadcast message here" />
                </div>
                <Button type="submit">Send Broadcast</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Notification Settings</DialogTitle>
              <DialogDescription>Customize your notification preferences.</DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const newSettings: NotificationSettings = {
                  email: formData.get("email") === "on",
                  push: formData.get("push") === "on",
                  sms: formData.get("sms") === "on",
                  deliveryNotifications: formData.get("deliveryNotifications") === "on",
                  stockAlerts: formData.get("stockAlerts") === "on",
                  systemUpdates: formData.get("systemUpdates") === "on",
                }
                updateNotificationSettings(newSettings)
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email Notifications</Label>
                  <Switch id="email" name="email" defaultChecked={notificationSettings.email} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push">Push Notifications</Label>
                  <Switch id="push" name="push" defaultChecked={notificationSettings.push} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms">SMS Notifications</Label>
                  <Switch id="sms" name="sms" defaultChecked={notificationSettings.sms} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="deliveryNotifications">Delivery Notifications</Label>
                  <Switch
                    id="deliveryNotifications"
                    name="deliveryNotifications"
                    defaultChecked={notificationSettings.deliveryNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="stockAlerts">Stock Alerts</Label>
                  <Switch id="stockAlerts" name="stockAlerts" defaultChecked={notificationSettings.stockAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="systemUpdates">System Updates</Label>
                  <Switch id="systemUpdates" name="systemUpdates" defaultChecked={notificationSettings.systemUpdates} />
                </div>
                <Button type="submit">Save Settings</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isSavedNotificationsDialogOpen} onOpenChange={setIsSavedNotificationsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Saved Notifications</DialogTitle>
              <DialogDescription>View and manage your saved notifications.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {savedNotifications.length === 0 ? (
                <p>No saved notifications.</p>
              ) : (
                savedNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-4 rounded-lg border p-4">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeSavedNotification(notification.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
;<style jsx>{`
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
  @media (max-width: 640px) {
    .notification-filters {
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .notification-filters > * {
      width: 100%;
    }

    .notification-card {
      flex-direction: column;
      gap: 1rem;
    }

    .notification-actions {
      width: 100%;
      justify-content: flex-start;
    }
  }

  @media (max-width: 340px) {
    .notification-timestamp {
      font-size: 0.75rem;
    }

    .notification-buttons {
      flex-direction: column;
      width: 100%;
    }
  }
`}</style>

