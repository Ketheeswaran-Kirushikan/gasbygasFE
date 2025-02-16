"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOutletsThunk, createOutletThunk, deleteOutletThunk } from "@/app/Redux/features/outletSlice";
import { RootState, AppDispatch } from "@/app/Redux/store/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OutletForm } from "./userForm";
import { OutletDetailsView } from "./userview";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Outlet {
  outletName: string;
  outletAddress: string;
  registrationNumber: string;
  emailAddress: string;
  password: string;
  image?: string;
  certificate?: string;
  longitude: number;
  latitude: number;
  gasStock: Array<{
    gasType: string;
    weight: number;
    quantity: number;
    price: number;
    individualPrice: number;
  }>;
  createdAt?: { $date: { $numberLong: string } };
  updatedAt?: { $date: { $numberLong: string } };
}

const OUTLETS_PER_PAGE = 5; // Pagination Limit

export function OutletManagement() {
  const dispatch: AppDispatch = useDispatch();
  const { outlets, isLoading, error } = useSelector((state: RootState) => state.outlets);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(getAllOutletsThunk());
  }, [dispatch]);

  // Pagination Logic
  const totalPages = Math.ceil(outlets?.length / OUTLETS_PER_PAGE);
  const startIndex = (currentPage - 1) * OUTLETS_PER_PAGE;
  const paginatedOutlets = outlets?.slice(startIndex, startIndex + OUTLETS_PER_PAGE) || [];

  // Handle Adding a New Outlet
  const handleAddOutlet = async (outletData: Outlet) => {
    try {
      await dispatch(createOutletThunk(outletData)).unwrap();
      setIsDialogOpen(false);
      dispatch(getAllOutletsThunk()); // Refresh outlets after creation
      toast.success("Outlet added successfully!");
    } catch (error) {
      toast.error("Failed to create outlet.");
    }
  };

  const handleDeleteOutlet = async (outletId) => {
    if (!outletId) {
      toast.error("Invalid outlet ID.");
      console.error("Error: outletId is undefined or missing");
      return;
    }
  
    console.log("Attempting to delete outlet with ID:", outletId); // Debugging Log
  
    try {
      await dispatch(deleteOutletThunk(outletId)).unwrap();
      dispatch(getAllOutletsThunk()); // Refresh outlets list after deletion
    } catch (error) {
      console.error("Error deleting outlet:", error);;
    }
  };
  

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Outlet Management</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-red-500 hover:bg-red-600">
          <Plus className="h-4 w-4 mr-2" /> Add Outlet
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search outlets..."
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
              <p className="text-center py-4">Loading outlets...</p>
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
                      <TableHead>Address</TableHead>
                      <TableHead>Registration Number</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOutlets.length > 0 ? (
                      paginatedOutlets.map((outlet: Outlet) => (
                        <TableRow key={outlet._id}>
                          <TableCell>
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={outlet.image || "/placeholder.svg"} alt={outlet.emailAddress} />
                              <AvatarFallback>
                                {outlet.outletName?.charAt(0) || "O"}
                              </AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>{outlet.outletName}</TableCell>
                          <TableCell>{outlet.emailAddress}</TableCell>
                          <TableCell>{outlet.outletAddress}</TableCell>
                          <TableCell>{outlet.registrationNumber}</TableCell>
                          <TableCell className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedOutlet(outlet);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteOutlet(outlet._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No outlets found.
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

      {/* Add Outlet Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Outlet</DialogTitle>
          </DialogHeader>
          <OutletForm onCancel={() => setIsDialogOpen(false)} onSubmit={handleAddOutlet} />
        </DialogContent>
      </Dialog>

      {/* Outlet Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Outlet Details</DialogTitle>
          </DialogHeader>
          {selectedOutlet && <OutletDetailsView outlet={selectedOutlet} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}