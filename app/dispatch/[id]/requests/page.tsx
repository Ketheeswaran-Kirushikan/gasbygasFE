"use client"

import { useState } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/distpach/ui/table"
import { Badge } from "@/components/distpach/ui/badge"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for requests
const initialRequests = [
  { id: 1, outlet: "Outlet A", type: "Refill", status: "Pending", date: "2023-06-01" },
  { id: 2, outlet: "Outlet B", type: "Emergency", status: "Confirmed", date: "2023-06-02" },
  { id: 3, outlet: "Outlet C", type: "Scheduled", status: "Rejected", date: "2023-06-03" },
  { id: 4, outlet: "Outlet D", type: "Refill", status: "Pending", date: "2023-06-04" },
  { id: 5, outlet: "Outlet E", type: "Emergency", status: "Confirmed", date: "2023-06-05" },
]

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests)
  const [filter, setFilter] = useState({ outlet: "", type: "", status: "" })

  const handleAction = (id: number, action: "confirm" | "reject") => {
    setRequests(
      requests.map((request) =>
        request.id === id
          ? { ...request, status: action === "confirm" ? "Confirmed" : "Rejected" }
          : request
      )
    )
  }

  const filteredRequests = requests.filter(
    (request) =>
      request.outlet.toLowerCase().includes(filter.outlet.toLowerCase()) &&
      request.type.toLowerCase().includes(filter.type.toLowerCase()) &&
      request.status.toLowerCase().includes(filter.status.toLowerCase())
  )

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Requests Management</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="outlet">Outlet</Label>
              <Input
                id="outlet"
                placeholder="Filter by outlet"
                value={filter.outlet}
                onChange={(e) => setFilter({ ...filter, outlet: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(value) => setFilter({ ...filter, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Refill">Refill</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setFilter({ ...filter, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outlet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.outlet}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "Confirmed"
                          ? "success"
                          : request.status === "Rejected"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>
                    {request.status === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(request.id, "confirm")}
                          className="mr-2"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(request.id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
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

