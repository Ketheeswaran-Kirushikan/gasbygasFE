"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the StockType enum
enum StockType {
  DOMESTIC = "Domestic",
  INDUSTRIAL = "Industrial",
}

// Define the StockRequest interface
interface StockRequest {
  _id?: string;
  stockDetails: GasType[];
  status: string;
  requestDate: string;
  requestedBy: string;
}

interface GasType {
  gasType: StockType;
  weight: number;
  quantity: number;
  price: number;
}

interface StockRequestFormProps {
  onSubmit: (request: StockRequest) => void;
  initialData?: StockRequest;
  isEditing?: boolean;
}

export function StockRequestForm({
  onSubmit,
  initialData,
  isEditing = false,
}: StockRequestFormProps) {
  const [formData, setFormData] = useState<StockRequest>({
    _id: initialData?._id || "",
    stockDetails: initialData?.stockDetails || [],
    status: initialData?.status || "Pending",
    requestDate: initialData?.requestDate || new Date().toISOString(),
    requestedBy: initialData?.requestedBy || "Current User",
  });
    const { id } = useParams(); // Get outletId dynamically from URL
    const outletId = id as string;
  // Define gas quantity options with unit prices
  const quantityOptions = {
    [StockType.DOMESTIC]: [
      { kg: 5, label: "5 KG", price: 1000 },
      { kg: 12.5, label: "12.5 KG", price: 2500 },
      { kg: 37.5, label: "37.5 KG", price: 7500 },
    ],
    [StockType.INDUSTRIAL]: [
      { kg: 5, label: "5 KG", price: 1000 },
      { kg: 12.5, label: "12.5 KG", price: 2500 },
      { kg: 37.5, label: "37.5 KG", price: 7500 },
    ],
  };

  // Handle gas type selection
  const handleCheckboxChange = (gasType: StockType, weight: number, price: number) => {
    const existingSelection = formData.stockDetails.find(
      (item) => item.gasType === gasType && item.weight === weight
    );

    if (existingSelection) {
      setFormData({
        ...formData,
        stockDetails: formData.stockDetails.filter(
          (item) => !(item.gasType === gasType && item.weight === weight)
        ),
      });
    } else {
      setFormData({
        ...formData,
        stockDetails: [...formData.stockDetails, { gasType, weight, price, quantity: 1 }],
      });
    }
  };

  // Handle quantity input change and update price dynamically
  const handleUnitChange = (gasType: StockType, weight: number, value: number, unitPrice: number) => {
    setFormData({
      ...formData,
      stockDetails: formData.stockDetails.map((item) =>
        item.gasType === gasType && item.weight === weight
          ? { ...item, quantity: value, price: unitPrice * value }
          : item
      ),
    });
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.stockDetails.length === 0) {
      toast.error("Please select at least one gas type.");
      return;
    }

    const formattedStockDetails = formData.stockDetails.map((item) => ({
      gasType: item.gasType,
      weight: Number(item.weight),
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    const newRequest: StockRequest = {
      outletId,
      dispatchId: "679126cf79e424f01192aa64", // Default Dispatch ID
      stockDetails: formattedStockDetails,
      status: formData.status,
      requestDate: formData.requestDate,
      requestedBy: formData.requestedBy,
    };

    console.log("Final Stock Request Object:", newRequest);
    onSubmit(newRequest);
    toast.success(
      isEditing ? "Stock request updated successfully!" : "Stock request submitted successfully!"
    );
  };

  // ✅ Ensure stockDetails is always an array (Fix hydration error)
  useEffect(() => {
    if (initialData) {
      console.log("Loading Existing Data:", initialData);
      setFormData({
        ...initialData,
        stockDetails: initialData.stockDetails || [],
      });
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Domestic Gas Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Domestic Gas</label>
        {quantityOptions[StockType.DOMESTIC].map((option) => (
          <div key={option.kg} className="flex items-center gap-2">
            <Checkbox
              checked={!!formData.stockDetails?.find(
                (item) => item.gasType === StockType.DOMESTIC && item.weight === option.kg
              )}
              onCheckedChange={() => handleCheckboxChange(StockType.DOMESTIC, option.kg, option.price)}
            />
            <span>
              {option.label} - LKR {option.price.toLocaleString()}
            </span>
            {formData.stockDetails.find(
              (item) => item.gasType === StockType.DOMESTIC && item.weight === option.kg
            ) && (
              <>
                <Input
                  type="number"
                  min="1"
                  value={
                    formData.stockDetails.find(
                      (item) => item.gasType === StockType.DOMESTIC && item.weight === option.kg
                    )?.quantity || 1
                  }
                  onChange={(e) =>
                    handleUnitChange(StockType.DOMESTIC, option.kg, parseInt(e.target.value), option.price)
                  }
                  className="w-16 ml-4"
                />
                {/* ✅ Display the updated total price dynamically */}
                <span className="ml-2 text-sm font-medium">
                  Price: LKR{" "}
                  {(
                    (formData.stockDetails.find(
                      (item) => item.gasType === StockType.DOMESTIC && item.weight === option.kg
                    )?.quantity || 1) * option.price
                  ).toLocaleString()}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Industrial Gas Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Industrial Gas</label>
        {quantityOptions[StockType.INDUSTRIAL].map((option) => (
          <div key={option.kg} className="flex items-center gap-2">
            <Checkbox
              checked={!!formData.stockDetails?.find(
                (item) => item.gasType === StockType.INDUSTRIAL && item.weight === option.kg
              )}
              onCheckedChange={() => handleCheckboxChange(StockType.INDUSTRIAL, option.kg, option.price)}
            />
            <span>
              {option.label} - LKR {option.price.toLocaleString()}
            </span>
            {formData.stockDetails.find(
              (item) => item.gasType === StockType.INDUSTRIAL && item.weight === option.kg
            ) && (
              <>
                <Input
                  type="number"
                  min="1"
                  value={
                    formData.stockDetails.find(
                      (item) => item.gasType === StockType.INDUSTRIAL && item.weight === option.kg
                    )?.quantity || 1
                  }
                  onChange={(e) =>
                    handleUnitChange(StockType.INDUSTRIAL, option.kg, parseInt(e.target.value), option.price)
                  }
                  className="w-16 ml-4"
                />
                {/* ✅ Display the updated total price dynamically */}
                <span className="ml-2 text-sm font-medium">
                  Price: LKR{" "}
                  {(
                    (formData.stockDetails.find(
                      (item) => item.gasType === StockType.INDUSTRIAL && item.weight === option.kg
                    )?.quantity || 1) * option.price
                  ).toLocaleString()}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? "Update Request" : "Submit Request"}
      </Button>
    </form>
  );
}
