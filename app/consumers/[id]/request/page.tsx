"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGasRequestThunk } from "@/app/Redux/features/gasRequestSlice";
import { getAllOutletsThunk } from "@/app/Redux/features/outletSlice";
import { getAllGasesThunk } from "@/app/Redux/features/gasSlice"; // Import the thunk
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1001/1001022.png",
  iconSize: [30, 30],
  iconAnchor: [15, 45],
  popupAnchor: [0, -45],
});

export default function GasRequestModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [selectedOutlet, setSelectedOutlet] = useState<null | {
    id: string;
    outletName: string;
  }>(null);
  const [type, setType] = useState("");
  const [gasWeight, setGasWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [noStockModal, setNoStockModal] = useState(false);
  const [availableStock, setAvailableStock] = useState<any[]>([]);

  const { outlets } = useSelector((state: any) => state.outlets);
  const { gases } = useSelector((state: any) => state.gas);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllOutletsThunk());
      dispatch(getAllGasesThunk());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (outlets.length > 0) {
      setMapCenter([outlets[0].latitude, outlets[0].longitude]);
    }
  }, [outlets]);

  useEffect(() => {
    const selectedGas = gases.find(
      (gas: any) => gas.type === type && gas.weight === gasWeight
    );
    if (selectedGas) {
      setPrice(selectedGas.price * quantity);
    }
  }, [type, gasWeight, quantity, gases]);

  const handleOutletClick = (outlet: any) => {
    const selectedGas = gases.find(
      (gas: any) => gas.type === type && gas.weight === gasWeight
    );

    if (!selectedGas) {
      setAvailableStock(
        outlet.gasStock.map((stock: any) => {
          const gasDetails = gases.find((gas: any) => gas._id === stock.gas);
          return {
            type: gasDetails?.type || "Unknown",
            weight: gasDetails?.weight || 0,
            quantity: stock.quantity,
          };
        })
      );
      setNoStockModal(true);
      return;
    }

    const stockItem = outlet.gasStock.find(
      (stock: any) => stock.gas === selectedGas._id
    );

    if (!stockItem || stockItem.quantity < quantity) {
      setAvailableStock(
        outlet.gasStock.map((stock: any) => {
          const gasDetails = gases.find((gas: any) => gas._id === stock.gas);
          return {
            type: gasDetails?.type || "Unknown",
            weight: gasDetails?.weight || 0,
            quantity: stock.quantity,
          };
        })
      );
      setNoStockModal(true);
      return;
    }

    setSelectedOutlet({ id: outlet._id, outletName: outlet.outletName });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOutlet) {
      alert("Please select an outlet");
      return;
    }

    const formData = {
      gasType: type,
      gasWeight,
      quantity,
      price,
      userDetails: id,
      outletDetails: selectedOutlet.id,
      message,
    };

    dispatch(createGasRequestThunk(formData))
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Error creating gas request:", error);
      });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-xl max-h-[90vh] p-10">
          <DialogHeader>
            <DialogTitle>New Gas Request</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-h-[80vh] overflow-y-auto scrollbar-hide"
          >
            {/* Gas Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Gas Type</label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gas type" />
                </SelectTrigger>
                <SelectContent>
                  {[...new Set(gases.map((gas: any) => gas.type))].map(
                    (gasType) => (
                      <SelectItem key={gasType} value={gasType}>
                        {gasType}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Gas Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Gas Weight (KG)</label>
              <Select
                value={gasWeight.toString()}
                onValueChange={(value) => setGasWeight(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gas weight" />
                </SelectTrigger>
                <SelectContent>
                  {gases
                    .filter((gas: any) => gas.type === type)
                    .map((gas: any) => (
                      <SelectItem
                        key={gas.weight}
                        value={gas.weight.toString()}
                      >
                        {gas.weight} KG
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                type="text"
                value={`LKR ${price.toLocaleString()}`}
                readOnly
                className="font-semibold bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Outlet Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Outlet</label>
              <div className="h-64 w-full">
                {mapCenter && (
                  <MapContainer
                    center={mapCenter}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {outlets.map((outlet: any) => (
                      <Marker
                        key={outlet._id}
                        position={[outlet.latitude, outlet.longitude]}
                        icon={customIcon}
                        eventHandlers={{
                          click: () => handleOutletClick(outlet),
                        }}
                      >
                        <Popup>{outlet.outletName}</Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
              </div>
              {selectedOutlet && (
                <p className="text-sm font-medium mt-2">
                  Selected Outlet: {selectedOutlet.outletName}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Message/Comment (Optional)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter any additional instructions or comments"
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* No Stock Modal */}
      <Dialog
        open={noStockModal}
        onOpenChange={(open) => !open && setNoStockModal(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Stock Available</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              The selected gas type and weight are unavailable at this outlet.
            </p>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Available Stock:</h3>
              {availableStock.filter((stock) => stock.quantity > 0).length >
              0 ? (
                <ul className="list-disc list-inside text-sm">
                  {availableStock
                    .filter((stock) => stock.quantity > 0) // Filter out stocks with quantity === 0
                    .map((stock) => (
                      <li key={`${stock.type}-${stock.weight}`}>
                        {stock.type} - {stock.weight} KG: {stock.quantity} units
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">
                  No stocks available at this outlet.
                </p>
              )}
            </div>
            <p className="text-sm text-gray-600">
              You can select another gas or another outlet.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setNoStockModal(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
