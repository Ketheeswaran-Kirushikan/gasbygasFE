'use client'

import { useState } from 'react'
import { StockRequest, StockType, RequestStatus } from '@/types/stock'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface StockRequestFormProps {
  onSubmit: (request: StockRequest) => void
  initialData?: StockRequest
  nextItemId?: string
  isEditing?: boolean
}

export function StockRequestForm({
  onSubmit,
  initialData,
  nextItemId,
  isEditing = false
}: StockRequestFormProps) {
  const [formData, setFormData] = useState<Partial<StockRequest>>(
    initialData || {
      itemId: nextItemId || '',
      type: StockType.DOMESTIC,
      quantityKG: 0,
      quantity: 0,
      status: RequestStatus.PENDING,
      requestDate: new Date().toISOString(),
      requestedBy: 'Current User' // In a real app, this would come from auth context
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      ...formData
    } as StockRequest)
  }

  const quantityOptions = [
    { kg: 5, label: '5 KG' },
    { kg: 12.5, label: '12.5 KG' },
    { kg: 37.5, label: '37.5 KG' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Item ID</label>
        <Input
          value={formData.itemId}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Gas Type</label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as StockType })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select gas type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={StockType.DOMESTIC}>{StockType.DOMESTIC}</SelectItem>
            <SelectItem value={StockType.INDUSTRIAL}>{StockType.INDUSTRIAL}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Quantity (KG)</label>
        <Select
          value={formData.quantityKG?.toString()}
          onValueChange={(value) => setFormData({ ...formData, quantityKG: parseFloat(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select quantity in KG" />
          </SelectTrigger>
          <SelectContent>
            {quantityOptions.map(option => (
              <SelectItem key={option.kg} value={option.kg.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Number of Units</label>
        <Input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          min="1"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value as RequestStatus })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(RequestStatus).map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? 'Update Request' : 'Submit Request'}
      </Button>
    </form>
  )
}

