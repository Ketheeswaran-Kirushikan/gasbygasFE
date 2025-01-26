'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/app-context'
import { updateSettings } from '@/lib/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from '@/hooks/use-translation'

export function NotificationSettings() {
  const { state, dispatch } = useApp()
  const { t } = useTranslation()
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
        title: t('Settings Updated'),
        description: t('Your notification settings have been successfully updated.'),
        duration: 3000,
      })
    } catch (error) {
      console.error('Failed to update settings:', error)
      toast({
        title: t('Error'),
        description: t('Failed to update settings. Please try again.'),
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Notification Settings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">{t('Email Notifications')}</Label>
          <Switch
            id="email-notifications"
            checked={localSettings.emailNotifications}
            onCheckedChange={(checked) => handleUpdateSettings('emailNotifications', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="stock-alerts">{t('Stock Alerts')}</Label>
          <Switch
            id="stock-alerts"
            checked={localSettings.stockAlerts}
            onCheckedChange={(checked) => handleUpdateSettings('stockAlerts', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="delivery-updates">{t('Delivery Updates')}</Label>
          <Switch
            id="delivery-updates"
            checked={localSettings.deliveryUpdates}
            onCheckedChange={(checked) => handleUpdateSettings('deliveryUpdates', checked)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notification-frequency">{t('Notification Frequency')}</Label>
          <Select
            value={localSettings.notificationFrequency}
            onValueChange={(value) => handleUpdateSettings('notificationFrequency', value)}
          >
            <SelectTrigger id="notification-frequency">
              <SelectValue placeholder={t('Select frequency')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">{t('Real-time')}</SelectItem>
              <SelectItem value="daily">{t('Daily')}</SelectItem>
              <SelectItem value="weekly">{t('Weekly')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="low-stock-threshold">{t('Low Stock Threshold (%)')}</Label>
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
          {t('Save Notification Settings')}
        </Button>
      </CardContent>
    </Card>
  )
}

