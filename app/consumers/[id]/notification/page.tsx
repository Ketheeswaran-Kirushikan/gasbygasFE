"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotificationsByUserIdThunk,
  updateNotificationThunk,
} from "@/app/Redux/features/notificationSlice";
import { RootState } from "@/app/Redux/store/store";
import { useParams } from "next/navigation";

export default function NotificationPage() {
  const dispatch = useDispatch();
  const [selectedNotification, setSelectedNotification] = useState<any>(null); // Holds the selected notification for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [activeTab, setActiveTab] = useState("all"); // Toggle state for Read/Unread

  const { id } = useParams();

  // Fetch notifications from Redux
  const { notifications, isLoading, error } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    // Dispatch fetchNotificationsThunk to fetch all notifications
    dispatch(fetchNotificationsByUserIdThunk(id));
  }, [dispatch, id]);

  // Filter notifications based on the active tab
  const filteredNotifications = notifications.filter((notification: any) => {
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "read") return notification.isRead;
    return true;
  });

  // Open modal and set selected notification
  const handleViewNotification = async (notification: any) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);

    // Mark notification as read if it is unread
    if (!notification.isRead) {
      const updateData = { id: notification._id, isRead: true };
      try {
        await dispatch(updateNotificationThunk(updateData)).unwrap();
      } catch (error) {
        console.error("Error updating notification:", error);
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedNotification(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {/* Toggle Tabs for Read/Unread */}
      <Tabs
        defaultValue="all"
        className="mb-6"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="flex space-x-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading and Error States */}
      {isLoading && <p>Loading notifications...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {/* Notifications List */}
      {!isLoading && filteredNotifications?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotifications.map((notification: any, index: number) => (
            <Card
              key={notification.id || notification._id || index} // Ensure unique key
              className={`p-4 ${
                notification.isRead
                  ? "bg-gray-100" // Read notifications
                  : "bg-blue-100 border-blue-500 shadow-lg" // Unread notifications (highlighted)
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {notification.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 truncate">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleViewNotification(notification)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !isLoading && <p>No notifications available.</p>
      )}
      {/* Notification Modal */}
      {selectedNotification && (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedNotification.title}</DialogTitle>
            </DialogHeader>
            {/* Replace nested tags with divs */}
            <div className="space-y-2 mt-2">
              <p>{selectedNotification.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
