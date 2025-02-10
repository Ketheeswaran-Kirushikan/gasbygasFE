"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/Redux/store/store";
import { getAllGasRequestsByUserThunk } from "@/app/Redux/features/gasRequestSlice";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import { TranslatedText } from "@/components/consumer/ui/translated-text";
export default function MyRequests() {
  const dispatch = useDispatch();
  const { id: userID } = useParams();
  const { gasRequests, loading, error } = useSelector(
    (state: RootState) => state.gasRequests
  );
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  useEffect(() => {
    if (userID) {
      dispatch(getAllGasRequestsByUserThunk(userID));
    }
  }, [userID, dispatch]);
  const handleCloseModal = () => setSelectedRequest(null);
  // Return loading spinner while fetching data
  if (loading) {
    return <p>Loading...</p>;
  }
  // Check if there's an error or no data
  if (error || gasRequests.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500">
          <TranslatedText text="No data available." />
        </p>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">
        <TranslatedText text="My Requests" />
      </h1>

      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white border rounded-md shadow-sm">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">#</TableCell>
              <TableCell className="font-semibold">
                <TranslatedText text="Reference ID" />
              </TableCell>
              <TableCell className="font-semibold">
                <TranslatedText text="Gas Type" />
              </TableCell>
              <TableCell className="font-semibold">
                <TranslatedText text="Weight (KG)" />
              </TableCell>
              <TableCell className="font-semibold">
                <TranslatedText text="Quantity" />
              </TableCell>
              <TableCell className="font-semibold">
                <TranslatedText text="Price (LKR)" />
              </TableCell>
              <TableCell className="font-semibold">
                <TranslatedText text="Status" />
              </TableCell>
              <TableCell className="font-semibold">
                <TranslatedText text="Action" />
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gasRequests.map((request: any, index: number) => (
              <TableRow
                key={request.referenceNumber || index}
                className="hover:bg-gray-50"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{request.referenceNumber || "N/A"}</TableCell>
                <TableCell>{request.gasType || "N/A"}</TableCell>
                <TableCell>{request.gasWeight || "N/A"} KG</TableCell>
                <TableCell>{request.quantity || "N/A"}</TableCell>
                <TableCell>
                  {request.price ? request.price.toLocaleString() : "N/A"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : request.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <TranslatedText text={request.status || "N/A"} />
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <TranslatedText text="View" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* View Modal */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedRequest?.referenceNumber || "No Request Data"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <div>
                <strong>Gas Type:</strong>{" "}
                {typeof selectedRequest?.gasType === "string"
                  ? selectedRequest.gasType
                  : JSON.stringify(selectedRequest.gasType) || "N/A"}
              </div>
              <div>
                <strong>Weight (KG):</strong>{" "}
                {selectedRequest?.gasWeight || "N/A"}
              </div>
              <div>
                <strong>Quantity:</strong> {selectedRequest?.quantity || "N/A"}
              </div>
              <div>
                <strong>Price (LKR):</strong>{" "}
                {selectedRequest?.price
                  ? selectedRequest.price.toLocaleString()
                  : "N/A"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {typeof selectedRequest?.status === "string"
                  ? selectedRequest.status
                  : JSON.stringify(selectedRequest.status) || "N/A"}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {selectedRequest?.createdAt
                  ? new Date(selectedRequest.createdAt).toLocaleString()
                  : "N/A"}
              </div>
              {selectedRequest?.deliveryDate && (
                <div>
                  <strong>Delivery Date:</strong>{" "}
                  {new Date(selectedRequest.deliveryDate).toLocaleString()}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
