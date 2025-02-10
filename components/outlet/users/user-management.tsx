"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersThunk,
  getUserByIdThunk,
  createUserThunk,
} from "@/app/Redux/features/userSlice";
import { RootState, AppDispatch } from "@/app/Redux/store/store";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserForm } from "./user-form";
import { UserDetailsView } from "./user-details-view";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  image?: string;
  userType: string;
}

const USERS_PER_PAGE = 5; // Pagination Limit

export function UserManagement() {
  const dispatch: AppDispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state: RootState) => state.user);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch all users (consumers only)
  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  // Filter only consumers
  const consumerUsers = users?.allUsers?.filter((user: User) => user.userType === "consumer") || [];

  // Filtered Users based on search
  const filteredUsers = consumerUsers.filter(
    (user: User) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm)
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  // Handle Adding a New User
  const handleAddUser = async (userData: User) => {
    try {
      await dispatch(createUserThunk({ userData })).unwrap();
      setIsDialogOpen(false);
      dispatch(getAllUsersThunk()); // Refresh users after creation
    } catch (error) {
      toast.error("Failed to create user.");
    }
  };

  // Fetch and display user details
  const openDetailsDialog = async (userId: string) => {
    try {
      const user = await dispatch(getUserByIdThunk(userId)).unwrap();
      setViewingUser(user);
      setIsDetailsDialogOpen(true);
    } catch (error) {
      toast.error("Failed to fetch user details.");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management (Consumers Only)</h1>
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
                  setCurrentPage(1); // Reset to first page when searching
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user: User) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.firstName} />
                              <AvatarFallback>{user.firstName?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>{user.firstName} {user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneNumber}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => openDetailsDialog(user._id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                    >
                      <ChevronLeft className="h-5 w-5" /> Previous
                    </Button>
                    <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
                    <Button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                    >
                      Next <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleAddUser} onCancel={() => setIsDialogOpen(false)} initialData={null} />
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewingUser && <UserDetailsView user={viewingUser} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
