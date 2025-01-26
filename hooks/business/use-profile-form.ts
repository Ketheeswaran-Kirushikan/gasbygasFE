import { useState } from 'react'
import { toast } from 'sonner'
import { dbService } from '@/lib/db-service'
import { User } from '@/lib/types'

interface ProfileFormState {
  companyName: string
  email: string
  contactNumber: string
  profileImage: string
  businessRegistrationNumber: string
  businessCategory: string
}

export function useProfileForm(initialData: Partial<User>) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormState>({
    companyName: initialData.companyName || '',
    email: initialData.email || '',
    contactNumber: initialData.contactNumber || '',
    profileImage: initialData.profileImage || '',
    businessRegistrationNumber: initialData.businessRegistrationNumber || '',
    businessCategory: initialData.businessCategory || '',
  })

  const validateForm = () => {
    if (!formData.companyName) {
      toast.error('Company name is required')
      return false
    }
    if (!formData.email) {
      toast.error('Email is required')
      return false
    }
    if (!formData.contactNumber) {
      toast.error('Contact number is required')
      return false
    }
    if (!formData.businessRegistrationNumber) {
      toast.error('Business registration number is required')
      return false
    }
    if (!formData.businessCategory) {
      toast.error('Business category is required')
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

