'use client'

import { useState, useEffect } from 'react'
import { Bell, Package, Truck, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type Notification = {
  id: string
  title: string
  message: string
  type: 'delivery' | 'stock' | 'alert'
  read: boolean
  timestamp: string
}

interface NotificationsListProps {
  onUnreadCountChange: (count: number) => void;
}

export function NotificationsList({ onUnreadCountChange }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Low Stock Alert',
      message: 'Domestic cylinder stock is below threshold',
      type: 'stock',
      read: false,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      title: 'New Delivery Request',
      message: 'New delivery request #TKN123 received',
      type: 'delivery',
      read: false,
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      title: 'System Alert',
      message: 'System maintenance scheduled for tonight',
      type: 'alert',
      read: false,
      timestamp: '5 hours ago'
    }
  ])

  const [category, setCategory] = useState<'all' | 'unread' | 'read'>('all')

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'delivery':
        return <Truck className="h-5 w-5" />
      case 'stock':
        return <Package className="h-5 w-5" />
      case 'alert':
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (category === 'all') return true;
    if (category === 'unread') return !notif.read;
    if (category === 'read') return notif.read;
    return true;
  })

  const renderNotifications = (notifs: Notification[]) => {
    if (notifs.length === 0) {
      return <p className="text-center text-gray-500">No notifications in this category.</p>
    }
    return notifs?.map((notification) => (
      <Card
        key={notification.id}
        className={`p-4 ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${
            notification.type === 'alert' ? 'bg-red-100 text-red-600' :
            notification.type === 'stock' ? 'bg-yellow-100 text-yellow-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{notification.title}</h3>
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
          </div>
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsRead(notification.id)}
            >
              Mark as read
            </Button>
          )}
        </div>
      </Card>
    ))
  }

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    onUnreadCountChange(unreadCount);
  }, [notifications, onUnreadCountChange]);

  return (
    <Tabs defaultValue="all" onValueChange={(value) => setCategory(value as 'all' | 'unread' | 'read')}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="unread">Unread</TabsTrigger>
        <TabsTrigger value="read">Read</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="space-y-4">
        {renderNotifications(filteredNotifications)}
      </TabsContent>
      <TabsContent value="unread" className="space-y-4">
        {renderNotifications(filteredNotifications)}
      </TabsContent>
      <TabsContent value="read" className="space-y-4">
        {renderNotifications(filteredNotifications)}
      </TabsContent>
    </Tabs>
  )
}

