"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/distpach/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/distpach/ui/dialog"
import { useToast } from "@/components/distpach/ui/use-toast"
import { Loader2, Search, Send } from 'lucide-react'

interface Allocation {
  id: string
  outlet: string
  driverId: string
  driverName: string
  currentStock: number
  status: 'pending' | 'sent' | 'accepted' | 'rejected'
  type: 'request' | 'allocation'
  quantity?: number
}

const drivers = [
  { id: "D001", name: "John Smith", availability: "available" },
  { id: "D002", name: "Sarah Johnson", availability: "on delivery" },
  { id: "D003", name: "Mike Wilson", availability: "available" },
  { id: "D004", name: "Emily Brown", availability: "off duty" },
  { id: "D005", name: "Chris Lee", availability: "available" },
]

const outlets = [
  "Outlet 1",
  "Outlet 2",
  "Outlet 3",
  "Outlet 4",
  "Outlet 5",
]

interface NewAllocation {
  outlet: string
  driverId: string
  driverName: string
  oldStock: number
  type: 'request' | 'allocation'
  status: 'pending' | 'sent' | 'accepted' | 'rejected'
  quantity?: number
}

const initialAllocations: Allocation[] = [
  { id: "1", outlet: "Outlet 1", driverId: "D001", driverName: "John Smith", currentStock: 10, status: 'pending', type: 'request' },
  { id: "2", outlet: "Outlet 2", driverId: "D002", driverName: "Sarah Johnson", currentStock: 5, status: 'pending', type: 'allocation', quantity: 100 },
  { id: "3", outlet: "Outlet 3", driverId: "D003", driverName: "Mike Wilson", currentStock: 15, status: 'sent', type: 'request' },
  { id: "4", outlet: "Outlet 4", driverId: "D004", driverName: "Emily Brown", currentStock: 8, status: 'pending', type: 'allocation', quantity: 50 },
  { id: "5", outlet: "Outlet 5", driverId: "D005", driverName: "Chris Lee", currentStock: 12, status: 'accepted', type: 'request' },
]


export default function StockAllocationPage() {
  const [allocations, setAllocations] = useState<Allocation[]>(initialAllocations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAllocations, setSelectedAllocations] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [newAllocation, setNewAllocation] = useState<NewAllocation>({
    outlet: "",
    driverId: "",
    driverName: "",
    oldStock: 0,
    type: 'request',
    status: 'pending',
    quantity: 0
  })
  const { toast } = useToast()

  const filteredAllocations = allocations.filter(allocation =>
    allocation.outlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allocation.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAllocations(new Set(filteredAllocations.map(a => a.id)))
    } else {
      setSelectedAllocations(new Set())
    }
  }

  const handleSelectChange = (id: string) => {
    const newSelected = new Set(selectedAllocations)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedAllocations(newSelected)
  }

  const handleSendSuggestion = async (id: string) => {
    setIsLoading(prev => ({ ...prev, [id]: true }))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setAllocations(allocations.map(allocation =>
      allocation.id === id ? { ...allocation, status: 'sent' } : allocation
    ))
    
    setIsLoading(prev => ({ ...prev, [id]: false }))
    
    toast({
      title: "Suggestion Sent",
      description: `Allocation suggestion has been sent to ${allocations.find(a => a.id === id)?.outlet}`,
    })
  }

  const handleSendAllSuggestions = async () => {
    const selectedIds = Array.from(selectedAllocations)
    
    for (const id of selectedIds) {
      setIsLoading(prev => ({ ...prev, [id]: true }))
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setAllocations(allocations.map(allocation =>
      selectedIds.includes(allocation.id) ? { ...allocation, status: 'sent' } : allocation
    ))
    
    for (const id of selectedIds) {
      setIsLoading(prev => ({ ...prev, [id]: false }))
    }
    
    setSelectedAllocations(new Set())
    
    toast({
      title: "Bulk Suggestions Sent",
      description: `Allocation suggestions have been sent to ${selectedIds.length} outlets`,
    })
  }

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newId = (allocations.length + 1).toString()
    const allocation: Allocation = {
      id: newId,
      outlet: newAllocation.outlet,
      driverId: newAllocation.driverId,
      driverName: newAllocation.driverName,
      currentStock: newAllocation.oldStock,
      status: newAllocation.status,
      type: newAllocation.type,
      quantity: newAllocation.quantity
    }
    
    setAllocations([...allocations, allocation])
    
    setNewAllocation({
      outlet: "",
      driverId: "",
      driverName: "",
      oldStock: 0,
      type: 'request',
      status: 'pending',
      quantity: 0
    })
    
    toast({
      title: newAllocation.type === 'request' ? "Request Submitted" : "Allocation Added",
      description: newAllocation.type === 'request' 
        ? "New request has been successfully submitted"
        : "New allocation has been successfully created",
    })
  }

  const handleCancel = () => {
    setSelectedAllocations(new Set())
    toast({
      title: "Selection Cleared",
      description: "All selected allocations have been cleared",
    })
  }

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stock Allocation</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={selectedAllocations.size === 0}
            >
              Cancel
            </Button>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search allocations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <Button 
              variant="outline"
              onClick={() => setSearchTerm("")}
            >
              View All
            </Button>
            <Button
              variant="outline"
              onClick={handleSendAllSuggestions}
              disabled={selectedAllocations.size === 0}
            >
              Send Request
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>New Allocation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Allocation</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAllocation} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="outlet">Outlet</Label>
                    <select
                      id="outlet"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={newAllocation.outlet}
                      onChange={(e) => setNewAllocation(prev => ({
                        ...prev,
                        outlet: e.target.value
                      }))}
                      required
                    >
                      <option value="">Select an outlet</option>
                      {outlets.map(outlet => (
                        <option key={outlet} value={outlet}>{outlet}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverId">Driver ID</Label>
                    <select
                      id="driverId"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={newAllocation.driverId}
                      onChange={(e) => {
                        const selectedDriver = drivers.find(d => d.id === e.target.value)
                        setNewAllocation(prev => ({
                          ...prev,
                          driverId: e.target.value,
                          driverName: selectedDriver ? selectedDriver.name : ""
                        }))
                      }}
                      required
                    >
                      <option value="">Select a driver</option>
                      {drivers.map(driver => (
                        <option key={driver.id} value={driver.id}>
                          {driver.id} - {driver.availability}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driverName">Driver Name</Label>
                    <Input
                      id="driverName"
                      value={newAllocation.driverName}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oldStock">Old Stock</Label>
                    <Input
                      id="oldStock"
                      type="number"
                      value={newAllocation.oldStock}
                      onChange={(e) => setNewAllocation(prev => ({
                        ...prev,
                        oldStock: parseInt(e.target.value)
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <select
                      id="type"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={newAllocation.type}
                      onChange={(e) => setNewAllocation(prev => ({
                        ...prev,
                        type: e.target.value as 'request' | 'allocation'
                      }))}
                      required
                    >
                      <option value="request">Request</option>
                      <option value="allocation">Allocation</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      value={newAllocation.status}
                      onChange={(e) => setNewAllocation(prev => ({
                        ...prev,
                        status: e.target.value as 'pending' | 'sent' | 'accepted' | 'rejected'
                      }))}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  {newAllocation.type === 'allocation' && (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (KG)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newAllocation.quantity || ''}
                        onChange={(e) => setNewAllocation(prev => ({
                          ...prev,
                          quantity: parseInt(e.target.value)
                        }))}
                        required
                      />
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button type="submit">
                      {newAllocation.type === 'request' ? 'Submit Request' : 'Add Allocation'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selectedAllocations.size === filteredAllocations.length}
                    onChange={handleSelectAllChange}
                  />
                </TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Driver ID</TableHead>
                <TableHead>Driver Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity (KG)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllocations.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedAllocations.has(allocation.id)}
                      onChange={() => handleSelectChange(allocation.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-500">{allocation.outlet}</span>
                  </TableCell>
                  <TableCell>{allocation.driverId}</TableCell>
                  <TableCell>{allocation.driverName}</TableCell>
                  <TableCell>{allocation.currentStock}</TableCell>
                  <TableCell>{allocation.type}</TableCell>
                  <TableCell>{allocation.quantity || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={
                      allocation.status === 'accepted' ? 'text-green-500' :
                      allocation.status === 'rejected' ? 'text-red-500' :
                      allocation.status === 'sent' ? 'text-blue-500' :
                      'text-gray-500'
                    }>
                      {allocation.status.charAt(0).toUpperCase() + allocation.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      onClick={() => handleSendSuggestion(allocation.id)}
                      disabled={isLoading[allocation.id] || allocation.status !== 'pending'}
                    >
                      {isLoading[allocation.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span className="ml-2">
                        {allocation.status === 'pending' ? 'Send' : 'Sent'}
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  )
}

