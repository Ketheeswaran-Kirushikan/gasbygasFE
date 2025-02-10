"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  getStockRequestsByOutlet,
  createStockRequest,
  updateStockRequestById,
  deleteStockRequestById,
} from "@/app/Redux/features/stockSlice";
import { RootState } from "@/app/Redux/store/store";
import { Search, Pencil, Eye, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StockRequestForm } from "./stock-request-form";
import { StockRequestView } from "./stock-request-view";
import { useTranslation } from "@/hooks/outlet/use-translation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function StockManagement() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const outletId = id as string;

  const { stockRequests, loading, error } = useSelector(
    (state: RootState) => state.stockRequest
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [editingRequest, setEditingRequest] = useState<StockRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null);

  useEffect(() => {
    if (outletId) {
      dispatch(getStockRequestsByOutlet(outletId));
    }
  }, [dispatch, outletId]);

  const filteredRequests = stockRequests.filter((request: StockRequest) =>
    request._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Delivered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleCreateStockRequest = (data: StockRequest) => {
    dispatch(createStockRequest(data));
  };

  const handleUpdateStockRequest = (data: StockRequest) => {
    if (editingRequest) {
      dispatch(updateStockRequestById({ id: editingRequest._id, data }));
      setEditingRequest(null);
    }
  };

  const handleDeleteStockRequest = (id: string) => {
    dispatch(deleteStockRequestById(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t("Stock Management")}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#6366F1] hover:bg-[#5558E3]">
              <Plus className="h-4 w-4 mr-2" />
              {t("New Request")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("New Stock Request")}</DialogTitle>
            </DialogHeader>
            <StockRequestForm onSubmit={handleCreateStockRequest} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading && <p className="text-center">{t("Loading stock requests...")}</p>}
          {error && <p className="text-center text-red-600">{t("Error fetching stock requests!")}</p>}

          {!loading && !error && (
            <>
              <Input
                placeholder={t("Search by Request ID...")}
                className="mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Stock Request ID")}</TableHead>
                    <TableHead>{t("Gas Types & Quantities")}</TableHead>
                    <TableHead>{t("Total Price (LKR)")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead>{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request._id}</TableCell>
                      <TableCell>
                        {request.stockDetails.map((gas, index) => (
                          <div key={index}>{`${gas.gasType} - ${gas.weight}KG x ${gas.quantity}`}</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {request.stockDetails.reduce((acc, gas) => acc + gas.price, 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === "Pending" && (
                            <>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingRequest(request)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <DialogHeader>
                                    <DialogTitle>{t("Edit Stock Request")}</DialogTitle>
                                  </DialogHeader>
                                  <StockRequestForm initialData={editingRequest} isEditing onSubmit={handleUpdateStockRequest} />
                                </DialogContent>
                              </Dialog>

                              <Button variant="ghost" size="icon" onClick={() => handleDeleteStockRequest(request._id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(request)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>{t("Stock Request Details")}</DialogTitle>
                              </DialogHeader>
                              <StockRequestView request={selectedRequest} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
