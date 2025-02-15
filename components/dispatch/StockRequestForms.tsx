"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Redux/store/store";
import { getAllOutletsThunk } from "@/app/Redux/features/outletSlice";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { StockRequest } from "../../app/dispatch/[id]/scheduled-deliveries/page";

interface DeliveryRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: Partial<StockRequest>) => void;
}

interface Outlet {
  _id: string;
  outletName: string;
  outletAddress: string;
  registrationNumber: string;
  emailAddress: string;
  userType: string;
  gasStock: {
    gasType: string;
    weight: number;
    quantity: number;
    price: number;
    individualPrice: number;
  }[];
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

export default function DeliveryRequestForm({
  isOpen,
  onClose,
  onSubmit,
}: DeliveryRequestFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { outlets } = useSelector((state: RootState) => state.outlets);
  const { id: dispatchId } = useParams();

  const [newRequest, setNewRequest] = useState<Partial<StockRequest>>({
    outletId: "",
    dispatchId: dispatchId as string,
    stockDetails: [
      {
        gasType: "Domestic",
        weight: 0,
        quantity: 0,
        price: 0,
        individualPrice: 0,
      },
    ],
    status: "Pending",
    createdAt: new Date().toISOString(),
    deliveryDate: "",
  });

  useEffect(() => {
    dispatch(getAllOutletsThunk());
  }, [dispatch]);

  const businessUsers = outlets?.filter(
    (outlet: Outlet) => outlet.userType === "outlet"
  );

  const handleSubmit = () => {
    if (!newRequest.outletId) {
      toast.error("Please select an outlet.");
      return;
    }

    if (
      newRequest.stockDetails.some(
        (detail) =>
          detail.weight <= 0 || detail.quantity <= 0 || detail.price <= 0
      )
    ) {
      toast.error("Ensure all stock details are valid.");
      return;
    }

    onSubmit(newRequest);
    onClose();
  };

  const handleStockDetailChange = (
    index: number,
    field: keyof StockRequest["stockDetails"][0],
    value: any
  ) => {
    const updatedStockDetails = [...newRequest.stockDetails];
    updatedStockDetails[index][field] = value;

    if (field === "weight" || field === "quantity") {
      const selectedGasType = updatedStockDetails[index].gasType;
      const selectedKg = updatedStockDetails[index].weight;
      const selectedQuantity = updatedStockDetails[index].quantity;

      const selectedOption = quantityOptions[selectedGasType].find(
        (option) => option.kg === selectedKg
      );
      if (selectedOption) {
        updatedStockDetails[index].price = selectedOption.price;
        updatedStockDetails[index].individualPrice =
          selectedOption.price * selectedQuantity;
      }
    }

    setNewRequest({ ...newRequest, stockDetails: updatedStockDetails });
  };

  const handleGasTypeChange = (index: number, gasType: string) => {
    const updatedStockDetails = [...newRequest.stockDetails];
    updatedStockDetails[index].gasType = gasType;
    updatedStockDetails[index].weight = 0;
    updatedStockDetails[index].quantity = 0;
    updatedStockDetails[index].price = 0;
    updatedStockDetails[index].individualPrice = 0;

    setNewRequest({ ...newRequest, stockDetails: updatedStockDetails });
  };

  const addStockDetail = () => {
    setNewRequest({
      ...newRequest,
      stockDetails: [
        ...newRequest.stockDetails,
        {
          gasType: "Domestic",
          weight: 0,
          quantity: 0,
          price: 0,
          individualPrice: 0,
        },
      ],
    });
  };

  const removeStockDetail = (index: number) => {
    const updatedStockDetails = newRequest.stockDetails.filter(
      (_, i) => i !== index
    );
    setNewRequest({ ...newRequest, stockDetails: updatedStockDetails });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add New Stock Request</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] overflow-y-auto space-y-4 px-2">
          <div>
            <label className="text-sm font-medium">Select Outlet</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={newRequest.outletId}
              onChange={(e) =>
                setNewRequest({ ...newRequest, outletId: e.target.value })
              }
            >
              <option value="">Select an outlet</option>
              {businessUsers?.map((outlet: Outlet) => (
                <option key={outlet._id} value={outlet._id}>
                  {outlet.outletName} ({outlet.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          {newRequest.stockDetails.map((detail, index) => (
            <div key={index} className="space-y-4 border p-4 rounded-md">
              <div>
                <label className="text-sm font-medium">Gas Type</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={detail.gasType}
                  onChange={(e) => handleGasTypeChange(index, e.target.value)}
                >
                  <option value="Domestic">Domestic</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Weight (KG)</label>
                <select
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={detail.weight}
                  onChange={(e) =>
                    handleStockDetailChange(
                      index,
                      "weight",
                      parseFloat(e.target.value)
                    )
                  }
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
                  value={detail.quantity}
                  onChange={(e) =>
                    handleStockDetailChange(
                      index,
                      "quantity",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Per Gas Type Price
                </label>
                <Input type="number" value={detail.price} disabled />
              </div>

              <div>
                <label className="text-sm font-medium">Total Gas Price</label>
                <Input type="number" value={detail.individualPrice} disabled />
              </div>

              {index > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => removeStockDetail(index)}
                >
                  Remove Item
                </Button>
              )}
            </div>
          ))}
          {/* Delivery Date */}
          <div>
            <label className="text-sm font-medium">Delivery Date</label>
            <Input
              type="date"
              value={
                newRequest.deliveryDate
                  ? new Date(newRequest.deliveryDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setNewRequest({ ...newRequest, deliveryDate: e.target.value })
              }
            />
          </div>
          <div>
  <Button onClick={addStockDetail} variant="outline" className="text-green-600 border-green-600">
    Add Stock Item
  </Button>
</div>
<div className="flex flex-row items-end justify-end">
  <Button onClick={handleSubmit}>
    Submit Request
  </Button>
</div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
