"use client";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "@/components/dispatch/layout";
import {
  getStockRequestsByDispatch,
  createStockRequest,
  updateStockRequestById,
  deleteStockRequestById,
} from "@/app/Redux/features/stockSlice";
import DeliveryRequestsTable from "@/components/dispatch/StockRequestTable";
import DeliveryRequestForm from "@/components/dispatch/StockRequestForms";
import DeliveryRequestView from "@/components/dispatch/StockRequestView";
import DeliveryRequestEditForm from "@/components/dispatch/StockRequestEdit";
import { AppDispatch, RootState } from "@/app/Redux/store/store"; // Import Redux types

export interface StockRequest {
  id: string;
  outletId: string;
  dispatchId: string;
  stockDetails: {
    gasType: "Domestic" | "Industrial";
    weight: number;
    quantity: number;
    price: number;
    individualPrice: number;
  }[];
  createdAt: Date | string;
  deliveryDate: Date | string;
  status: "Pending" | "Approved" | "Rejected" | "Delivered";
}

export default function DeliveryRequestsPage() {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [filters, setFilters] = useState({ status: "All" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRequest, setEditingRequest] = useState<StockRequest | null>(
    null
  );
  const [viewingRequest, setViewingRequest] = useState<StockRequest | null>(
    null
  );
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(
    new Set()
  );
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { stockRequests, loading, error } = useSelector(
    (state: RootState) => state.stockRequest
  );

  useEffect(() => {
    if (id) {
      dispatch(getStockRequestsByDispatch(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (stockRequests && stockRequests.length > 0) {
      setRequests(stockRequests);
    }
  }, [stockRequests]);

  const filteredRequests = requests.filter((request) => {
    const id = request.id ? request.id.toString().toLowerCase() : ""; // ✅ Ensure `request.id` is a string
    const search = searchTerm.toLowerCase();

    return (
      (filters.status === "All" || request.status === filters.status) &&
      id.includes(search)
    );
  });
  useEffect(() => {
    if (stockRequests && stockRequests.length > 0) {
      setRequests(stockRequests);

      // ✅ Loop through each request and log the outlet name
      stockRequests.forEach((request, index) => {
        console.log(
          `Request ${index + 1} - Outlet Name:`,
          request.outletId?.outletName || "N/A"
        );
      });
    }
  }, [stockRequests]);

  const handleAddNewRequest = (newRequest: Partial<StockRequest>) => {
    dispatch(createStockRequest(newRequest))
      .unwrap()
      .then(() => {
        toast.success(`New stock request created successfully!`);
      })
      .catch((error) => {
        toast.error(`Failed to create request: ${error.message}`);
      });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    dispatch(updateStockRequestById({ id, data: { status: newStatus } }))
      .unwrap()
      .then(() => {
        toast.success(`Request ${id} updated to ${newStatus}`);
      })
      .catch((error) => {
        toast.error(`Failed to update request: ${error.message}`);
      });
  };

  const handleDelete = (ids: string[]) => {
    ids.forEach((id) => {
      dispatch(deleteStockRequestById(id))
        .unwrap()
        .then(() => {
        })
        .catch((error) => {
        
        });
    });
  };
  const handleEdit = (request: StockRequest) => {
    setEditingRequest(request);
  };
  const handleEditRequest = (updatedRequest: Partial<StockRequest>) => {
    if (editingRequest) {
      dispatch(updateStockRequestById({ id: editingRequest.id, data: updatedRequest }))
        .unwrap()
        .then(() => {
          toast.success(`Request ${editingRequest.id} updated successfully!`);
          setEditingRequest(null);
        })
        .catch((error) => {
          toast.error(`Failed to update request: ${error.message}`);
        });
    }
  };
  const handleView = (request: StockRequest) => {
    setViewingRequest(request);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(new Set(filteredRequests.map((r) => r.id)));
    } else {
      setSelectedRequests(new Set());
    }
  };

  const handleSelectRequest = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRequests);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRequests(newSelected);
  };

  const handleDownloadSingle = (request: StockRequest) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Stock Request Details", 15, 15);

    const data = [
      ["Stock ID", request._id],
      ["Outlet Name", request.outletId?.outletName || "N/A"], // ✅ Fix: Properly accessing the outlet name
      ["Dispatch ID", request.dispatchId],
      ["Status", request.status],
      ["Created At", new Date(request.createdAt).toDateString()],
      [
        "Delivery Date",
        request.deliveryDate
          ? new Date(request.deliveryDate).toDateString()
          : "N/A",
      ],
    ];

    request.stockDetails.forEach((detail, index) => {
      data.push(
        [`Item ${index + 1} - Gas Type`, detail.gasType],
        [`Item ${index + 1} - Weight`, `${detail.weight} KG`],
        [`Item ${index + 1} - Quantity`, detail.quantity.toString()],
        [`Item ${index + 1} - Price`, `Rs. ${detail.price.toFixed(2)}`]
      );
    });

    doc.autoTable({
      startY: 25,
      head: [["Field", "Value"]],
      body: data,
    });

    doc.save(`stock_request_${request.id}.pdf`);
  };

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <DeliveryRequestsTable
          requests={filteredRequests}
          selectedRequests={selectedRequests}
          onSelectAll={handleSelectAll}
          onSelectRequest={handleSelectRequest}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          filters={filters}
          onFilterChange={setFilters}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewRequestClick={() => setIsNewRequestDialogOpen(true)}
        />
        <DeliveryRequestForm
          isOpen={isNewRequestDialogOpen}
          onClose={() => setIsNewRequestDialogOpen(false)}
          onSubmit={handleAddNewRequest}
        />
        <DeliveryRequestEditForm
          isOpen={!!editingRequest}
          onClose={() => setEditingRequest(null)}
          onSubmit={(updatedRequest) => {
            dispatch(
              updateStockRequestById({
                id: editingRequest!._id,
                data: updatedRequest,
              })
            )
              .unwrap()
              .then(() => {
                toast.success(
                  `Request ${editingRequest!.id} updated successfully!`
                );
                setEditingRequest(null);
              })
              .catch((error) => {
                toast.error(`Failed to update request: ${error.message}`);
              });
          }}
          request={editingRequest}
        />
        <DeliveryRequestView
          request={viewingRequest}
          onClose={() => setViewingRequest(null)}
          onDownload={handleDownloadSingle}
        />
      </div>
    </Layout>
  );
}
