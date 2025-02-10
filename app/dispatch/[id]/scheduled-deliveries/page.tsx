"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/distpach/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/distpach/ui/select"
import { useToast } from "@/components/distpach/ui/use-toast"
import {
  MapPin,
  Truck,
  User,
  CalendarIcon,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CalendarDays,
  List,
  Filter,
} from "lucide-react"
import { Checkbox } from "@/components/distpach/ui/checkbox"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/distpach/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/distpach/ui/popover"
import { Calendar } from "@/components/distpach/ui/calendar"
import { cn } from "@/lib/distpach/utils"

interface Driver {
  id: string
  name: string
  status: "available" | "on_delivery" | "off_duty"
  truckNumber: string
}

interface ScheduledDelivery {
  id: string
  station: string
  scheduledTime: string
  estimatedArrival: string
  status: "pending" | "in_progress" | "completed" | "delayed"
  driverId: string
  truckNumber: string
  gasWeight: "5kg" | "12.5kg" | "45kg"
  quantity: number
}

const initialDrivers: Driver[] = [
  { id: "D001", name: "John Smith", status: "available", truckNumber: "T001" },
  { id: "D002", name: "Jane Doe", status: "on_delivery", truckNumber: "T002" },
  { id: "D003", name: "Mike Johnson", status: "off_duty", truckNumber: "T003" },
]

const stations = [
  "Downtown Station",
  "Westside Gas",
  "North End Fuel",
  "East Side Petrol",
  "Central Gas Hub",
  "Southside Fuel Center",
]

// Simulated JSON file operations
const saveToJSON = (data: ScheduledDelivery[]) => {
  localStorage.setItem("scheduledDeliveries", JSON.stringify(data))
}

const loadFromJSON = (): ScheduledDelivery[] => {
  const data = localStorage.getItem("scheduledDeliveries")
  return data ? JSON.parse(data) : []
}

export default function ScheduledDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<ScheduledDelivery[]>([])
  const [drivers] = useState<Driver[]>(initialDrivers)
  const [selectedDelivery, setSelectedDelivery] = useState<ScheduledDelivery | null>(null)
  const [isNewDeliveryDialogOpen, setIsNewDeliveryDialogOpen] = useState(false)
  const [newDelivery, setNewDelivery] = useState<Partial<ScheduledDelivery>>({
    status: "pending",
    gasWeight: "12.5kg",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDeliveries, setSelectedDeliveries] = useState<Set<string>>(new Set())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")
  const [filters, setFilters] = useState({
    status: "all",
    gasWeight: "all",
    truckNumber: "all",
  })
  const [selectedView, setSelectedView] = useState<"day" | "week" | "month" | "year">("month")
  const { toast } = useToast()

  useEffect(() => {
    const loadedDeliveries = loadFromJSON()
    setDeliveries(loadedDeliveries)
  }, [])

  useEffect(() => {
    saveToJSON(deliveries)
  }, [deliveries])

  // Simulating real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDeliveries((prevDeliveries) =>
        prevDeliveries.map((delivery) => {
          if (delivery.status === "in_progress") {
            const randomDelay = Math.random() > 0.7 ? 15 : 0
            const newEstimatedArrival = new Date(new Date(delivery.estimatedArrival).getTime() + randomDelay * 60000)
            return {
              ...delivery,
              estimatedArrival: newEstimatedArrival.toLocaleString(),
              status: randomDelay > 0 ? "delayed" : "in_progress",
            }
          }
          return delivery
        }),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const filteredDeliveries = deliveries.filter((delivery) => {
    const deliveryDate = new Date(delivery.scheduledTime)
    const dateMatch = selectedDate ? deliveryDate.toDateString() === selectedDate.toDateString() : true

    const statusMatch = filters.status === "all" || delivery.status === filters.status
    const gasWeightMatch = filters.gasWeight === "all" || delivery.gasWeight === filters.gasWeight
    const truckMatch = filters.truckNumber === "all" || delivery.truckNumber === filters.truckNumber

    return (
      dateMatch &&
      statusMatch &&
      gasWeightMatch &&
      truckMatch &&
      (delivery.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.id.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const deliveriesByDate = deliveries.reduce(
    (acc, delivery) => {
      const date = new Date(delivery.scheduledTime).toDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(delivery)
      return acc
    },
    {} as Record<string, ScheduledDelivery[]>,
  )

  const handleAddNewDelivery = () => {
    const id = `SD${Math.floor(1000 + Math.random() * 9000)}`
    const newScheduledDelivery: ScheduledDelivery = {
      ...(newDelivery as ScheduledDelivery),
      id,
      estimatedArrival: new Date(new Date(newDelivery.scheduledTime!).getTime() + 30 * 60000).toLocaleString(), // Estimated 30 minutes after scheduled time
    }
    setDeliveries([...deliveries, newScheduledDelivery])
    setIsNewDeliveryDialogOpen(false)
    setNewDelivery({
      status: "pending",
      gasWeight: "12.5kg",
    })
    toast({
      title: "New Delivery Scheduled",
      description: `Delivery ${id} has been scheduled successfully.`,
    })
  }

  const handleStatusChange = (id: string, newStatus: ScheduledDelivery["status"]) => {
    setDeliveries(deliveries.map((delivery) => (delivery.id === id ? { ...delivery, status: newStatus } : delivery)))
    toast({
      title: "Status Updated",
      description: `Delivery ${id} status has been updated to ${newStatus}.`,
    })
  }

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter((delivery) => delivery.id !== id))
    toast({
      title: "Delivery Deleted",
      description: `Delivery ${id} has been deleted.`,
      variant: "destructive",
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDeliveries(new Set(filteredDeliveries.map((d) => d.id)))
    } else {
      setSelectedDeliveries(new Set())
    }
  }

  const handleSelectDelivery = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedDeliveries)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedDeliveries(newSelected)
  }

  const handleDelete = (ids: string[]) => {
    setDeliveries(deliveries.filter((delivery) => !ids.includes(delivery.id)))
    setSelectedDeliveries(new Set())
    toast({
      title: "Deliveries Deleted",
      description: `${ids.length} delivery(ies) have been deleted.`,
      variant: "destructive",
    })
  }

  const handleDownload = (ids: string[]) => {
    const selectedData = deliveries.filter((d) => ids.includes(d.id))
    const csv = [
      [
        "ID",
        "Station",
        "Scheduled Time",
        "Estimated Arrival",
        "Status",
        "Driver ID",
        "Truck Number",
        "Gas Weight",
        "Quantity",
      ],
      ...selectedData.map((d) => [
        d.id,
        d.station,
        d.scheduledTime,
        d.estimatedArrival,
        d.status,
        d.driverId,
        d.truckNumber,
        d.gasWeight,
        d.quantity.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "scheduled_deliveries.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    toast({
      title: "Download Started",
      description: `${ids.length} delivery(ies) data has been downloaded.`,
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center justify-between">
            <CardTitle>Scheduled Deliveries</CardTitle>
            <div className="w-full sm:w-auto overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-max">
                <div className="relative">
                  <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] text-sm"
                  />
                </div>
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="text-xs sm:text-sm"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "calendar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className="text-xs sm:text-sm"
                  >
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Status</h4>
                        <Select
                          value={filters.status}
                          onValueChange={(value) => setFilters({ ...filters, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="delayed">Delayed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Gas Weight</h4>
                        <Select
                          value={filters.gasWeight}
                          onValueChange={(value) => setFilters({ ...filters, gasWeight: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by gas weight" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Weights</SelectItem>
                            <SelectItem value="5kg">5kg</SelectItem>
                            <SelectItem value="12.5kg">12.5kg</SelectItem>
                            <SelectItem value="45kg">45kg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Truck Number</h4>
                        <Select
                          value={filters.truckNumber}
                          onValueChange={(value) => setFilters({ ...filters, truckNumber: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Filter by truck number" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Trucks</SelectItem>
                            {Array.from(new Set(deliveries.map((d) => d.truckNumber))).map((truck) => (
                              <SelectItem key={truck} value={truck}>
                                {truck}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                {selectedDeliveries.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(Array.from(selectedDeliveries))}
                      className="text-xs sm:text-sm"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(Array.from(selectedDeliveries))}
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
                      <DialogTitle>Schedule New Delivery</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Station</Label>
                        <Select
                          value={newDelivery.station || ""}
                          onValueChange={(value) => setNewDelivery({ ...newDelivery, station: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a station" />
                          </SelectTrigger>
                          <SelectContent>
                            {stations.map((station) => (
                              <SelectItem key={station} value={station}>
                                {station}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Scheduled Time</Label>
                        <Input
                          type="datetime-local"
                          value={newDelivery.scheduledTime || ""}
                          onChange={(e) => setNewDelivery({ ...newDelivery, scheduledTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Driver</Label>
                        <Select onValueChange={(value) => setNewDelivery({ ...newDelivery, driverId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name} ({driver.status})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Truck Number</Label>
                        <Input value={drivers.find((d) => d.id === newDelivery.driverId)?.truckNumber || ""} disabled />
                      </div>
                      <div>
                        <Label>Gas Weight</Label>
                        <Select
                          onValueChange={(value) =>
                            setNewDelivery({ ...newDelivery, gasWeight: value as "5kg" | "12.5kg" | "45kg" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gas weight" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5kg">5kg</SelectItem>
                            <SelectItem value="12.5kg">12.5kg</SelectItem>
                            <SelectItem value="45kg">45kg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={newDelivery.quantity || ""}
                          onChange={(e) =>
                            setNewDelivery({ ...newDelivery, quantity: Number.parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <Button onClick={handleAddNewDelivery}>Schedule Delivery</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "calendar" ? (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedView === "day" ? "default" : "ghost"}
                      onClick={() => setSelectedView("day")}
                    >
                      Day
                    </Button>
                    <Button
                      variant={selectedView === "week" ? "default" : "ghost"}
                      onClick={() => setSelectedView("week")}
                    >
                      Week
                    </Button>
                    <Button
                      variant={selectedView === "month" ? "default" : "ghost"}
                      onClick={() => setSelectedView("month")}
                    >
                      Month
                    </Button>
                    <Button
                      variant={selectedView === "year" ? "default" : "ghost"}
                      onClick={() => setSelectedView("year")}
                    >
                      Year
                    </Button>
                  </div>
                </div>
                <div className="border rounded-lg bg-background">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasDelivery: (date) => {
                        return !!deliveriesByDate[date.toDateString()]
                      },
                    }}
                    styles={{
                      hasDelivery: {
                        fontWeight: "bold",
                        backgroundColor: "hsl(var(--primary))",
                        color: "white",
                      },
                    }}
                  />
                  <div className="p-4 space-y-2">
                    {filteredDeliveries.map((delivery) => (
                      <div key={delivery.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            delivery.status === "pending"
                              ? "bg-yellow-500"
                              : delivery.status === "in_progress"
                                ? "bg-blue-500"
                                : delivery.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-red-500",
                          )}
                        />
                        <time className="text-sm text-muted-foreground">
                          {new Date(delivery.scheduledTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                        <span className="font-medium">{delivery.station}</span>
                        <span className="text-sm text-muted-foreground">
                          {delivery.gasWeight} - {delivery.quantity} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedDeliveries.size === filteredDeliveries.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Station</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>Truck</TableHead>
                    <TableHead>Gas Weight</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDeliveries.has(delivery.id)}
                          onCheckedChange={(checked) => handleSelectDelivery(delivery.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>{delivery.station}</TableCell>
                      <TableCell>{delivery.scheduledTime}</TableCell>
                      <TableCell>{delivery.estimatedArrival}</TableCell>
                      <TableCell>{delivery.truckNumber}</TableCell>
                      <TableCell>{delivery.gasWeight}</TableCell>
                      <TableCell>{delivery.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(delivery.id, "pending")}
                            className={delivery.status === "pending" ? "text-yellow-500" : ""}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(delivery.id, "in_progress")}
                            className={delivery.status === "in_progress" ? "text-blue-500" : ""}
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(delivery.id, "completed")}
                            className={delivery.status === "completed" ? "text-green-500" : ""}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(delivery.id, "delayed")}
                            className={delivery.status === "delayed" ? "text-red-500" : ""}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedDelivery(delivery)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteDelivery(delivery.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Delivery Dialog */}
      <Dialog open={!!selectedDelivery} onOpenChange={() => setSelectedDelivery(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scheduled Delivery</DialogTitle>
          </DialogHeader>
          {selectedDelivery && (
            <div className="space-y-4">
              <div>
                <Label>Station</Label>
                <Select
                  value={selectedDelivery.station}
                  onValueChange={(value) => setSelectedDelivery({ ...selectedDelivery, station: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station} value={station}>
                        {station}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Scheduled Time</Label>
                <Input
                  type="datetime-local"
                  value={selectedDelivery.scheduledTime}
                  onChange={(e) => setSelectedDelivery({ ...selectedDelivery, scheduledTime: e.target.value })}
                />
              </div>
              <div>
                <Label>Driver</Label>
                <Select
                  value={selectedDelivery.driverId}
                  onValueChange={(value) => setSelectedDelivery({ ...selectedDelivery, driverId: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} ({driver.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Truck Number</Label>
                <Input
                  value={selectedDelivery.truckNumber}
                  onChange={(e) => setSelectedDelivery({ ...selectedDelivery, truckNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>Gas Weight</Label>
                <Select
                  value={selectedDelivery.gasWeight}
                  onValueChange={(value) =>
                    setSelectedDelivery({ ...selectedDelivery, gasWeight: value as "5kg" | "12.5kg" | "45kg" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5kg">5kg</SelectItem>
                    <SelectItem value="12.5kg">12.5kg</SelectItem>
                    <SelectItem value="45kg">45kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={selectedDelivery.quantity}
                  onChange={(e) =>
                    setSelectedDelivery({ ...selectedDelivery, quantity: Number.parseInt(e.target.value) })
                  }
                />
              </div>
              <Button
                onClick={() => {
                  setDeliveries(deliveries.map((d) => (d.id === selectedDelivery.id ? selectedDelivery : d)))
                  setSelectedDelivery(null)
                  toast({
                    title: "Delivery Updated",
                    description: `Delivery ${selectedDelivery.id} has been updated successfully.`,
                  })
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <style jsx>{`
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
    </Layout>
  )
}

