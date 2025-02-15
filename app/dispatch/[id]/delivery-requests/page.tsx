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
  getAllGasRequestsByDispatchThunk,
  createGasRequestThunk,
  updateGasRequestThunk,
  deleteGasRequestThunk,
} from "@/app/Redux/features/gasRequestSlice";
import DeliveryRequestsTable from "@/components/dispatch/DeliveryRequestsTable";
import DeliveryRequestForm from "@/components/dispatch/DeliveryRequestsForms";
import DeliveryRequestView from "@/components/dispatch/DeliveryRequestsView";
import DeliveryRequestEdit from "@/components/dispatch/DeliveryRequestsEdit";
import { AppDispatch, RootState } from "@/app/Redux/store/store"; // Import your Redux store types

export interface DeliveryRequest {
  id: string;
  type: "Domestic" | "Industrial";
  companyName: string;
  status: "pending" | "approved" | "process" | "delivered" | "rejected";
  gasWeight: "5 KG" | "12.5 KG" | "37.5 KG";
  quantity: number;
  price: number;
  paymentOption: "cash payment" | "bank transfer" | "online payment";
  paymentStatus: "pending" | "completed" | "failed";
  handoverEmptyCylinder: boolean;
  deliveryDate: Date | string;
  message: string;
}

export default function DeliveryRequestsPage() {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [filters, setFilters] = useState({ type: "All", status: "All" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRequest, setEditingRequest] = useState<DeliveryRequest | null>(
    null
  );
  const [viewingRequest, setViewingRequest] = useState<DeliveryRequest | null>(
    null
  );
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(
    new Set()
  );
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>(); // Typed dispatch
  const { id } = useParams();
  const { gasRequests, loading, error } = useSelector(
    (state: RootState) => state.gasRequests
  ); // Typed useSelector

  useEffect(() => {
    if (id) {
      dispatch(getAllGasRequestsByDispatchThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (gasRequests && gasRequests.length > 0) {
      const mappedRequests = gasRequests.map((request) => ({
        id: request.referenceNumber,
        gasType: request.gasType === "Domestic" ? "Domestic" : "Industrial",
        companyName: request.userDetails?.companyName || "N/A",
        status: request.status,
        gasWeight: `${request.gasWeight} KG`,
        quantity: request.quantity,
        price: request.price,
        paymentOption: request.paymentOption,
        paymentStatus: request.paymentStatus,
        handoverEmptyCylinder: request.handoverEmptyCylinder,
        deliveryDate: request.deliveryDate, // Ensure this is a Date object or string
        message: request.message,
      }));
      setRequests(mappedRequests);
    }
  }, [gasRequests]);

  const filteredRequests = requests.filter((request) => {
    const id = request.referenceNumber ? request.referenceNumber.toLowerCase() : "";
    const companyName = request.companyName ? request.companyName.toLowerCase() : "";
  
    return (
      (filters.type === "All" || request.type === filters.type) &&
      (filters.status === "All" || request.status === filters.status) &&
      (id.includes(searchTerm.toLowerCase()) || companyName.includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddNewRequest = (newRequest: Partial<DeliveryRequest>) => {
    dispatch(createGasRequestThunk(newRequest))
      .unwrap()
      .then(() => {
      })
      .catch((error) => {
      });
  };
  const handleStatusChange = (id: string, newStatus: string) => {
    dispatch(
      updateGasRequestThunk({
        referenceNumber: id,
        formData: { status: newStatus },
      })
    )
      .unwrap()
      .then(() => {
  
      })
      .catch((error) => {
      });
  };

  const handleDelete = (ids: string[]) => {
    ids.forEach((id) => {
      console.log("Deleting Request with Reference Number:", id); // ✅ Log the reference number before deleting
  
      dispatch(deleteGasRequestThunk(id)) // Pass `id` directly as the argument
        .unwrap()
        .then(() => {
        })
        .catch((error) => {
        });
    });
  };
  

  const handleEdit = (request: DeliveryRequest) => {
    setEditingRequest(request);
  };

  const handleView = (request: DeliveryRequest) => {
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

  const handleDownloadSelected = () => {
    const selectedData = requests.filter((r) => selectedRequests.has(r.id));
    const csv = [
      [
        "ID",
        "Type",
        "Business",
        "Status",
        "Quantity (Units)",
        "Price",
        "Payment Option",
        "Payment Status",
        "Handover Empty Cylinder",
        "Delivery Date",
        "Message",
      ],
      ...selectedData.map((r) => [
        r.id,
        r.type,
        r.companyName,
        r.status,
        r.quantity.toString(),
        r.price.toString(),
        r.paymentOption,
        r.paymentStatus,
        r.handoverEmptyCylinder.toString(),
        r.deliveryDate instanceof Date
          ? r.deliveryDate.toDateString()
          : r.deliveryDate,
        r.message,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "delivery_requests.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSaveEdit = (request: DeliveryRequest) => {
    dispatch(
      updateGasRequestThunk({ referenceNumber: request.id, formData: request })
    )
      .unwrap()
      .then(() => {
        setEditingRequest(null);
      })
      .catch((error) => {
      });
  };

  const handleDownloadSingle = (request: DeliveryRequest) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Delivery Request Details", 15, 15);

    // Data
    const data = [
      ["ID", request.id],
      ["Type", request.type],
      ["Business", request.companyName],
      ["Status", request.status],
      ["Gas Weight", request.gasWeight],
      ["Quantity (Units)", request.quantity.toString()],
      ["Price", `Rs. ${request.price.toFixed(2)}`],
      ["Payment Option", request.paymentOption],
      ["Payment Status", request.paymentStatus],
      ["Handover Empty Cylinder", request.handoverEmptyCylinder ? "Yes" : "No"],
      [
        "Delivery Date",
        request.deliveryDate instanceof Date
          ? request.deliveryDate.toDateString()
          : request.deliveryDate,
      ],
      ["Message", request.message || "N/A"],
    ];

    // Add data as a table
    doc.autoTable({
      startY: 25,
      head: [["Field", "Value"]],
      body: data,
    });

    // Save as PDF
    doc.save(`delivery_request_${request.id}.pdf`);
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
          onDelete={handleDelete} // Pass the correct function
          onDownloadSelected={handleDownloadSelected}
          filters={filters}
          onFilterChange={setFilters}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewRequestClick={() => setIsNewRequestDialogOpen(true)}
          setSelectedRequests={setSelectedRequests} // Pass the setter function
          deleteConfirmationOpen={deleteConfirmationOpen}
          setDeleteConfirmationOpen={setDeleteConfirmationOpen}
        />
        <DeliveryRequestForm
          isOpen={isNewRequestDialogOpen}
          onClose={() => setIsNewRequestDialogOpen(false)}
          onSubmit={handleAddNewRequest}
        />
        <DeliveryRequestEdit
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          onSave={handleSaveEdit}
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