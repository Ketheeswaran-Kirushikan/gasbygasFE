"use client"

import { useState } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/distpach/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/distpach/ui/dialog"
import { useToast } from "@/components/distpach/ui/use-toast"
import { Pencil, Trash2, Eye, CheckCircle, XCircle, Clock, Download, Plus } from "lucide-react"
import { Checkbox } from "@/components/distpach/ui/checkbox"
import { cn } from "@/lib/distpach/utils"

interface DeliveryRequest {
  id: string
  type: "Domestic" | "Industrial"
  outlet: string
  status: "pending" | "confirmed" | "cancelled"
  gasWeight: "5 KG" | "12.5 KG" | "37.5 KG"
  quantityUnits: number
}

const initialRequests: DeliveryRequest[] = [
  { id: "ABC1025", type: "Domestic", outlet: "Outlet1", status: "pending", gasWeight: "12.5 KG", quantityUnits: 10 },
  { id: "ABC1026", type: "Industrial", outlet: "Outlet2", status: "confirmed", gasWeight: "37.5 KG", quantityUnits: 5 },
  { id: "ABC1027", type: "Domestic", outlet: "Outlet3", status: "cancelled", gasWeight: "5 KG", quantityUnits: 20 },
  { id: "ABC1028", type: "Industrial", outlet: "Outlet4", status: "pending", gasWeight: "37.5 KG", quantityUnits: 2 },
  { id: "ABC1029", type: "Domestic", outlet: "Outlet5", status: "confirmed", gasWeight: "12.5 KG", quantityUnits: 15 },
]

export default function DeliveryRequestsPage() {
  const [requests, setRequests] = useState<DeliveryRequest[]>(initialRequests)
  const [filters, setFilters] = useState({ type: "All", status: "All" })
  const [searchTerm, setSearchTerm] = useState("")
  const [editingRequest, setEditingRequest] = useState<DeliveryRequest | null>(null)
  const [viewingRequest, setViewingRequest] = useState<DeliveryRequest | null>(null)
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false)
  const [newRequest, setNewRequest] = useState<Partial<DeliveryRequest>>({
    type: "Domestic",
    status: "pending",
    gasWeight: "12.5 KG",
    quantityUnits: 0,
  })
  const { toast } = useToast()

  const filteredRequests = requests.filter(
    (request) =>
      (filters.type === "All" || request.type === filters.type) &&
      (filters.status === "All" || request.status === filters.status) &&
      (request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.outlet.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDelete = (ids: string[]) => {
    setRequests(requests.filter((request) => !ids.includes(request.id)))
    setSelectedRequests(new Set())
    toast({
      title: "Requests Deleted",
      description: `${ids.length} request(s) have been deleted.`,
      variant: "destructive",
    })
  }

  const handleStatusChange = (id: string, newStatus: DeliveryRequest["status"]) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: newStatus } : request)))
    toast({
      title: "Status Updated",
      description: `Request ${id} status has been updated to ${newStatus}.`,
    })
  }

  const handleEdit = (request: DeliveryRequest) => {
    setEditingRequest(request)
  }

  const handleSaveEdit = (editedRequest: DeliveryRequest) => {
    setRequests(requests.map((request) => (request.id === editedRequest.id ? editedRequest : request)))
    setEditingRequest(null)
    toast({
      title: "Request Updated",
      description: `Request ${editedRequest.id} has been updated.`,
    })
  }

  const handleView = (request: DeliveryRequest) => {
    setViewingRequest(request)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(new Set(filteredRequests.map((r) => r.id)))
    } else {
      setSelectedRequests(new Set())
    }
  }

  const handleSelectRequest = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRequests)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRequests(newSelected)
  }

  const handleDownloadSelected = () => {
    const selectedData = requests.filter((r) => selectedRequests.has(r.id))
    const csv = [
      ["ID", "Type", "Outlet", "Status", "Quantity (Units)"],
      ...selectedData.map((r) => [r.id, r.type, r.outlet, r.status, r.quantityUnits.toString()]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "delivery_requests.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAddNewRequest = () => {
    const id = `ABC${Math.floor(1000 + Math.random() * 9000)}`
    const newDeliveryRequest: DeliveryRequest = {
      ...(newRequest as DeliveryRequest),
      id,
    }
    setRequests([...requests, newDeliveryRequest])
    setIsNewRequestDialogOpen(false)
    setNewRequest({
      type: "Domestic",
      status: "pending",
      gasWeight: "12.5 KG",
      quantityUnits: 0,
    })
    toast({
      title: "New Request Added",
      description: `Request ${id} has been added successfully.`,
    })
  }

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <Card className="flex-grow overflow-hidden">
          <CardHeader className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center justify-between pb-4">
            <CardTitle className="text-2xl font-bold">Delivery Requests</CardTitle>
            <div className="w-full sm:w-auto overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-max">
                <Input
                  placeholder="Search by ID or Outlet"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px] text-sm"
                />
                <select
                  className="h-8 sm:h-10 rounded-md border border-input bg-background px-3 py-1 text-sm sm:text-base"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="All">All Types</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Industrial">Industrial</option>
                </select>
                <select
                  className="h-8 sm:h-10 rounded-md border border-input bg-background px-3 py-1 text-sm sm:text-base"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="All">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button
                  variant="outline"
                  onClick={handleDownloadSelected}
                  className={cn("text-xs sm:text-sm", selectedRequests.size > 0 ? "visible" : "invisible")}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(Array.from(selectedRequests))}
                  className={cn("text-xs sm:text-sm", selectedRequests.size > 0 ? "visible" : "invisible")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="text-xs sm:text-sm">
                      <Plus className="mr-1 h-4 w-4" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Delivery Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                          value={newRequest.type}
                          onChange={(e) =>
                            setNewRequest({ ...newRequest, type: e.target.value as "Domestic" | "Industrial" })
                          }
                        >
                          <option value="Domestic">Domestic</option>
                          <option value="Industrial">Industrial</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Outlet</label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                          value={newRequest.outlet || ""}
                          onChange={(e) => setNewRequest({ ...newRequest, outlet: e.target.value })}
                        >
                          <option value="">Select Outlet</option>
                          <option value="Outlet1">Outlet 1</option>
                          <option value="Outlet2">Outlet 2</option>
                          <option value="Outlet3">Outlet 3</option>
                          <option value="Outlet4">Outlet 4</option>
                          <option value="Outlet5">Outlet 5</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Gas Weight</label>
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                          value={newRequest.gasWeight}
                          onChange={(e) =>
                            setNewRequest({
                              ...newRequest,
                              gasWeight: e.target.value as "5 KG" | "12.5 KG" | "37.5 KG",
                            })
                          }
                        >
                          <option value="5 KG">5 KG</option>
                          <option value="12.5 KG">12.5 KG</option>
                          <option value="37.5 KG">37.5 KG</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Quantity (Units)</label>
                        <Input
                          type="number"
                          value={newRequest.quantityUnits || ""}
                          onChange={(e) => setNewRequest({ ...newRequest, quantityUnits: Number(e.target.value) })}
                        />
                      </div>
                      <Button onClick={handleAddNewRequest}>Add Request</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto h-[calc(100vh-13rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedRequests.size === filteredRequests.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[150px]">Type</TableHead>
                  <TableHead className="w-[200px]">Outlet</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="w-[150px]">Gas Weight</TableHead>
                  <TableHead className="w-[150px]">Quantity (Units)</TableHead>
                  <TableHead>Status Actions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRequests.has(request.id)}
                        onCheckedChange={(checked) => handleSelectRequest(request.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <span className={request.type === "Domestic" ? "text-blue-500" : "text-green-500"}>
                        {request.type}
                      </span>
                    </TableCell>
                    <TableCell>{request.outlet}</TableCell>
                    <TableCell>
                      <span
                        className={
                          request.status === "pending"
                            ? "text-yellow-500"
                            : request.status === "confirmed"
                              ? "text-green-500"
                              : "text-red-500"
                        }
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{request.gasWeight}</TableCell>
                    <TableCell>{request.quantityUnits}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange(request.id, "pending")}>
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange(request.id, "confirmed")}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange(request.id, "cancelled")}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(request)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(request)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete([request.id])}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRequest} onOpenChange={() => setEditingRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Delivery Request</DialogTitle>
          </DialogHeader>
          {editingRequest && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ID</label>
                <Input value={editingRequest.id} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={editingRequest.type}
                  onChange={(e) =>
                    setEditingRequest({ ...editingRequest, type: e.target.value as "Domestic" | "Industrial" })
                  }
                >
                  <option value="Domestic">Domestic</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Outlet</label>
                <Input
                  value={editingRequest.outlet}
                  onChange={(e) => setEditingRequest({ ...editingRequest, outlet: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={editingRequest.status}
                  onChange={(e) =>
                    setEditingRequest({
                      ...editingRequest,
                      status: e.target.value as "pending" | "confirmed" | "cancelled",
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Gas Weight</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={editingRequest.gasWeight}
                  onChange={(e) =>
                    setEditingRequest({
                      ...editingRequest,
                      gasWeight: e.target.value as "5 KG" | "12.5 KG" | "37.5 KG",
                    })
                  }
                >
                  <option value="5 KG">5 KG</option>
                  <option value="12.5 KG">12.5 KG</option>
                  <option value="37.5 KG">37.5 KG</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Quantity (Units)</label>
                <Input
                  type="number"
                  value={editingRequest.quantityUnits}
                  onChange={(e) => setEditingRequest({ ...editingRequest, quantityUnits: Number(e.target.value) })}
                />
              </div>
              <Button onClick={() => handleSaveEdit(editingRequest)}>Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewingRequest} onOpenChange={() => setViewingRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Delivery Request</DialogTitle>
          </DialogHeader>
          {viewingRequest && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ID</label>
                <Input value={viewingRequest.id} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <Input value={viewingRequest.type} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Outlet</label>
                <Input value={viewingRequest.outlet} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Input value={viewingRequest.status} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Gas Weight</label>
                <Input value={viewingRequest.gasWeight} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Quantity (Units)</label>
                <Input value={viewingRequest.quantityUnits} disabled />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => handleDownloadSingle(viewingRequest)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
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

