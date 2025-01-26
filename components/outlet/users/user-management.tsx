'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/app-context'
import { User, UserRole } from '@/types'
import { createUser } from '@/lib/actions'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { UserForm } from './user-form'
import { UserDetailsView } from './user-details-view'
import { Search, Pencil, Trash2, Plus, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from '@/hooks/use-translation'

export function UserManagement() {
  const { state, dispatch } = useApp()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | 'ALL'>('ALL')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewingUser, setViewingUser] = useState<User | null>(null)

  const handleCreateUser = async (userData: Partial<User>) => {
    const formData = new FormData()
    Object.entries(userData).forEach(([key, value]) => {
      if (value) formData.append(key, value)
    })
    
    const createdUser = await createUser(formData)
    if (createdUser) {
      dispatch({ type: 'SET_USERS', payload: [...state.users, createdUser] })
      setIsAddingUser(false)
    }
  }

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    if (editingUser) {
      dispatch({
        type: 'SET_USERS',
        payload: state.users.map(user => 
          user.id === editingUser.id ? { ...user, ...updatedUser } : user
        )
      })
      setEditingUser(null)
    }
  }

  const handleDeleteUser = (id: string) => {
    dispatch({ type: 'SET_USERS', payload: state.users.filter(user => user.id !== id) })
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleDeleteSelected = () => {
    dispatch({ type: 'SET_USERS', payload: state.users.filter(user => !selectedUsers.has(user.id)) })
    setSelectedUsers(new Set())
  }

  const filteredUsers = state.users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const handleSelectUser = (id: string, checked: boolean) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
        <h1 className="text-2xl font-semibold">{t('User Management')}</h1>
        <div className="flex flex-wrap gap-2">
          {selectedUsers.size > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected} className="w-full sm:w-auto">
              {t('Delete Selected')} ({selectedUsers.size})
            </Button>
          )}
          <Button onClick={() => setIsAddingUser(true)} className="bg-red-500 hover:bg-red-600 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {t('Add Users')}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t('Search users...')}
                className="pl-9 pr-4 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | 'ALL')}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('All Type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('All Type')}</SelectItem>
                {Object.values(UserRole).map(role => (
                  <SelectItem key={role} value={role}>{t(role)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t('Profile')}</TableHead>
                  <TableHead>{t('Name')}</TableHead>
                  <TableHead>{t('Email')}</TableHead>
                  <TableHead>{t('Role')}</TableHead>
                  <TableHead>{t('Phone')}</TableHead>
                  <TableHead>{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.profileUrl || '/placeholder.svg'} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {t('No users found matching your search criteria.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Add New User')}</DialogTitle>
          </DialogHeader>
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setIsAddingUser(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Edit User')}</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <UserForm
              initialData={editingUser}
              onSubmit={handleUpdateUser}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{t('User Details')}</DialogTitle>
          </DialogHeader>
          {viewingUser && <UserDetailsView user={viewingUser} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

