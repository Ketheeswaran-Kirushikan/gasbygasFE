"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/dispatch/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Mail, Phone, Search, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Driver {
  id: string
  name: string
  vehicleNumber: string
  status: "Active" | "Offline"
  availability: "Available" | "On Delivery" | "Off Duty"
  avatar: string
  email: string
  phone: string
}

const initialDrivers: Driver[] = [
  {
    id: "0001",
    name: "John Smith",
    vehicleNumber: "VH0212",
    status: "Active",
    availability: "Available",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "john.smith@example.com",
    phone: "123-456-7890",
  },
  {
    id: "0002",
    name: "Sarah Johnson",
    vehicleNumber: "VH0213",
    status: "Active",
    availability: "On Delivery",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "sarah.johnson@example.com",
    phone: "234-567-8901",
  },
  {
    id: "0003",
    name: "Mike Wilson",
    vehicleNumber: "VH0217",
    status: "Offline",
    availability: "Off Duty",
    avatar: "/placeholder.svg?height=40&width=40",
    email: "mike.wilson@example.com",
    phone: "345-678-9012",
  },
]

export default function DriverDetailsPage() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDriverDialogOpen, setIsAddDriverDialogOpen] = useState(false)
  const [isEditDriverDialogOpen, setIsEditDriverDialogOpen] = useState(false)
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null)
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({
    status: "Active",
    availability: "Available",
  })
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDriver = () => {
    const id = `00${drivers.length + 1}`.slice(-4)
    const driver: Driver = {
      ...(newDriver as Driver),
      id,
      avatar: "/placeholder.svg?height=40&width=40",
    }
    setDrivers([...drivers, driver])
    setIsAddDriverDialogOpen(false)
    setNewDriver({ status: "Active", availability: "Available" })
    toast({
      title: "Driver Added",
      description: `${driver.name} has been added successfully.`,
    })
  }

  const handleEditDriver = () => {
    if (currentDriver) {
      setDrivers(drivers.map((driver) => (driver.id === currentDriver.id ? currentDriver : driver)))
      setIsEditDriverDialogOpen(false)
      toast({
        title: "Driver Updated",
        description: `${currentDriver.name}'s information has been updated.`,
      })
    }
  }

  const handleDeleteDriver = (id: string) => {
    setDrivers(drivers.filter((driver) => driver.id !== id))
    setSelectedDrivers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
    toast({
      title: "Driver Deleted",
      description: "The driver has been removed from the system.",
      variant: "destructive",
    })
  }

  const handleDeleteSelected = () => {
    setDrivers(drivers.filter((driver) => !selectedDrivers.has(driver.id)))
    toast({
      title: "Drivers Deleted",
      description: `${selectedDrivers.size} driver(s) have been removed from the system.`,
      variant: "destructive",
    })
    setSelectedDrivers(new Set())
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDrivers(new Set(filteredDrivers.map((d) => d.id)))
    } else {
      setSelectedDrivers(new Set())
    }
  }

  const handleSelectDriver = (id: string, checked: boolean) => {
    setSelectedDrivers((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const getStatusBadge = (status: string, availability: string) => {
    let color = "bg-gray-500"
    if (status === "Active") {
      if (availability === "Available") color = "bg-green-500"
      else if (availability === "On Delivery") color = "bg-blue-500"
      else if (availability === "Off Duty") color = "bg-yellow-500"
    } else {
      color = "bg-red-500"
    }
    return (
      <Badge className={`${color} text-white`}>
        {status} - {availability}
      </Badge>
    )
  }

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between">
          <CardTitle>Driver Management</CardTitle>
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px] text-sm"
                />
              </div>
              {selectedDrivers.size > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected} className="text-xs sm:text-sm">
                  Delete ({selectedDrivers.size})
                </Button>
              )}
              <Dialog open={isAddDriverDialogOpen} onOpenChange={setIsAddDriverDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs sm:text-sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add Driver
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Driver</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newDriver.name || ""}
                        onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                      <Input
                        id="vehicleNumber"
                        value={newDriver.vehicleNumber || ""}
                        onChange={(e) => setNewDriver({ ...newDriver, vehicleNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newDriver.email || ""}
                        onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newDriver.phone || ""}
                        onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newDriver.status}
                        onValueChange={(value: "Active" | "Offline") => setNewDriver({ ...newDriver, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select
                        value={newDriver.availability}
                        onValueChange={(value: "Available" | "On Delivery" | "Off Duty") =>
                          setNewDriver({ ...newDriver, availability: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="On Delivery">On Delivery</SelectItem>
                          <SelectItem value="Off Duty">Off Duty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddDriver}>Add Driver</Button>
                  </DialogFooter>
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
                      checked={selectedDrivers.size === filteredDrivers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDrivers.has(driver.id)}
                        onCheckedChange={(checked) => handleSelectDriver(driver.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>{driver.id}</TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={driver.avatar} alt={driver.name} />
                        <AvatarFallback>{driver.name[0]}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.vehicleNumber}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{getStatusBadge(driver.status, driver.availability)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentDriver(driver)
                            setIsEditDriverDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDriver(driver.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => (window.location.href = `mailto:${driver.email}`)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => (window.location.href = `tel:${driver.phone}`)}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Driver Dialog */}
      <Dialog open={isEditDriverDialogOpen} onOpenChange={setIsEditDriverDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
          </DialogHeader>
          {currentDriver && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={currentDriver.name}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vehicleNumber">Vehicle Number</Label>
                <Input
                  id="edit-vehicleNumber"
                  value={currentDriver.vehicleNumber}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, vehicleNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentDriver.email}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={currentDriver.phone}
                  onChange={(e) => setCurrentDriver({ ...currentDriver, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentDriver.status}
                  onValueChange={(value: "Active" | "Offline") => setCurrentDriver({ ...currentDriver, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-availability">Availability</Label>
                <Select
                  value={currentDriver.availability}
                  onValueChange={(value: "Available" | "On Delivery" | "Off Duty") =>
                    setCurrentDriver({ ...currentDriver, availability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="On Delivery">On Delivery</SelectItem>
                    <SelectItem value="Off Duty">Off Duty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditDriver}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

