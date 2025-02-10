"use client"

import { useState } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Calendar } from "@/components/distpach/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/distpach/ui/table"
import { Badge } from "@/components/distpach/ui/badge"

// Mock data for scheduled deliveries
const initialSchedule = [
  { id: 1, outlet: "Outlet A", type: "Refill", date: "2023-06-15", time: "10:00 AM" },
  { id: 2, outlet: "Outlet B", type: "Maintenance", date: "2023-06-16", time: "2:00 PM" },
  { id: 3, outlet: "Outlet C", type: "Emergency", date: "2023-06-17", time: "9:00 AM" },
  { id: 4, outlet: "Outlet D", type: "Refill", date: "2023-06-18", time: "11:30 AM" },
  { id: 5, outlet: "Outlet E", type: "Maintenance", date: "2023-06-19", time: "3:30 PM" },
]

export default function SchedulePage() {
  const [schedule, setSchedule] = useState(initialSchedule)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const filteredSchedule = selectedDate
    ? schedule.filter((item) => item.date === selectedDate.toISOString().split('T')[0])
    : schedule

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Delivery Schedule</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedule.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.outlet}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.type === "Emergency"
                            ? "destructive"
                            : item.type === "Maintenance"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

