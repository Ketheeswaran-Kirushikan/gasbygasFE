import { cn } from "@/lib/utils"; // ✅ Importing cn utility (if it exists in utils)
// OR
import clsx from "clsx"; // ✅ Import clsx (alternative method)

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
} from "@/components/ui/tooltip"; // ✅ Import tooltip component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogActions,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DeliveryRequest {
  id: string;
  gasType: string;
  companyName: string;
  status: string;
  gasWeight: string;
  quantity: number;
}

interface DeliveryRequestsTableProps {
  requests: DeliveryRequest[];
  selectedRequests: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectRequest: (id: string, checked: boolean) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onEdit: (request: DeliveryRequest) => void;
  onView: (request: DeliveryRequest) => void;
  onDelete: (ids: string[]) => void;
  onDownloadSelected: () => void;
  filters: { gasType: string; status: string };
  onFilterChange: (filters: { gasType: string; status: string }) => void;
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
    setSelectedRequests(new Set(ids)); // Set the selected requests for deletion
    setDeleteConfirmationOpen(true); // Open the confirmation modal
  };

  const confirmDelete = () => {
    if (selectedRequests.size > 0) {
      onDelete(Array.from(selectedRequests)); // Convert Set to Array and pass to onDelete
      setSelectedRequests(new Set()); // Clear selection after delete
      setDeleteConfirmationOpen(false); // Close the modal
    } else {
      console.warn("No requests selected for deletion.");
    }
  };

  return (
    <>
      <Card className="flex-grow overflow-hidden">
        <CardHeader className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center justify-between pb-4">
          <CardTitle className="text-2xl font-bold">Gas Requests</CardTitle>
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <Input
                placeholder="Search by ID or Outlet"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-[200px] text-sm"
              />
              <select
                className="h-8 sm:h-10 rounded-md border border-input bg-background px-3 py-1 text-sm sm:text-base"
                value={filters.gasType}
                onChange={(e) =>
                  onFilterChange({ ...filters, gasType: e.target.value })
                }
              >
                <option value="All">All gasTypes</option>
                <option value="Domestic">Domestic</option>
                <option value="Industrial">Industrial</option>
              </select>
              <select
                className="h-8 sm:h-10 rounded-md border border-input bg-background px-3 py-1 text-sm sm:text-base"
                value={filters.status}
                onChange={(e) =>
                  onFilterChange({ ...filters, status: e.target.value })
                }
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="process">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="rejected">Rejected</option>
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
                onClick={() => handleDeleteConfirmation(Array.from(selectedRequests))}
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
                <TableHead className="text-center">gasType</TableHead>
                <TableHead className="text-center">Business</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Gas Weight</TableHead>
                <TableHead className="text-center">Quantity (Units)</TableHead>
                <TableHead className="text-center">Status Actions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRequests.has(request.id)}
                      onCheckedChange={(checked) =>
                        onSelectRequest(request.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {request.id}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        request.gasType === "Domestic"
                          ? "text-blue-500"
                          : "text-green-500"
                      }
                    >
                      {request.gasType}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {request.companyName}
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <span
                          className={
                            request.status === "pending"
                              ? "text-yellow-500"
                              : request.status === "approved"
                              ? "text-blue-500"
                              : request.status === "process"
                              ? "text-orange-500"
                              : request.status === "delivered"
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
                    {request.gasWeight}
                  </TableCell>
                  <TableCell className="text-center">
                    {request.quantity}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(request.id, "pending")}
                    >
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(request.id, "approved")}
                    >
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(request.id, "process")}
                    >
                      <Clock className="h-4 w-4 text-orange-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleStatusChange(request.id, "delivered")
                      }
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStatusChange(request.id, "rejected")}
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
                      disabled={!["pending", "approved"].includes(request.status)} // Disable edit for non-pending and non-approved requests
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteConfirmation([request.id])} // Open the confirmation modal
                      disabled={request.status === "pending"} // Disable delete for pending requests
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