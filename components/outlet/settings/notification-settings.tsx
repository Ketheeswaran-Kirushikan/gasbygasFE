'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/outlet/app-context'
import { updateSettings } from '@/lib/outlet/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function NotificationSettings({outlet}) {
  const { state, dispatch } = useApp()
  const { toast } = useToast()
  const [localSettings, setLocalSettings] = useState({
    emailNotifications: state.settings.emailNotifications,
    stockAlerts: state.settings.stockAlerts,
    deliveryUpdates: state.settings.deliveryUpdates,
    notificationFrequency: state.settings.notificationFrequency || 'daily',
    lowStockThreshold: state.settings.lowStockThreshold || 20,
  })

  const handleUpdateSettings = async (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = async () => {
    try {
      const updatedSettings = await updateSettings('1', localSettings)
      dispatch({ type: 'UPDATE_SETTINGS', payload: updatedSettings })
      toast({
        title: 'Settings Updated',
        description: 'Your notification settings have been successfully updated.',
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={localSettings.emailNotifications}
            onCheckedChange={(checked) => handleUpdateSettings('emailNotifications', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="stock-alerts">Stock Alerts</Label>
          <Switch
            id="stock-alerts"
            checked={localSettings.stockAlerts}
            onCheckedChange={(checked) => handleUpdateSettings('stockAlerts', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="delivery-updates">Delivery Updates</Label>
          <Switch
            id="delivery-updates"
            checked={localSettings.deliveryUpdates}
            onCheckedChange={(checked) => handleUpdateSettings('deliveryUpdates', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notification-frequency">Notification Frequency</Label>
          <Select
            value={localSettings.notificationFrequency}
            onValueChange={(value) => handleUpdateSettings('notificationFrequency', value)}
          >
            <SelectTrigger id="notification-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="low-stock-threshold">Low Stock Threshold (%)</Label>
          <Input
            id="low-stock-threshold"
            type="number"
            min="1"
            max="100"
            value={localSettings.lowStockThreshold}
            onChange={(e) => handleUpdateSettings('lowStockThreshold', parseInt(e.target.value))}
          />
        </div>
        <Button onClick={handleSaveSettings} className="w-full">
          Save Notification Settings
        </Button>
      </CardContent>
    </Card>
  )
}
