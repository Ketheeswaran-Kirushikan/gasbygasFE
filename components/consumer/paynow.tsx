import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateGasRequestThunk } from "@/app/Redux/features/gasRequestSlice";

const PaymentModal = ({ open, onClose, referenceNumber, price }) => {
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("cash payment");
  const [cashPaymentDate, setCashPaymentDate] = useState("");
  const [file, setfile] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    csv: "",
    expiryDate: "",
    cardholderName: "",
  });

  useEffect(() => {
    setPaymentMethod("cash payment"); // Default to "cash payment"
  }, [open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setfile(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("paymentOption", paymentMethod);

    if (paymentMethod === "cash payment") {
      if (!cashPaymentDate) {
        toast.error("Please select a cash payment date.");
        return;
      }
      formData.append("cashPaymentDate", cashPaymentDate);
    } else if (paymentMethod === "bank transfer") {
      if (!file) {
        toast.error("Please upload a receipt file.");
        return;
      }
      formData.append("file", file); // File upload
    } else if (paymentMethod === "online payment") {
      const { cardNumber, csv, expiryDate, cardholderName } = cardDetails;
      if (!cardNumber || !csv || !expiryDate || !cardholderName) {
        toast.error("Please fill in all card details.");
        return;
      }
      formData.append("paymentStatus", "completed");
      formData.append("handoverEmptyCylinder", "true");
      formData.append("cardDetails", JSON.stringify(cardDetails)); // Convert card details to JSON
    }

    try {
      await dispatch(updateGasRequestThunk({ referenceNumber, formData }));
      toast.success("Payment updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update payment.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Payment Method Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash payment">Cash Payment</SelectItem>
                <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                <SelectItem value="online payment">Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Inputs Based on Payment Method */}
          {paymentMethod === "cash payment" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cash Payment Date
              </label>
              <Input
                type="date"
                value={cashPaymentDate}
                onChange={(e) => setCashPaymentDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {paymentMethod === "bank transfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Receipt or PDF
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG, or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  Uploaded: {file.name}
                </p>
              )}
            </div>
          )}

          {paymentMethod === "online payment" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <Input type="text" value={price} readOnly className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Card Number
                </label>
                <Input
                  type="text"
                  maxLength="16"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      cardNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CSV
                </label>
                <Input
                  type="text"
                  maxLength="3"
                  value={cardDetails.csv}
                  onChange={(e) =>
                    setCardDetails((prev) => ({ ...prev, csv: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <Input
                  type="month"
                  value={cardDetails.expiryDate}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cardholder Name
                </label>
                <Input
                  type="text"
                  value={cardDetails.cardholderName}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      cardholderName: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className={`${
              paymentMethod === "online payment"
                ? "bg-green-600"
                : "bg-blue-600"
            } text-white`}
          >
            {paymentMethod === "online payment" ? "Pay Now" : "Submit"}
          </Button>
          <Button onClick={onClose} className="bg-gray-600 text-white">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
