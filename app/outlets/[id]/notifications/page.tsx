'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/outlet/ui/card'
import { Button } from '@/components/outlet/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/outlet/ui/tabs"
import { Bell, Package, Truck, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '@/hooks/outlet/use-translation'
import { RootState, AppDispatch } from '@/app/Redux/store/store'
import { fetchNotificationsByUserIdThunk, updateNotificationThunk } from '@/app/Redux/features/notificationSlice'

type Notification = {
  _id: string
  message: string
  type: 'delivery' | 'stock' | 'alert' | 'success'
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const dispatch: AppDispatch = useDispatch()
  const { t } = useTranslation()
  const { id: userId } = useParams(); // ✅ Get userId from URL

  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotificationsByUserIdThunk(userId)); // ✅ Fetch user notifications
    }
  }, [dispatch, userId]);

  const filteredNotifications = notifications?.filter(notif => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notif.isRead
    if (activeTab === 'read') return notif.isRead
    return true
  }) || [];

  // ✅ Mark a single notification as read
  const markAsRead = (id: string) => {
    dispatch(updateNotificationThunk({ id, isRead: true }));
  }

  // ✅ Mark all unread notifications as read
  const markAllAsRead = () => {
    notifications.forEach(notif => {
      if (!notif.isRead) {
        dispatch(updateNotificationThunk({ id: notif._id, isRead: true }));
      }
    });
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'delivery':
        return <Truck className="h-5 w-5" />
      case 'stock':
        return <Package className="h-5 w-5" />
      case 'alert':
        return <AlertTriangle className="h-5 w-5" />
      case 'success':
        return <CheckCircle2 className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('Notifications')}</h1>
        <Button onClick={markAllAsRead}>{t('Mark all as read')}</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('Your Notifications')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-gray-500">{t('Loading notifications...')}</p>
          ) : (
            <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as 'all' | 'unread' | 'read')}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">{t('All')}</TabsTrigger>
                <TabsTrigger value="unread">{t('Unread')}</TabsTrigger>
                <TabsTrigger value="read">{t('Read')}</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {renderNotifications(filteredNotifications)}
              </TabsContent>
              <TabsContent value="unread">
                {renderNotifications(filteredNotifications)}
              </TabsContent>
              <TabsContent value="read">
                {renderNotifications(filteredNotifications)}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )

  function renderNotifications(notifs: Notification[]) {
    if (notifs.length === 0) {
      return <p className="text-center text-gray-500">{t('No notifications')}</p>
    }
    return notifs.map((notification) => (
      <div
        key={notification._id}
        className={`p-4 mb-4 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-white border border-gray-200'}`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${
            notification.type === 'alert' ? 'bg-red-100 text-red-600' :
            notification.type === 'stock' ? 'bg-yellow-100 text-yellow-600' :
            notification.type === 'success' ? 'bg-green-100 text-green-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString()}</p>
          </div>
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsRead(notification._id)}
            >
              {t('Mark as read')}
            </Button>
          )}
        </div>
      </div>
    ))
  }
}
