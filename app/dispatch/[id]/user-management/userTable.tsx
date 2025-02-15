"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk, createUserThunk, deleteUserThunk } from "@/app/Redux/features/userSlice";
import { RootState, AppDispatch } from "@/app/Redux/store/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserForm } from "./userForm";
import { UserDetailsView } from "./userview";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  userType: "consumer" | "businessIndustry";
  email: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  NIC?: string;
  companyName?: string;
  registrationNumber?: string;
  businessCategory?: string;
  createdAt?: { $date: { $numberLong: string } };
  updatedAt?: { $date: { $numberLong: string } };
}

const USERS_PER_PAGE = 5; // Pagination Limit

export function UserManagement() {
  const dispatch: AppDispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state: RootState) => state.user);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  // Pagination Logic
  const totalPages = Math.ceil(users?.allUsers?.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = users?.allUsers?.slice(startIndex, startIndex + USERS_PER_PAGE) || [];


  // Handle Adding a New User
  const handleAddUser = async (userData: User) => {
    try {
      await dispatch(createUserThunk({ userData })).unwrap();
      setIsDialogOpen(false);
      dispatch(getAllUsersThunk()); // Refresh users after creation
      toast.success("User added successfully!");
    } catch (error) {
      toast.error("Failed to create user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      toast.error("Invalid user ID.");
      console.error("Error: userId is undefined or missing");
      return;
    }
  
    console.log("Attempting to delete user with ID:", userId); // Debugging Log
  
    try {
      await dispatch(deleteUserThunk(userId)).unwrap();
      dispatch(getAllUsersThunk()); // Refresh users list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);;
    }
  };
  

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-red-500 hover:bg-red-600">
          <Plus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9 pr-4 w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <p className="text-center py-4">Loading users...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>User Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user: User) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.email} />
                              <AvatarFallback>
                                {user.firstName?.charAt(0) || user.companyName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            {user.userType === "consumer"
                              ? `${user.firstName} ${user.lastName}`
                              : user.companyName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneNumber}</TableCell>
                          <TableCell>{user.userType}</TableCell>
                          <TableCell className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <UserForm onCancel={() => setIsDialogOpen(false)} onSubmit={handleAddUser} />
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserDetailsView user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
