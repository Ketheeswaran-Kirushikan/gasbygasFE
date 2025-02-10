"use client"

import { useState } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/distpach/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/distpach/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/distpach/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/distpach/ui/select"
import { useToast } from "@/components/distpach/ui/use-toast"
import { Pencil, Trash2, Mail, Search, Plus, UserPlus, Lock, Eye, Camera, X, Phone } from "lucide-react"
import { Checkbox } from "@/components/distpach/ui/checkbox"

interface User {
  id: string
  name: string
  email: string
  role: "Consumer" | "Business" | "Outlet Manager" | "Dispatch Officer" | "Dispatch Manager"
  status: "Active" | "Inactive"
  avatar: string
  firstName?: string
  lastName?: string
  nic?: string
  businessName?: string
  businessRegNumber?: string
  businessCategory?: string
  contactPerson?: string
  certification?: string
  businessContactNumber?: string
  department?: string
  shift?: "Day" | "Night"
  outletName?: string
  outletLocation?: string
  yearsOfExperience?: number
  contactNumber?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const initialUsers: User[] = [
  {
    id: "U001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Dispatch Manager",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    businessContactNumber: "123-456-7890",
    contactNumber: "123-456-7890",
    department: "Operations",
    shift: "Day",
    yearsOfExperience: 5,
  },
  {
    id: "U002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Outlet Manager",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    contactNumber: "987-654-3210",
    outletName: "Central Gas Station",
    outletLocation: "123 Main St",
    yearsOfExperience: 3,
  },
  {
    id: "U003",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Consumer",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
    contactNumber: "555-123-4567",
    firstName: "Bob",
    lastName: "Johnson",
    nic: "1234567890",
  },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isViewUserDialogOpen, setIsViewUserDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  })
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    const id = `U${users.length + 1}`.padStart(4, "0")
    const user: User = {
      ...(newUser as User),
      id,
      avatar: newUser.avatar || "/placeholder.svg?height=40&width=40",
    }
    setUsers([...users, user])
    setIsAddUserDialogOpen(false)
    setNewUser({ status: "Active", avatar: "/placeholder.svg?height=40&width=40" })
    toast({
      title: "User Added",
      description: `${user.name} has been added successfully.`,
    })
  }

  const handleEditUser = () => {
    if (currentUser) {
      if (currentUser.newPassword) {
        if (currentUser.newPassword !== currentUser.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "New password and confirm password do not match.",
            variant: "destructive",
          })
          return
        }
        // Here you would typically verify the current password and update the new password
        // For this example, we'll just show a success message
        toast({
          title: "Password Updated",
          description: "The user's password has been successfully updated.",
        })
      }

      setUsers(
        users.map((user) =>
          user.id === currentUser.id
            ? {
                ...currentUser,
                currentPassword: undefined,
                newPassword: undefined,
                confirmPassword: undefined,
              }
            : user,
        ),
      )
      setIsEditUserDialogOpen(false)
      toast({
        title: "User Updated",
        description: `${currentUser.name}'s information has been updated.`,
      })

      // If the avatar has changed, show a specific toast
      if (currentUser.avatar !== initialUsers.find((u) => u.id === currentUser.id)?.avatar) {
        toast({
          title: "Profile Picture Updated",
          description: "The user's profile picture has been successfully updated.",
        })
      }
    }
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
    setSelectedUsers((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
    toast({
      title: "User Deleted",
      description: "The user has been removed from the system.",
      variant: "destructive",
    })
  }

  const handleDeleteSelected = () => {
    setUsers(users.filter((user) => !selectedUsers.has(user.id)))
    toast({
      title: "Users Deleted",
      description: `${selectedUsers.size} user(s) have been removed from the system.`,
      variant: "destructive",
    })
    setSelectedUsers(new Set())
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)))
    } else {
      setSelectedUsers(new Set())
    }
  }

  const handleSelectUser = (id: string, checked: boolean) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleViewUser = (user: User) => {
    setCurrentUser(user)
    setIsViewUserDialogOpen(true)
  }

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[200px] text-sm"
                />
              </div>
              {selectedUsers.size > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected} className="text-xs sm:text-sm">
                  Delete ({selectedUsers.size})
                </Button>
              )}
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs sm:text-sm">
                    <UserPlus className="mr-1 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consumer">Consumer</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Outlet Manager">Outlet Manager</SelectItem>
                            <SelectItem value="Dispatch Officer">Dispatch Officer</SelectItem>
                            <SelectItem value="Dispatch Manager">Dispatch Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={newUser.avatar} alt="New user" />
                              <AvatarFallback>{newUser.name ? newUser.name[0] : "?"}</AvatarFallback>
                            </Avatar>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                              onClick={() => document.getElementById("new-avatar-upload").click()}
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input
                            id="new-avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  setNewUser({ ...newUser, avatar: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                          />
                          {newUser.avatar && newUser.avatar !== "/placeholder.svg?height=40&width=40" && (
                            <div className="relative">
                              <img
                                src={newUser.avatar || "/placeholder.svg"}
                                alt="New avatar"
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <Button
                                variant="secondary"
                                size="icon"
                                className="absolute top-0 right-0 h-6 w-6 rounded-full"
                                onClick={() =>
                                  setNewUser({ ...newUser, avatar: "/placeholder.svg?height=40&width=40" })
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {(newUser.role === "Dispatch Officer" || newUser.role === "Dispatch Manager") && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                              id="department"
                              value={newUser.department || ""}
                              onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="shift">Shift</Label>
                            <Select
                              value={newUser.shift}
                              onValueChange={(value: "Day" | "Night") => setNewUser({ ...newUser, shift: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select shift" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Day">Day</SelectItem>
                                <SelectItem value="Night">Night</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {newUser.role === "Outlet Manager" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="outletName">Outlet Name</Label>
                            <Input
                              id="outletName"
                              value={newUser.outletName || ""}
                              onChange={(e) => setNewUser({ ...newUser, outletName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="outletLocation">Outlet Location</Label>
                            <Input
                              id="outletLocation"
                              value={newUser.outletLocation || ""}
                              onChange={(e) => setNewUser({ ...newUser, outletLocation: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {/* Role-specific fields */}
                      {newUser.role === "Consumer" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              value={newUser.firstName || ""}
                              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              value={newUser.lastName || ""}
                              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nic">NIC</Label>
                            <Input
                              id="nic"
                              value={newUser.nic || ""}
                              onChange={(e) => setNewUser({ ...newUser, nic: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {newUser.role === "Business" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                              id="businessName"
                              value={newUser.businessName || ""}
                              onChange={(e) => setNewUser({ ...newUser, businessName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessRegNumber">Business Registration Number</Label>
                            <Input
                              id="businessRegNumber"
                              value={newUser.businessRegNumber || ""}
                              onChange={(e) => setNewUser({ ...newUser, businessRegNumber: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessCategory">Business Category</Label>
                            <Select
                              value={newUser.businessCategory}
                              onValueChange={(value) => setNewUser({ ...newUser, businessCategory: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessContactNumber">Business Contact Number</Label>
                            <Input
                              id="businessContactNumber"
                              value={newUser.businessContactNumber || ""}
                              onChange={(e) => setNewUser({ ...newUser, businessContactNumber: e.target.value })}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Common fields for all roles */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email || ""}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newUser.status}
                          onValueChange={(value: "Active" | "Inactive") => setNewUser({ ...newUser, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {(newUser.role === "Dispatch Officer" ||
                        newUser.role === "Dispatch Manager" ||
                        newUser.role === "Outlet Manager") && (
                        <div className="space-y-2">
                          <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                          <Input
                            id="yearsOfExperience"
                            type="number"
                            value={newUser.yearsOfExperience || ""}
                            onChange={(e) =>
                              setNewUser({ ...newUser, yearsOfExperience: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      )}
                      {newUser.role === "Business" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="contactPerson">Contact Person Name</Label>
                            <Input
                              id="contactPerson"
                              value={newUser.contactPerson || ""}
                              onChange={(e) => setNewUser({ ...newUser, contactPerson: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="certification">Certification</Label>
                            <Input
                              id="certification"
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  setNewUser({ ...newUser, certification: file.name })
                                }
                              }}
                            />
                          </div>
                        </>
                      )}
                      {(newUser.role === "Consumer" ||
                        newUser.role === "Outlet Manager" ||
                        newUser.role === "Dispatch Officer" ||
                        newUser.role === "Dispatch Manager") && (
                        <div className="space-y-2">
                          <Label htmlFor="contactNumber">Contact Number</Label>
                          <Input
                            id="contactNumber"
                            value={newUser.contactNumber || ""}
                            onChange={(e) => setNewUser({ ...newUser, contactNumber: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddUser}>Add User</Button>
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
                    <Checkbox checked={selectedUsers.size === filteredUsers.length} onCheckedChange={handleSelectAll} />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.has(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        {user.role === "Consumer"
                          ? `${user.firstName} ${user.lastName}`
                          : user.role === "Business"
                            ? user.businessName
                            : user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => (window.location.href = `mailto:${user.email}`)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            (window.location.href = `tel:${user.contactNumber || user.businessContactNumber}`)
                          }
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant={user.status === "Active" ? "default" : "secondary"} size="sm">
                        {user.status}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentUser(user)
                            setIsEditUserDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
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

      {/* View User Dialog */}
      <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                    <p className="text-sm text-gray-500">{currentUser.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="bg-white p-2 rounded border">{currentUser.email}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="bg-white p-2 rounded border">
                    <Button variant={currentUser.status === "Active" ? "default" : "secondary"} size="sm">
                      {currentUser.status}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Role-specific fields */}
                {currentUser.role === "Consumer" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">NIC</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.nic}</div>
                    </div>
                  </>
                )}
                {currentUser.role === "Business" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Business Name</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.businessName}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Business Registration Number</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.businessRegNumber}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Business Category</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.businessCategory}</div>
                    </div>
                  </>
                )}
                {(currentUser.role === "Dispatch Officer" || currentUser.role === "Dispatch Manager") && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Department</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.department}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Shift</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.shift}</div>
                    </div>
                  </>
                )}
                {currentUser.role === "Outlet Manager" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Outlet Name</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.outletName}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Outlet Location</Label>
                      <div className="bg-white p-2 rounded border">{currentUser.outletLocation}</div>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Contact Number</Label>
                  <div className="bg-white p-2 rounded border">
                    {currentUser.contactNumber || currentUser.businessContactNumber}
                  </div>
                </div>
                {(currentUser.role === "Dispatch Officer" ||
                  currentUser.role === "Dispatch Manager" ||
                  currentUser.role === "Outlet Manager") && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Years of Experience</Label>
                    <div className="bg-white p-2 rounded border">{currentUser.yearsOfExperience} years</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit User</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                      onClick={() => document.getElementById("avatar-upload").click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setCurrentUser({ ...currentUser, avatar: reader.result as string })
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {currentUser.avatar &&
                    currentUser.avatar !== initialUsers.find((u) => u.id === currentUser.id)?.avatar && (
                      <div className="relative">
                        <img
                          src={currentUser.avatar || "/placeholder.svg"}
                          alt="New avatar"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 rounded-full"
                          onClick={() =>
                            setCurrentUser({
                              ...currentUser,
                              avatar: initialUsers.find((u) => u.id === currentUser.id)?.avatar || "",
                            })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={currentUser.role}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consumer">Consumer</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Outlet Manager">Outlet Manager</SelectItem>
                      <SelectItem value="Dispatch Officer">Dispatch Officer</SelectItem>
                      <SelectItem value="Dispatch Manager">Dispatch Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentUser.status}
                    onValueChange={(value: "Active" | "Inactive") => setCurrentUser({ ...currentUser, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                {/* Role-specific fields */}
                {currentUser.role === "Consumer" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-nic">NIC</Label>
                      <Input
                        id="edit-nic"
                        value={currentUser.nic || ""}
                        onChange={(e) => setCurrentUser({ ...currentUser, nic: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {currentUser.role === "Business" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-businessName">Business Name</Label>
                      <Input
                        id="edit-businessName"
                        value={currentUser.businessName || ""}
                        onChange={(e) => setCurrentUser({ ...currentUser, businessName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-businessRegNumber">Business Registration Number</Label>
                      <Input
                        id="edit-businessRegNumber"
                        value={currentUser.businessRegNumber || ""}
                        onChange={(e) => setCurrentUser({ ...currentUser, businessRegNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-businessCategory">Business Category</Label>
                      <Input
                        id="edit-businessCategory"
                        value={currentUser.businessCategory || ""}
                        onChange={(e) => setCurrentUser({ ...currentUser, businessCategory: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {(currentUser.role === "Dispatch Officer" || currentUser.role === "Dispatch Manager") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-shift">Shift</Label>
                      <Select
                        value={currentUser.shift}
                        onValueChange={(value: "Day" | "Night") => setCurrentUser({ ...currentUser, shift: value })}
                      >
                        <SelectTrigger id="edit-shift">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day">Day</SelectItem>
                          <SelectItem value="Night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {currentUser.role === "Outlet Manager" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="edit-outletName">Outlet Name</Label>
                      <Input
                        id="edit-outletName"
                        value={currentUser.outletName || ""}
                        onChange={(e) => setCurrentUser({ ...currentUser, outletName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-outletLocation">Outlet Location</Label>
                      <Input
                        id="edit-outletLocation"
                        value={currentUser.outletLocation || ""}
                        onChange={(e) => setCurrentUser({ ...currentUser, outletLocation: e.target.value })}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="edit-contactNumber">Contact Number</Label>
                  <Input
                    id="edit-contactNumber"
                    value={currentUser.contactNumber || currentUser.businessContactNumber || ""}
                    onChange={(e) => setCurrentUser({ ...currentUser, contactNumber: e.target.value })}
                  />
                </div>
                {(currentUser.role === "Dispatch Officer" ||
                  currentUser.role === "Dispatch Manager" ||
                  currentUser.role === "Outlet Manager") && (
                  <div className="space-y-2">
                    <Label htmlFor="edit-yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="edit-yearsOfExperience"
                      type="number"
                      value={currentUser.yearsOfExperience || ""}
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, yearsOfExperience: Number.parseInt(e.target.value, 10) })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleEditUser} className="w-full">
              Save Changes
            </Button>
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

