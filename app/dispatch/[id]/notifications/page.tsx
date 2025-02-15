"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Layout } from "@/components/dispatch/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Bell, AlertTriangle, CheckCircle, Clock, X, Filter, Bookmark, Star, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { fetchNotificationsByUserIdThunk, updateNotificationThunk, deleteNotificationThunk } from "@/app/Redux/features/notificationSlice"; // Import the thunks

export default function NotificationsPage() {
  const { id: userId } = useParams(); // Get userId from URL parameters
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications); // Access notifications from Redux store
  const { toast } = useToast();

  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch notifications for the user when the component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotificationsByUserIdThunk(userId));
    }
  }, [dispatch, userId]);

  console.log("notifications", notifications);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.isRead).length);
  }, [notifications]);

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "unread") return !notification.isRead;
      if (filter === "starred") return notification.starred;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .filter((notification) => {
      const now = new Date();
      const notificationDate = new Date(notification.createdAt);
      if (timeFilter === "today") return notificationDate.toDateString() === now.toDateString();
      if (timeFilter === "yesterday") {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return notificationDate.toDateString() === yesterday.toDateString();
      }
      if (timeFilter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return notificationDate >= startOfWeek;
      }
      if (timeFilter === "month") {
        const startOfMonth = new Date(now);
        startOfMonth.setDate(1);
        return notificationDate >= startOfMonth;
      }
      return true;
    })
    .filter((notification) => notification?.message.toLowerCase().includes(searchTerm.toLowerCase()));

  // Mark a notification as read
  const markAsRead = (id) => {
    dispatch(updateNotificationThunk({ id, isRead: true })); // Update notification in Redux store
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    notifications.forEach((notification) => {
      if (!notification.isRead) {
        dispatch(updateNotificationThunk({ id: notification._id, isRead: true })); // Update each notification
      }
    });
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  // Delete a notification
  const deleteNotification = (id) => {
    dispatch(deleteNotificationThunk(id)); // Delete notification from Redux store
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  // Star a notification
  const starNotification = (id) => {
    const notification = notifications.find((n) => n._id === id);
    if (notification) {
      dispatch(updateNotificationThunk({ id, starred: !notification.starred })); // Toggle starred status
      toast({
        title: "Notification starred",
        description: "The notification has been starred/unstarred.",
      });
    }
  };

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
                    <Select value={filter} onValueChange={(value) => setFilter(value)}>
                      <SelectTrigger className="w-[120px] text-xs sm:text-sm">
                        <SelectValue placeholder="All Notifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Notifications</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {loading ? (
                    <p className="text-center py-4">Loading notifications...</p>
                  ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                  ) : filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={cn(
                          "flex items-start space-x-4 rounded-lg border p-4 transition-colors notification-card",
                          notification.isRead ? "bg-background" : "bg-muted",
                          "hover:bg-muted/50",
                        )}
                      >
                        <Bell className="h-5 w-5 text-blue-500" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{notification.message}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{notification.category}</Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground notification-timestamp">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
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
                              <DropdownMenuItem onClick={() => markAsRead(notification._id)}>
                                Mark as {notification.isRead ? "unread" : "read"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => starNotification(notification._id)}>
                                {notification.starred ? "Unstar" : "Star"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => deleteNotification(notification._id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Button variant="ghost" size="sm" onClick={() => starNotification(notification._id)}>
                            <Star
                              className={cn(
                                "h-4 w-4",
                                notification.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground",
                              )}
                            />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4">No notifications found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}