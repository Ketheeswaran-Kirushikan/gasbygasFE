import { useState } from 'react'
import { toast } from 'sonner'
import { dbService } from '@/lib/db-service'
import { User } from '@/lib/types'

interface ProfileFormState {
  firstName: string
  lastName: string
  nic: string
  email: string
  contactNumber: string
  profileImage: string
}

export function useProfileForm(initialData: Partial<User>) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormState>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    nic: initialData.nic || '',
    email: initialData.email || '',
    contactNumber: initialData.contactNumber || '',
    profileImage: initialData.profileImage || '',
  })

  const validateForm = () => {
    if (!formData.firstName) {
      toast.error('First name is required')
      return false
    }
    if (!formData.lastName) {
      toast.error('Last name is required')
      return false
    }
    if (!formData.nic) {
      toast.error('NIC is required')
      return false
    }
    if (!formData.email) {
      toast.error('Email is required')
      return false
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Invalid email format')
      return false
    }
    if (!formData.contactNumber) {
      toast.error('Contact number is required')
      return false
    }
    if (!/^\+?[0-9]{10,12}$/.test(formData.contactNumber)) {
      toast.error('Invalid phone number format')
      return false
    }
    return true
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }))
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Error uploading image')
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    const userId = localStorage.getItem('currentUserId')
    if (!userId) {
      toast.error('User not found')
      setIsLoading(false)
      return
    }

    const result = dbService.updateUser(userId, formData)
    if (result.success) {
      toast.success('Profile updated successfully')
    } else {
      toast.error(result.message)
    }
    setIsLoading(false)
  }

  return {
    formData,
    setFormData,
    isLoading,
    handleImageUpload,
    handleSubmit,
  }
}

