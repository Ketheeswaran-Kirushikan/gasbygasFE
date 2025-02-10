'use client'

import { useState, useRef } from 'react'
import { useApp } from '@/contexts/outlet/app-context'
import { useTranslation } from '@/hooks/outlet/use-translation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { User, UserRole } from '@/Types/outlet/index'

export function ProfilePage() {
  const { state, dispatch } = useApp()
  const { t } = useTranslation()
  const { toast } = useToast()

  const [user, setUser] = useState<User>(state.users[0])
  const [isEditing, setIsEditing] = useState(false)
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prevUser => ({ ...prevUser, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setUser(prevUser => ({ ...prevUser, role: value as UserRole }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePhoto(e.target.files[0])
    }
  }

  const handleSave = () => {
    // In a real application, you would upload the file to a server here
    // and get back a URL to the uploaded image
    if (newProfilePhoto) {
      const imageUrl = URL.createObjectURL(newProfilePhoto)
      setUser(prevUser => ({ ...prevUser, profileUrl: imageUrl }))
    }

    dispatch({ type: 'UPDATE_USER', payload: user })
    setIsEditing(false)
    setNewProfilePhoto(null)
    toast({
      title: t('Profile Updated'),
      description: t('Your profile has been successfully updated.'),
      duration: 3000,
    })
  }

  const handleCancel = () => {
    setUser(state.users[0])
    setIsEditing(false)
    setNewProfilePhoto(null)
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">{t('Profile')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('Personal Information')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={newProfilePhoto ? URL.createObjectURL(newProfilePhoto) : user.profileUrl || '/placeholder.svg'} alt={user.name} />
                  <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t('Change Profile Picture')}
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('Name')}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('Email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('Phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t('Roll')}</Label>
                  <Select
                    value={user.role}
                    onValueChange={handleRoleChange}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder={t('Select a roll')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.OUTLET_MANAGER}>{t('Outlet Manager')}</SelectItem>
                      <SelectItem value={UserRole.STAFF}>{t('Staff')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel}>{t('Cancel')}</Button>
                    <Button onClick={handleSave}>{t('Save Changes')}</Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>{t('Edit Profile')}</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('Account Summary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><span className="font-semibold">{t('Account Type')}:</span> {t(user.role === UserRole.OUTLET_MANAGER ? 'Outlet Manager' : 'Staff')}</p>
              <p><span className="font-semibold">{t('Member Since')}:</span> {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('Recent Activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-semibold">{t('Last login')}:</span> {new Date().toLocaleString()}</li>
                <li><span className="font-semibold">{t('Last order')}:</span> #12345</li>
                <li><span className="font-semibold">{t('Last delivery')}:</span> {new Date().toLocaleDateString()}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('Additional Information')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">{t('Orders')}</TabsTrigger>
                <TabsTrigger value="deliveries">{t('Deliveries')}</TabsTrigger>
                <TabsTrigger value="preferences">{t('Preferences')}</TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-4">
                <p>{t('Your recent orders will be displayed here.')}</p>
              </TabsContent>
              <TabsContent value="deliveries" className="mt-4">
                <p>{t('Your delivery history will be displayed here.')}</p>
              </TabsContent>
              <TabsContent value="preferences" className="mt-4">
                <p>{t('Your account preferences will be displayed here.')}</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

