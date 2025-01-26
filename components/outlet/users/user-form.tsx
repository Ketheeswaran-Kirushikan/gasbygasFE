'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, UserRole, BusinessCategory } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/hooks/use-translation'

const phoneRegex = /^[0-9]{10}$/
const nicRegex = /^[0-9]{9}[vVxX]|[0-9]{12}$/

const baseSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Phone number must be 10 digits'),
  role: z.enum([UserRole.CONSUMER, UserRole.BUSINESS, UserRole.STAFF, UserRole.OUTLET_MANAGER]),
})

const consumerSchema = baseSchema.extend({
  role: z.literal(UserRole.CONSUMER),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  nic: z.string().regex(nicRegex, 'Invalid NIC format'),
})

const businessSchema = baseSchema.extend({
  role: z.literal(UserRole.BUSINESS),
  businessName: z.string().min(2, 'Business name is required'),
  registrationNumber: z.string().min(2, 'Registration number is required'),
  businessCategory: z.nativeEnum(BusinessCategory),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  certificationFile: z.instanceof(File).optional(),
})

const staffSchema = baseSchema.extend({
  role: z.enum([UserRole.STAFF, UserRole.OUTLET_MANAGER]),
  name: z.string().min(2, 'Name is required'),
})

const schema = z.discriminatedUnion('role', [consumerSchema, businessSchema, staffSchema])

interface UserFormProps {
  onSubmit: (user: Partial<User>) => void
  onCancel: () => void
  initialData?: User
}

export function UserForm({ onSubmit, onCancel, initialData }: UserFormProps) {
  const { t } = useTranslation()
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    initialData?.role || UserRole.STAFF
  )

  const { register, handleSubmit, formState: { errors }, control, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      role: UserRole.STAFF,
    }
  })

  const watchRole = watch('role')

  const handleFormSubmit = async (data: any) => {
    // In a real app, handle file upload here
    if (data.certificationFile) {
      // Simulate file upload
      data.certificationUrl = 'https://example.com/certification.pdf'
      delete data.certificationFile
    }
    
    onSubmit(data)
  }

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case UserRole.CONSUMER:
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...register('firstName')} />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...register('lastName')} />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message as string}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>NIC</Label>
              <Input {...register('nic')} />
              {errors.nic && (
                <p className="text-red-500 text-sm">{errors.nic.message as string}</p>
              )}
            </div>
          </>
        )

      case UserRole.BUSINESS:
        return (
          <>
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input {...register('businessName')} />
              {errors.businessName && (
                <p className="text-red-500 text-sm">{errors.businessName.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Business Registration Number</Label>
              <Input {...register('registrationNumber')} />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">{errors.registrationNumber.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Business Category</Label>
              <Controller
                name="businessCategory"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BusinessCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Person Name</Label>
              <Input {...register('contactPersonName')} />
              {errors.contactPersonName && (
                <p className="text-red-500 text-sm">{errors.contactPersonName.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Certification Upload</Label>
              <Input type="file" {...register('certificationFile')} />
            </div>
          </>
        )

      default:
        return (
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...register('name')} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message as string}</p>
            )}
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setSelectedRole(value as UserRole)
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {renderRoleSpecificFields()}

        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input type="email" {...register('email')} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input {...register('phone')} placeholder="0123456789" />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('Cancel')}
        </Button>
        <Button type="submit">
          {initialData ? t('Update User') : t('Add User')}
        </Button>
      </div>
    </form>
  )
}

