"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { StockRequest } from "../../app/dispatch/[id]/scheduled-deliveries/page";

interface DeliveryRequestEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedRequest: Partial<StockRequest>) => void;
  request: StockRequest | null;
}

const quantityOptions = {
  Domestic: [
    { kg: 5, label: "5 KG", price: 1000 },
    { kg: 12.5, label: "12.5 KG", price: 2500 },
    { kg: 37.5, label: "37.5 KG", price: 7500 },
  ],
  Industrial: [
    { kg: 5, label: "5 KG", price: 1000 },
    { kg: 12.5, label: "12.5 KG", price: 2500 },
    { kg: 37.5, label: "37.5 KG", price: 7500 },
  ],
};

export default function DeliveryRequestEditForm({
  isOpen,
  onClose,
  onSubmit,
  request,
}: DeliveryRequestEditFormProps) {
  const [updatedRequest, setUpdatedRequest] = useState<StockRequest | null>(null);

  useEffect(() => {
    if (request) {
      setUpdatedRequest({ ...request });
    }
  }, [request]);

  if (!updatedRequest) return null;

  // ✅ Ensures stock details update correctly
  const handleStockDetailChange = (index: number, field: keyof StockRequest["stockDetails"][0], value: any) => {
    setUpdatedRequest((prev) => {
      if (!prev) return prev;
      const updatedStockDetails = [...prev.stockDetails];
      updatedStockDetails[index] = { ...updatedStockDetails[index], [field]: value };

      // ✅ Auto-update price when weight or quantity changes
      if (field === "weight" || field === "quantity") {
        const selectedGasType = updatedStockDetails[index].gasType;
        const selectedKg = updatedStockDetails[index].weight;
        const selectedQuantity = updatedStockDetails[index].quantity;

        const selectedOption = quantityOptions[selectedGasType]?.find(option => option.kg === selectedKg);
        if (selectedOption) {
          updatedStockDetails[index].price = selectedOption.price;
          updatedStockDetails[index].individualPrice = selectedOption.price * selectedQuantity;
        }
      }

      return { ...prev, stockDetails: updatedStockDetails };
    });
  };

  // ✅ Update delivery date field
  const handleDateChange = (value: string) => {
    setUpdatedRequest((prev) => prev ? { ...prev, deliveryDate: value } : prev);
  };

  // ✅ Ensure updates apply properly when submitting
  const handleSubmit = () => {
    if (updatedRequest.stockDetails.some(detail => detail.weight <= 0 || detail.quantity <= 0 || detail.price <= 0)) {
      toast.error("Ensure all stock details are valid.");
      return;
    }

    onSubmit(updatedRequest);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Stock Request</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] overflow-y-auto space-y-4 px-2">
          {/* Outlet Name (Non-Editable) */}
          <div>
            <label className="text-sm font-medium">Outlet</label>
            <Input type="text" value={updatedRequest.outletId?.outletName || ""} disabled />
          </div>

          {/* Stock Details */}
          {updatedRequest.stockDetails.map((detail, index) => (
            <div key={index} className="space-y-4 border p-4 rounded-md">
              <div>
                <label className="text-sm font-medium">Gas Type</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={detail.gasType}
                  onChange={(e) => handleStockDetailChange(index, "gasType", e.target.value)}
                >
                  <option value="Domestic">Domestic</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Weight (KG)</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={detail.weight || ""}
                  onChange={(e) => handleStockDetailChange(index, "weight", parseFloat(e.target.value))}
                >
                  <option value="">Select KG</option>
                  {quantityOptions[detail.gasType].map((option) => (
                    <option key={option.kg} value={option.kg}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={detail.quantity || ""}
                  onChange={(e) => handleStockDetailChange(index, "quantity", parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Per Gas Type Price</label>
                <Input type="number" value={detail.price || 0} disabled />
              </div>

              <div>
                <label className="text-sm font-medium">Total Gas Price</label>
                <Input type="number" value={detail.individualPrice || 0} disabled />
              </div>
            </div>
          ))}

          {/* Delivery Date (Editable) */}
          <div>
            <label className="text-sm font-medium">Delivery Date</label>
            <Input
              type="date"
              value={updatedRequest.deliveryDate ? new Date(updatedRequest.deliveryDate).toISOString().split("T")[0] : ""}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-row items-end justify-end">
            <Button onClick={handleSubmit}>Update Request</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
