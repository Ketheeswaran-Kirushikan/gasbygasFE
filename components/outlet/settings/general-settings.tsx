'use client'

import { useApp } from '@/contexts/app-context'
import { updateSettings } from '@/lib/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useTranslation } from '@/hooks/use-translation'

export function GeneralSettings() {
  const { state, dispatch } = useApp()
  const { t, setLanguage } = useTranslation()

  const handleUpdateSettings = async (key: string, value: any) => {
    const updatedSettings = await updateSettings('1', { [key]: value })
    dispatch({ type: 'UPDATE_SETTINGS', payload: updatedSettings })
    if (key === 'language') {
      setLanguage(value as 'en' | 'ta' | 'si' | 'zh')
    }
    if (key === 'darkMode') {
      document.documentElement.classList.toggle('dark', value)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t('General Settings')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm font-medium">{t('Language')}</Label>
          <Select
            value={state.settings.language}
            onValueChange={(value) => handleUpdateSettings('language', value)}
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder={t('Select language')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('English')}</SelectItem>
              <SelectItem value="ta">{t('தமிழ்')}</SelectItem>
              <SelectItem value="si">{t('සිංහල')}</SelectItem>
              <SelectItem value="zh">{t('中文')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode" className="text-sm font-medium">{t('Dark Mode')}</Label>
          <Switch
            id="darkMode"
            checked={state.settings.darkMode}
            onCheckedChange={(checked) => handleUpdateSettings('darkMode', checked)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

