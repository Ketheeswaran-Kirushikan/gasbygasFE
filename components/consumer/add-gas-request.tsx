"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { GasRequest } from '@/lib/mock-data'
import { dbService } from '@/lib/db-service';

interface AddGasRequestProps {
  onAddRequest: (request: GasRequest) => void;
}

export function AddGasRequest({ onAddRequest }: AddGasRequestProps) {
  const [type, setType] = useState<'Domestic' | 'Industrial'>('Domestic')
  const [quantity, setQuantity] = useState(1)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [outletLocation, setOutletLocation] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRequest: GasRequest = {
      id: Math.random().toString(36).substr(2, 9),
      tokenId: `ABC${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      type,
      quantity,
      deliveryDate: date ? date.toISOString().split('T')[0] : '',
      createdAt: new Date().toISOString(),
      outletLocation,
      message,
    }
    dbService.addRequest(newRequest);
    onAddRequest(newRequest)
    // Reset form
    setType('Domestic')
    setQuantity(1)
    setDate(new Date())
    setOutletLocation('')
    setMessage('')
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Add New Gas Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Gas Type</label>
          <Select value={type} onValueChange={(value: 'Domestic' | 'Industrial') => setType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gas type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Domestic">Domestic</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity (KG)</label>
          <Input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={1}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preferred Delivery Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Outlet Location</label>
          <Input 
            value={outletLocation} 
            onChange={(e) => setOutletLocation(e.target.value)}
            placeholder="Enter outlet location"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Message (Optional)</label>
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter any additional instructions"
          />
        </div>

        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          Submit Request
        </Button>
      </form>
    </Card>
  )
}

