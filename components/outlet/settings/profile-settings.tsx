'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useApp } from '@/contexts/app-context'

export function ProfileSettings() {
  const { state } = useApp()
  const [profile, setProfile] = useState({
    name: state.users[0]?.name || '',
    email: state.users[0]?.email || '',
    phone: state.users[0]?.phone || ''
  })

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API to update the profile
    console.log('Updating profile...', profile)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <Button type="submit">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  )
}

