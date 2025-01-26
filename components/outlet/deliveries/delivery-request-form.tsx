'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Request, CustomerType, GasType, GasWeight, RequestStatus } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslation } from '@/hooks/use-translation'

const baseSchema = z.object({
  customerType: z.nativeEnum(CustomerType),
  status: z.nativeEnum(RequestStatus),
})

const consumerSchema = baseSchema.extend({
  customerType: z.literal(CustomerType.CONSUMER),
  gasType: z.enum([GasType.DOMESTIC, GasType.COMMERCIAL]),
  gasWeight: z.nativeEnum(GasWeight),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
})

const businessSchema = baseSchema.extend({
  customerType: z.literal(CustomerType.BUSINESS),
  gasType: z.literal(GasType.INDUSTRIAL),
  gasWeight: z.nativeEnum(GasWeight),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  poDocumentUrl: z.string().optional(),
})

const schema = z.discriminatedUnion('customerType', [consumerSchema, businessSchema])

interface DeliveryRequestFormProps {
  onSubmit: (request: Partial<Request>) => void
  onCancel: () => void
  initialData?: Request
}

export function DeliveryRequestForm({ onSubmit, onCancel, initialData }: DeliveryRequestFormProps) {
  const { t } = useTranslation()
  const [customerType, setCustomerType] = useState<CustomerType>(
    initialData?.customerType || CustomerType.CONSUMER
  )

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      customerType: CustomerType.CONSUMER,
      status: RequestStatus.PENDING,
      gasType: GasType.DOMESTIC,
      gasWeight: GasWeight.FIVE_KG,
      quantity: 1,
    }
  })

  const watchCustomerType = watch('customerType')
  const watchGasType = watch('gasType')

  const handleFormSubmit = (data: z.infer<typeof schema>) => {
    onSubmit({
      ...data,
      tokenId: initialData?.tokenId || `TKN${Date.now()}`,
      userId: initialData?.userId || 'current-user-id',
      outletId: initialData?.outletId || 'current-outlet-id',
      createdAt: initialData?.createdAt || new Date().toISOString(),
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server and get a URL back
      // For this example, we'll just use a placeholder URL
      setValue('poDocumentUrl', URL.createObjectURL(file))
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Customer Type</Label>
          <Controller
            name="customerType"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  setCustomerType(value as CustomerType)
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CustomerType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.customerType && (
            <p className="text-red-500 text-sm">{errors.customerType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gas Type</Label>
          <Controller
            name="gasType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gas type" />
                </SelectTrigger>
                <SelectContent>
                  {watchCustomerType === CustomerType.CONSUMER
                    ? [GasType.DOMESTIC, GasType.COMMERCIAL].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))
                    : [GasType.INDUSTRIAL].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.gasType && (
            <p className="text-red-500 text-sm">{errors.gasType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gas Weight</Label>
          <Controller
            name="gasWeight"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gas weight" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GasWeight).map((weight) => (
                    <SelectItem key={weight} value={weight}>
                      {weight}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.gasWeight && (
            <p className="text-red-500 text-sm">{errors.gasWeight.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Quantity Needed</Label>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
            )}
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
        </div>

        {watchCustomerType === CustomerType.BUSINESS && (
          <div className="space-y-2">
            <Label>Upload PO/Document (Optional)</Label>
            <Input type="file" onChange={handleFileChange} />
          </div>
        )}

        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RequestStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('Cancel')}
        </Button>
        <Button type="submit">
          {initialData ? t('Update Request') : t('Create Request')}
        </Button>
      </div>
    </form>
  )
}

