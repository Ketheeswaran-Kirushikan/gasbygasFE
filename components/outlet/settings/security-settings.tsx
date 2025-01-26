'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useTranslation } from '@/hooks/use-translation'

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function SecuritySettings() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  })

  const onSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)

    // In a real app, you would call an API to change the password here
    console.log('Password change data:', data)

    // Show success notification
    toast({
      title: t('Password Changed'),
      description: t('Your password has been successfully updated.'),
      duration: 5000,
    })

    // Reset form
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('Security Settings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('Current Password')}</Label>
            <Input
              id="current-password"
              type="password"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{t(errors.currentPassword.message || '')}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('New Password')}</Label>
            <Input
              id="new-password"
              type="password"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">{t(errors.newPassword.message || '')}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('Confirm New Password')}</Label>
            <Input
              id="confirm-password"
              type="password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{t(errors.confirmPassword.message || '')}</p>
            )}
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('Changing Password...') : t('Change Password')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

