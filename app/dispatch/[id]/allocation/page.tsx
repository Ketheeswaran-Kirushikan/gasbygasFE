"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/distpach/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/distpach/ui/dialog"
import { useToast } from "@/components/distpach/ui/use-toast"
import { Loader2, Search, Send, Trash2, Plus, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/distpach/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Allocation {
  id: string
  outlet: string
  driverId: string
  driverName: string
  currentStock: number
  status: "pending" | "sent" | "accepted" | "rejected"
  type: "request" | "allocation"
  quantity?: number
}

const initialAllocations: Allocation[] = [
  {
    id: "1",
    outlet: "Outlet 1",
    driverId: "D001",
    driverName: "John Smith",
    currentStock: 10,
    status: "pending",
    type: "request",
  },
  {
    id: "2",
    outlet: "Outlet 2",
    driverId: "D002",
    driverName: "Sarah Johnson",
    currentStock: 5,
    status: "pending",
    type: "request",
  },
  {
    id: "3",
    outlet: "Outlet 3",
    driverId: "D003",
    driverName: "Mike Wilson",
    currentStock: 15,
    status: "sent",
    type: "request",
  },
  {
    id: "4",
    outlet: "Outlet 4",
    driverId: "D004",
    driverName: "Emily Brown",
    currentStock: 8,
    status: "pending",
    type: "request",
  },
  {
    id: "5",
    outlet: "Outlet 5",
    driverId: "D005",
    driverName: "Chris Lee",
    currentStock: 12,
    status: "accepted",
    type: "request",
  },
]

const outlets = ["Outlet 1", "Outlet 2", "Outlet 3", "Outlet 4", "Outlet 5"]

const drivers = [
  { id: "D001", name: "John Smith", availability: "available" },
  { id: "D002", name: "Sarah Johnson", availability: "on delivery" },
  { id: "D003", name: "Mike Wilson", availability: "available" },
  { id: "D004", name: "Emily Brown", availability: "off duty" },
  { id: "D005", name: "Chris Lee", availability: "available" },
]

interface NewAllocation {
  outlet: string
  driverId: string
  driverName: string
  oldStock: number
  type: "request" | "allocation"
  status: "pending" | "sent" | "accepted" | "rejected"
  quantity?: number
}

const fetchOldStock = async (outlet: string): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const stockData = {
    "Outlet 1": 100,
    "Outlet 2": 150,
    "Outlet 3": 200,
    "Outlet 4": 75,
    "Outlet 5": 125,
  }
  return stockData[outlet] || 0
}

export default function AllocationPage() {
  const [allocations, setAllocations] = useState<Allocation[]>(initialAllocations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAllocations, setSelectedAllocations] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({})
  const [newAllocation, setNewAllocation] = useState<NewAllocation>({
    outlet: "",
    driverId: "",
    driverName: "",
    oldStock: 0,
    type: "request",
    status: "pending",
    quantity: 0,
  })
  const [isLoadingOldStock, setIsLoadingOldStock] = useState(false)
  const [filters, setFilters] = useState({ status: "all", gasWeight: "all" })
  const [isNewDeliveryDialogOpen, setIsNewDeliveryDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredAllocations = allocations.filter(
    (allocation) =>
      allocation.outlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.driverId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (filters.status !== "all" && allocation.status === filters.status),
  )

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      setSelectedAllocations(new Set(filteredAllocations.map((a) => a.id)))
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
    setIsLoading((prev) => ({ ...prev, [id]: true }))
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setAllocations(
      allocations.map((allocation) => (allocation.id === id ? { ...allocation, status: "sent" } : allocation)),
    )
    setIsLoading((prev) => ({ ...prev, [id]: false }))
    toast({
      title: "Suggestion Sent",
      description: `Allocation suggestion has been sent to ${allocations.find((a) => a.id === id)?.outlet}`,
    })
  }

  const handleSendAllSuggestions = async () => {
    const selectedIds = Array.from(selectedAllocations)
    for (const id of selectedIds) {
      setIsLoading((prev) => ({ ...prev, [id]: true }))
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setAllocations(
      allocations.map((allocation) =>
        selectedIds.includes(allocation.id) ? { ...allocation, status: "sent" } : allocation,
      ),
    )
    for (const id of selectedIds) {
      setIsLoading((prev) => ({ ...prev, [id]: false }))
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
      quantity: newAllocation.quantity,
    }
    setAllocations([...allocations, allocation])
    setNewAllocation({
      outlet: "",
      driverId: "",
      driverName: "",
      oldStock: 0,
      type: "request",
      status: "pending",
      quantity: 0,
    })
    toast({
      title: newAllocation.type === "request" ? "Request Submitted" : "Allocation Added",
      description:
        newAllocation.type === "request"
          ? "New request has been successfully submitted"
          : "New allocation has been successfully created",
    })
  }

  const handleDeleteSelected = () => {
    setAllocations(allocations.filter((allocation) => !selectedAllocations.has(allocation.id)))
    setSelectedAllocations(new Set())
    toast({
      title: "Allocations Deleted",
      description: `${selectedAllocations.size} allocation(s) have been deleted.`,
      variant: "destructive",
    })
  }

  const handleOutletChange = async (value: string) => {
    setNewAllocation((prev) => ({ ...prev, outlet: value }))
    setIsLoadingOldStock(true)
    try {
      const oldStock = await fetchOldStock(value)
      setNewAllocation((prev) => ({ ...prev, oldStock }))
    } catch (error) {
      console.error("Error fetching old stock:", error)
      toast({
        title: "Error",
        description: "Failed to fetch old stock. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingOldStock(false)
    }
  }

  const handleDownload = (ids: string[]) => {
    // Implement download logic here
    console.log("Downloading allocations with IDs:", ids)
  }

  const handleDelete = (ids: string[]) => {
    // Implement delete logic here
    console.log("Deleting allocations with IDs:", ids)
  }

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between">
          <CardTitle>Stock Allocation</CardTitle>
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search allocations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px] text-sm"
                />
              </div>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="w-[120px] text-xs sm:text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.gasWeight} onValueChange={(value) => setFilters({ ...filters, gasWeight: value })}>
                <SelectTrigger className="w-[120px] text-xs sm:text-sm">
                  <SelectValue placeholder="All Weights" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Weights</SelectItem>
                  <SelectItem value="5kg">5kg</SelectItem>
                  <SelectItem value="12.5kg">12.5kg</SelectItem>
                  <SelectItem value="45kg">45kg</SelectItem>
                </SelectContent>
              </Select>
              {selectedAllocations.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(Array.from(selectedAllocations))}
                    className="text-xs sm:text-sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(Array.from(selectedAllocations))}
                    className="text-xs sm:text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Dialog open={isNewDeliveryDialogOpen} onOpenChange={setIsNewDeliveryDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs sm:text-sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Allocation</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAllocation} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="outlet">Outlet</Label>
                      <Select value={newAllocation.outlet} onValueChange={handleOutletChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an outlet" />
                        </SelectTrigger>
                        <SelectContent>
                          {outlets.map((outlet) => (
                            <SelectItem key={outlet} value={outlet}>
                              {outlet}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driverId">Driver ID</Label>
                      <Select
                        value={newAllocation.driverId}
                        onValueChange={(value) => {
                          const selectedDriver = drivers.find((d) => d.id === value)
                          setNewAllocation((prev) => ({
                            ...prev,
                            driverId: value,
                            driverName: selectedDriver ? selectedDriver.name : "",
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.id} - {driver.availability}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driverName">Driver Name</Label>
                      <Input id="driverName" value={newAllocation.driverName} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oldStock">Old Stock</Label>
                      <Input id="oldStock" type="number" value={newAllocation.oldStock} disabled className="bg-muted" />
                      {isLoadingOldStock && <p className="text-sm text-muted-foreground">Loading old stock...</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newAllocation.type}
                        onValueChange={(value) =>
                          setNewAllocation((prev) => ({
                            ...prev,
                            type: value as "request" | "allocation",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="request">Request</SelectItem>
                          <SelectItem value="allocation">Allocation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newAllocation.status}
                        onValueChange={(value) =>
                          setNewAllocation((prev) => ({
                            ...prev,
                            status: value as "pending" | "sent" | "accepted" | "rejected",
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newAllocation.type === "allocation" && (
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity (KG)</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newAllocation.quantity || ""}
                          onChange={(e) =>
                            setNewAllocation((prev) => ({
                              ...prev,
                              quantity: Number.parseInt(e.target.value),
                            }))
                          }
                          required
                        />
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button type="submit">
                        {newAllocation.type === "request" ? "Submit Request" : "Add Allocation"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedAllocations.size === filteredAllocations.length}
                      onCheckedChange={handleSelectAllChange}
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
                      <Checkbox
                        checked={selectedAllocations.has(allocation.id)}
                        onCheckedChange={(checked) => handleSelectChange(allocation.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-500">{allocation.outlet}</span>
                    </TableCell>
                    <TableCell>{allocation.driverId}</TableCell>
                    <TableCell>{allocation.driverName}</TableCell>
                    <TableCell>{allocation.currentStock}</TableCell>
                    <TableCell>{allocation.type}</TableCell>
                    <TableCell>{allocation.quantity || "N/A"}</TableCell>
                    <TableCell>
                      <span
                        className={
                          allocation.status === "accepted"
                            ? "text-green-500"
                            : allocation.status === "rejected"
                              ? "text-red-500"
                              : allocation.status === "sent"
                                ? "text-blue-500"
                                : "text-gray-500"
                        }
                      >
                        {allocation.status.charAt(0).toUpperCase() + allocation.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="secondary"
                        onClick={() => handleSendSuggestion(allocation.id)}
                        disabled={isLoading[allocation.id] || allocation.status !== "pending"}
                      >
                        {isLoading[allocation.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        <span className="ml-2">{allocation.status === "pending" ? "Send" : "Sent"}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  )
}
;<style jsx>{`
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
  @media (max-width: 640px) {
    .overflow-x-auto {
      margin-left: -1rem;
      margin-right: -1rem;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`}</style>

