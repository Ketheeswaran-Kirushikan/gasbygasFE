"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGasRequestsByUserThunk } from "@/app/Redux/features/gasRequestSlice";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FuelIcon, Package, Clock, CheckCircle } from "lucide-react";
import GasRequestModal from "../[id]/request/page"; // Existing GasRequestModal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TranslatedText } from "@/components/consumer/ui/translated-text";
function StatCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: string;
  Icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          <TranslatedText text={title} />
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
function ViewGasRequestModal({
  isOpen,
  onClose,
  request,
}: {
  isOpen: boolean;
  onClose: () => void;
  request: any;
}) {
  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Gas Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <strong>Reference Number:</strong> {request.referenceNumber}
          </p>
          <p>
            <strong>Gas Type:</strong> {request.gasType}
          </p>
          <p>
            <strong>Gas Weight:</strong> {request.gasWeight} KG
          </p>
          <p>
            <strong>Quantity:</strong> {request.quantity}
          </p>
          <p>
            <strong>Price:</strong> LKR {request.price.toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {request.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function RecentRequests({
  requests,
  onRequestClick,
}: {
  requests: any[];
  onRequestClick: (request: any) => void;
}) {
  const latestRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);
  return (
    <Card>
      <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800">
          <TranslatedText text="Recent Requests" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white rounded-b-lg space-y-6">
        {latestRequests.map((request) => (
          <div
            key={request.referenceNumber}
            className="p-4 bg-gray-50 shadow-sm rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onRequestClick(request)}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-700">
                <TranslatedText
                  text="Gas Request {tokenId}"
                  params={{ tokenId: request.referenceNumber }}
                />
              </p>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                <p>
                  <TranslatedText
                    text="{quantity} {gasType} gas in {gasWeight} KG"
                    params={{
                      quantity: request.quantity,
                      gasType: request.gasType,
                      gasWeight: request.gasWeight,
                    }}
                  />
                </p>
                <p className="ml-5">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  request.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : request.status === "confirmed"
                    ? "bg-blue-100 text-blue-800"
                    : request.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <TranslatedText text={request.status} />
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default function ConsumerDashboard() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get user ID from the route params
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // New Gas Request Modal State
  const { gasRequests = [], loading } = useSelector(
    (state: any) => state.gasRequests
  );

  useEffect(() => {
    if (id) {
      dispatch(getAllGasRequestsByUserThunk(id))
        .unwrap()
        .catch((err) => console.error("Error fetching gas requests:", err));
    }
  }, [id, dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleRequestClick = (request: any) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div className="block sm:hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-c5kvOKVQpChQoykFwTBvuASMfQxh9V.png"
            alt="Company Logo"
            className="h-12 w-auto"
            crossOrigin="anonymous"
          />
        </div>

        <h1 className="text-3xl font-bold text-center sm:text-left">
          <TranslatedText text="Welcome Back!" />
        </h1>

        {gasRequests.length > 0 && (
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setIsRequestModalOpen(true)}
          >
            <FuelIcon className="mr-2 h-4 w-4" />
            <TranslatedText text="New Gas Request" />
          </Button>
        )}
      </div>

      {gasRequests.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Requests"
              value={gasRequests.length.toString()}
              Icon={Package}
            />
            <StatCard
              title="Pending"
              value={
                gasRequests.filter((request) => request.status === "pending")
                  .length
              }
              Icon={Clock}
            />
            <StatCard
              title="Delivered"
              value={
                gasRequests.filter((request) => request.status === "delivered")
                  .length
              }
              Icon={CheckCircle}
            />
          </div>
          <RecentRequests
            requests={gasRequests}
            onRequestClick={handleRequestClick}
          />
        </>
      ) : (
        <div className="text-center mt-8">
          <p className="text-lg font-medium text-gray-500">
            <TranslatedText text="You don’t have any gas requests yet." />
          </p>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              console.log("Opening Gas Request Modal");
              setIsRequestModalOpen(true);
            }}
          >
            <FuelIcon className="mr-2 h-4 w-4" />
            <TranslatedText text="New Gas Request" />
          </Button>
        </div>
      )}

      {/* View Gas Request Modal */}
      <ViewGasRequestModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        request={selectedRequest}
      />

      {/* New Gas Request Modal */}
      <GasRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}
