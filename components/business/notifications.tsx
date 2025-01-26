import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dbService, Notification } from '@/lib/db-service';
import { TranslatedText } from "@/components/ui/translated-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner"

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchNotifications = () => {
      const currentNotifications = dbService.getAllNotifications();
      setNotifications(currentNotifications);

      // Show toast for new unread notifications
      const unreadNotifications = currentNotifications.filter(n => !n.read);
      unreadNotifications.forEach(notification => {
        if (!notification.toastShown) {
          toast.info(
            <div className="flex flex-col gap-1">
              <TranslatedText text={notification.messageKey} params={notification.messageParams} />
              <span className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          );
          // Mark notification as shown in toast
          dbService.markNotificationToastShown(notification.id);
        }
      });
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    dbService.markNotificationAsRead(id);
    setNotifications(dbService.getAllNotifications());
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return true;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">
              <TranslatedText text="ALL" />
            </TabsTrigger>
            <TabsTrigger value="unread">
              <TranslatedText text="Unread" />
            </TabsTrigger>
            <TabsTrigger value="read">
              <TranslatedText text="Read" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-2">
            {filteredNotifications.length === 0 ? (
              <DropdownMenuItem disabled>
                <TranslatedText text="No notifications" />
              </DropdownMenuItem>
            ) : (
              filteredNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`cursor-pointer ${notification.read ? 'opacity-50' : ''}`}
                >
                  <div className="flex flex-col">
                    <TranslatedText text={notification.message} />
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

