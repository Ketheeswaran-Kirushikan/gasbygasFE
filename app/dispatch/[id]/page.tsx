"use client"

import { useState } from "react"
import Link from "next/link"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Badge } from "@/components/distpach/ui/badge"
import { Switch } from "@/components/distpach/ui/switch"
import { Label } from "@/components/distpach/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/distpach/ui/table"
import { ArrowRight, Truck, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/distpach/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/distpach/ui/select"

// Mock data for delivery requests
const initialRequests = [
  { id: "ABC1025", type: "Domestic", outlet: "Outlet1", status: "pending", gasWeight: "12.5kg", quantityUnits: 10 },
  { id: "ABC1026", type: "Industrial", outlet: "Outlet2", status: "confirmed", gasWeight: "45kg", quantityUnits: 5 },
  { id: "ABC1027", type: "Domestic", outlet: "Outlet3", status: "cancelled", gasWeight: "5kg", quantityUnits: 20 },
]

export default function DashboardPage() {
  const [requests] = useState(initialRequests)

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests (Today)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">123</div>
                  <p className="text-xs text-muted-foreground">+10% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">-5% from last hour</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Delivery %</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92.8%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last week</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle>Recent Delivery Requests</CardTitle>
            <Link href="/delivery-requests">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Outlet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gas Weight</TableHead>
                    <TableHead>Quantity (Units)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <span className={request.type === "Domestic" ? "text-blue-500" : "text-green-500"}>
                          {request.type}
                        </span>
                      </TableCell>
                      <TableCell>{request.outlet}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            request.status === "pending"
                              ? "default"
                              : request.status === "confirmed"
                                ? "success"
                                : "destructive"
                          }
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.gasWeight}</TableCell>
                      <TableCell>{request.quantityUnits}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Alerts</CardTitle>
              <Button variant="link" size="sm" className="text-red-500 text-xs sm:text-sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-900">Downtown Station</h4>
                    <p className="text-sm text-red-700">Stock level below 20%, Immediate action required.</p>
                  </div>
                  <span className="text-sm text-gray-500">7:51:58 PM</span>
                </div>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-yellow-900">Westside Gas</h4>
                    <p className="text-sm text-yellow-700">Delivery DL0003 is running 30 minutes late.</p>
                  </div>
                  <span className="text-sm text-gray-500">7:51:58 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock</Label>
                  <div className="text-sm text-muted-foreground">Threshold: 20%</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Demand</Label>
                  <div className="text-sm text-muted-foreground">Threshold: 80%</div>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>New Alert Type</Label>
                <Input placeholder="e.g., Critical Low Stock" />
              </div>
              <div className="space-y-2">
                <Label>Threshold (%)</Label>
                <Input placeholder="e.g., 10" />
              </div>
              <Button className="w-full">Add New Alert</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stock Allocation</CardTitle>
            <Button variant="link">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span className="text-blue-500">Outlet 1</span>
                  </TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>
                    <Button variant="secondary">Send Suggestion</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="text-blue-500">Outlet 2</span>
                  </TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>
                    <Button variant="secondary">Send Suggestion</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total End User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Consumer</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold">200+</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Business and Industry Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold">225+</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  )
}

