"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllGasRequestsByOutletThunk,
  createGasRequestThunk,
  updateGasRequestThunk,
  deleteGasRequestThunk,
} from "@/app/Redux/features/gasRequestSlice";
import { RootState } from "@/app/Redux/store/store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus, Search, Eye } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { DeliveryDetailsView } from "./delivery-details-view";
import { DeliveryRequestForm } from "./delivery-request-form";

export function DeliveryManagement() {
  const dispatch = useDispatch();
  const { id: outletId } = useParams(); // Get Outlet ID from URL
  const { gasRequests, loading, error } = useSelector(
    (state: RootState) => state.gasRequests
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [deleteRequestId, setDeleteRequestId] = useState(null); // State for delete confirmation
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    if (outletId) {
      dispatch(getAllGasRequestsByOutletThunk(outletId));
    }
  }, [dispatch, outletId]);

  const handleDeleteRequest = (id: string) => {
    dispatch(deleteGasRequestThunk(id));
    setDeleteRequestId(null); // Close the confirmation dialog
    dispatch(getAllGasRequestsByOutletThunk(outletId));

  };

  const handleAddRequest = (request) => {
    console.log("Request to be sent:", request);
    const newRequestData = {
      ...request,
      outletId,
      status: "pending",
    };
    dispatch(createGasRequestThunk(newRequestData))
      .then((response) => {
        console.log("Response from backend:", response);
      })
      .catch((error) => {
        console.error("Error in API call:", error);
      });
    dispatch(getAllGasRequestsByOutletThunk(outletId));
  };

  const handleUpdateRequest = () => {
    if (!editingRequest || !statusUpdate) return;
    dispatch(updateGasRequestThunk({ referenceNumber: editingRequest.referenceNumber, formData: { status: statusUpdate } }));
    setEditingRequest(null);
    dispatch(getAllGasRequestsByOutletThunk(outletId));

  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "process":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequests = Array.isArray(gasRequests)
    ? gasRequests.filter((request) =>
        request.referenceNumber?.toLowerCase()?.includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Prevents hydration mismatch

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <ToastContainer />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Gas Request Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Delivery Request</DialogTitle>
            </DialogHeader>
            <DeliveryRequestForm onSubmit={handleAddRequest} /> {/* ✅ Now it works */}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading && <p className="text-center">Loading requests...</p>}
          {error && <p className="text-center text-red-600">Error fetching requests</p>}

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-500 -translate-y-1/2" />
              <Input
                placeholder="Search requests..."
                className="pl-9 pr-4 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Gas Type</TableHead>
                  <TableHead>Gas Weight</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Payment Option</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="font-medium">{request.referenceNumber}</TableCell>
                    <TableCell>{request.gasType}</TableCell>
                    <TableCell>{request.gasWeight} KG</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{request.paymentOption}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* View Request Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setViewingRequest(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delivery Request Details</DialogTitle>
                            </DialogHeader>
                            {viewingRequest && <DeliveryDetailsView request={viewingRequest} />}
                          </DialogContent>
                        </Dialog>

                        {/* Edit Request Button */}
                        <Button variant="ghost" size="sm" onClick={() => setEditingRequest(request)}>
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Delete Request Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setDeleteRequestId(request._id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Delete</DialogTitle>
                            </DialogHeader>
                            <p>Are you sure you want to delete this request?</p>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteRequestId(null)}>Cancel</Button>
                              <Button variant="destructive" onClick={() => handleDeleteRequest(deleteRequestId)}>Delete</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow-sm">
              {Array.from({ length: Math.ceil(filteredRequests.length / itemsPerPage) }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => paginate(i + 1)}
                  className="mx-1"
                >
                  {i + 1}
                </Button>
              ))}
            </nav>
          </div>
        </CardContent>
      </Card>

      {editingRequest && (
        <Dialog open={!!editingRequest} onOpenChange={() => setEditingRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Request Status</DialogTitle>
            </DialogHeader>
            <Select onValueChange={setStatusUpdate}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="process">Process</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button onClick={handleUpdateRequest}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}