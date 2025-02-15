import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Redux/store/store";
import { getAllUsersThunk } from "@/app/Redux/features/userSlice";
import { toast } from "react-toastify";
import { useParams } from "next/navigation"; // Import useParams

interface DeliveryRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: Partial<DeliveryRequest>) => void;
}

interface User {
  _id: string;
  companyName: string;
  registerNumber: string;
  role: string;
}

export default function DeliveryRequestForm({ isOpen, onClose, onSubmit }: DeliveryRequestFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error } = useSelector((state: RootState) => state.user);
  const { id:dispatchId } = useParams(); // Extract dispatchId from URL params

  const [newRequest, setNewRequest] = useState<Partial<DeliveryRequest>>({
    gasType: "Domestic",
    status: "approved",
    gasWeight: 12.5,
    quantity: 0,
    price: 0,
    paymentOption: "cash payment",
    paymentStatus: "pending", // Default payment status
    handoverEmptyCylinder: false,
    message: "",
    userDetails: "", // Store the selected user ID here
    dispatchDetails: dispatchId, // Set dispatchDetails from URL params
    file: null, // Add a file field to the state
  });

  // Fetch all users on component mount
  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  // Filter users to show only business industries
  const businessUsers = users?.allUsers?.filter((user: User) => user.userType === "businessIndustry");

  const handleSubmit = () => {
    if (!newRequest.userDetails) {
      toast.error("Please select a business user.");
      return;
    }

    // Remove deliveryDate from the newRequest object before submission
    const { deliveryDate, ...requestWithoutDate } = newRequest;

    onSubmit(requestWithoutDate); // Submit the request without deliveryDate
    onClose();
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewRequest({ ...newRequest, file });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Delivery Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Business User Dropdown */}
          <div>
            <label className="text-sm font-medium">Select Business</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={newRequest.userDetails}
              onChange={(e) =>
                setNewRequest({ ...newRequest, userDetails: e.target.value })
              }
            >
              <option value="">Select a business</option>
              {businessUsers?.map((user: User) => (
                <option key={user._id} value={user._id}>
                  {user.companyName} ({user.registerNumber})
                </option>
              ))}
            </select>
          </div>

          {/* type Dropdown */}
          <div>
            <label className="text-sm font-medium">type</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={newRequest.type}
              onChange={(e) =>
                setNewRequest({ ...newRequest, type: e.target.value as "Domestic" | "Industrial" })
              }
            >
              <option value="Domestic">Domestic</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>

          {/* Gas Weight Dropdown */}
          <div>
            <label className="text-sm font-medium">Gas Weight</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={newRequest.gasWeight}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  gasWeight: e.target.value as "5 KG" | "12.5 KG" | "37.5 KG",
                })
              }
            >
              <option value="5">5 KG</option>
              <option value="12.5">12.5 KG</option>
              <option value="37.5">37.5 KG</option>
            </select>
          </div>

          {/* Quantity (Units) Input */}
          <div>
            <label className="text-sm font-medium">Quantity (Units)</label>
            <Input
              type="number"
              value={newRequest.quantity || ""}
              onChange={(e) => setNewRequest({ ...newRequest, quantity: Number(e.target.value) })}
            />
          </div>

          {/* Price Input */}
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={newRequest.price || ""}
              onChange={(e) => setNewRequest({ ...newRequest, price: Number(e.target.value) })}
            />
          </div>

          {/* Payment Option Dropdown */}
          <div>
            <label className="text-sm font-medium">Payment Option</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={newRequest.paymentOption}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  paymentOption: e.target.value as "cash payment" | "bank transfer" | "online payment",
                })
              }
            >
              <option value="cash payment">Cash Payment</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="online payment">Online Payment</option>
            </select>
          </div>

          {/* Payment Status Dropdown */}
          <div>
            <label className="text-sm font-medium">Payment Status</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={newRequest.paymentStatus}
              onChange={(e) =>
                setNewRequest({
                  ...newRequest,
                  paymentStatus: e.target.value as "pending" | "completed" | "failed",
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Handover Empty Cylinder Checkbox */}
          <div>
            <label className="text-sm font-medium">Handover Empty Cylinder</label>
            <Checkbox
              checked={newRequest.handoverEmptyCylinder || false}
              onCheckedChange={(checked) =>
                setNewRequest({ ...newRequest, handoverEmptyCylinder: checked as boolean })
              }
            />
          </div>

          {/* File Upload Input */}
          <div>
            <label className="text-sm font-medium">Upload File</label>
            <Input
              type="file"
              onChange={handleFileChange}
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="text-sm font-medium">Message</label>
            <Input
              value={newRequest.message || ""}
              onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <Button onClick={handleSubmit}>Add Request</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}