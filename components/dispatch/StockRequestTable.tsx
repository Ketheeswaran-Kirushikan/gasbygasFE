import { useState } from "react";
import { cn } from "@/lib/utils"; // Importing cn utility (if it exists in utils)
// OR
import clsx from "clsx"; // Import clsx (alternative method)

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
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"; // Import tooltip component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogActions,
} from "@/components/ui/dialog";

interface StockRequest {
  _id: string;
  status: string;
  stockDetails: {
    outletId?: { outletName: string };
    weight?: string;
    quantity?: string;
  }[];
  createdAt?: string;
  deliveryDate?: string;
}

interface DeliveryRequestsTableProps {
  requests: StockRequest[];
  selectedRequests: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectRequest: (id: string, checked: boolean) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onEdit: (request: StockRequest) => void;
  onView: (request: StockRequest) => void;
  onDelete: (ids: string[]) => void;
  onDownloadSelected: () => void;
  filters: { status: string };
  onFilterChange: (filters: { status: string }) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewRequestClick: () => void;
}

export default function DeliveryRequestsTable({
  requests,
  selectedRequests,
  onSelectAll,
  onSelectRequest,
  onStatusChange,
  onEdit,
  onView,
  onDelete,
  onDownloadSelected,
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onNewRequestClick,
}: DeliveryRequestsTableProps) {
  const [statusChangeRequest, setStatusChangeRequest] = useState<{
    id: string;
    newStatus: string;
  } | null>(null);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false);

  const handleStatusChange = (id: string, newStatus: string) => {
    setStatusChangeRequest({ id, newStatus });
    setStatusChangeDialogOpen(true); // Open the confirmation dialog
  };

  const confirmStatusChange = () => {
    if (statusChangeRequest) {
      onStatusChange(statusChangeRequest.id, statusChangeRequest.newStatus);
      setStatusChangeRequest(null); // Reset the state
      setStatusChangeDialogOpen(false); // Close the dialog
    }
  };

  const handleDeleteConfirmation = (ids: string[]) => {
    setDeleteConfirmationOpen(true); // Open the confirmation modal
  };

  const confirmDelete = () => {
    if (selectedRequests.size > 0) {
      onDelete(Array.from(selectedRequests)); // Convert Set to Array and pass to onDelete
      setDeleteConfirmationOpen(false); // Close the modal
    } else {
      console.warn("No requests selected for deletion.");
    }
  };

  return (
    <>
      <Card className="flex-grow overflow-hidden">
        <CardHeader className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center justify-between pb-4">
          <CardTitle className="text-2xl font-bold">Stock Requests</CardTitle>
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <Input
                placeholder="Search by ID"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-[200px] text-sm"
              />
              <select
                className="h-8 sm:h-10 rounded-md border border-input bg-background px-3 py-1 text-sm sm:text-base"
                value={filters.status}
                onChange={(e) =>
                  onFilterChange({ ...filters, status: e.target.value })
                }
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Button
                variant="outline"
                onClick={onDownloadSelected}
                className={clsx(
                  "text-xs sm:text-sm",
                  selectedRequests.size > 0 ? "visible" : "invisible"
                )}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  handleDeleteConfirmation(Array.from(selectedRequests))
                }
                className={clsx(
                  "text-xs sm:text-sm",
                  selectedRequests.size > 0 ? "visible" : "invisible"
                )}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                className="text-xs sm:text-sm"
                onClick={onNewRequestClick}
              >
                <Plus className="mr-1 h-4 w-4" />
                New Request
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto h-[calc(100vh-13rem)]">
          <Table>
            <TableHeader>
              <TableRow className="text-center">
                <TableHead className="w-[50px] text-center">
                  <Checkbox
                    checked={selectedRequests.size === requests.length}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Outlet Name</TableHead>
                <TableHead className="text-center">Dispatch ID</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Created At</TableHead>
                <TableHead className="text-center">Delivery Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow key={request._id || index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRequests.has(request._id)}
                      onCheckedChange={(checked) =>
                        onSelectRequest(request._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {request._id || "N/A"}
                  </TableCell>
                  <TableCell>{request.outletId?.outletName || "N/A"}</TableCell>
                  <TableCell>
                    {request.stockDetails
                      ?.map((detail) => `${detail.weight || "N/A"} KG`)
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    {request.stockDetails
                      ?.map((detail) => detail.quantity || "N/A")
                      .join(", ")}
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span
                          className={
                            request.status === "Pending"
                              ? "text-yellow-500"
                              : request.status === "Approved"
                              ? "text-orange-500"
                              : request.status === "Delivered"
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {request.status}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>Status: {request.status}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(request._id, "Pending")}
                    >
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleStatusChange(request._id, "Approved")
                      }
                    >
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleStatusChange(request._id, "Delivered")
                      }
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleStatusChange(request._id, "Rejected")
                      }
                    >
                      <XCircle className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(request)}
                      disabled={
                        !["Pending", "Approved"].includes(request.status)
                      } // Disable edit for non-pending and non-approved requests
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteConfirmation([request._id])} // Open the confirmation modal
                      disabled={request.status === "Pending"} // Disable delete for pending requests
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status Change Confirmation Dialog */}
      <Dialog
        open={statusChangeDialogOpen}
        onOpenChange={(open) => setStatusChangeDialogOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to change the status to{" "}
            {statusChangeRequest?.newStatus}?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setStatusChangeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmStatusChange}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmationOpen}
        onOpenChange={(open) => setDeleteConfirmationOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the selected{" "}
            {selectedRequests.size > 1 ? "requests" : "request"}?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmationOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
