"use client"

import { useState } from "react"
import { Layout } from "@/components/dispatch/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for team members
const initialTeam = [
  { id: 1, name: "John Doe", role: "Dispatcher", status: "Available", avatar: "/avatars/01.png" },
  { id: 2, name: "Jane Smith", role: "Driver", status: "On Delivery", avatar: "/avatars/02.png" },
  { id: 3, name: "Mike Johnson", role: "Dispatcher", status: "Available", avatar: "/avatars/03.png" },
  { id: 4, name: "Emily Brown", role: "Driver", status: "On Break", avatar: "/avatars/04.png" },
  { id: 5, name: "Chris Lee", role: "Driver", status: "Available", avatar: "/avatars/05.png" },
]

export default function TeamPage() {
  const [team, setTeam] = useState(initialTeam)

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "Available"
                          ? "success"
                          : member.status === "On Delivery"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">View Details</Button>
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

