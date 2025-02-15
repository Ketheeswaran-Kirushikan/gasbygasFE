import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface DeliveryRequestEditProps {
  request: DeliveryRequest | null;
  onClose: () => void;
  onSave: (request: DeliveryRequest) => void;
}

export default function DeliveryRequestEdit({ request, onClose, onSave }: DeliveryRequestEditProps) {
  const [editedRequest, setEditedRequest] = useState<DeliveryRequest | null>(request);

  useEffect(() => {
    setEditedRequest(request);
  }, [request]);

  const handleSave = () => {
    if (editedRequest) {
      onSave(editedRequest);
      onClose();
    }
  };

  if (!editedRequest) return null;

  // Helper function to format the date for the input field
  const formatDateForInput = (date: Date | string | null): string => {
    if (!date) return ""; // Handle null or undefined
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return ""; // Handle invalid dates
    return dateObj.toISOString().split("T")[0];
  };

  return (
    <Dialog open={!!editedRequest} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Delivery Request</DialogTitle>
        </DialogHeader>
        {/* Form with Two-Column Grid Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Column 1 */}
          <div>
            <label className="text-sm font-medium">ID</label>
            <Input value={editedRequest.id} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={editedRequest.type}
              onChange={(e) =>
                setEditedRequest({ ...editedRequest, type: e.target.value as "Domestic" | "Industrial" })
              }
            >
              <option value="Domestic">Domestic</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Business</label>
            <Input
              value={editedRequest.outlet}
              onChange={(e) => setEditedRequest({ ...editedRequest, outlet: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Gas Weight</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={editedRequest.gasWeight}
              onChange={(e) =>
                setEditedRequest({
                  ...editedRequest,
                  gasWeight: e.target.value as "5 KG" | "12.5 KG" | "37.5 KG",
                })
              }
            >
              <option value="5 KG">5 KG</option>
              <option value="12.5 KG">12.5 KG</option>
              <option value="37.5 KG">37.5 KG</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Quantity (Units)</label>
            <Input
              type="number"
              value={editedRequest.quantityUnits}
              onChange={(e) => setEditedRequest({ ...editedRequest, quantityUnits: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Price</label>
            <Input
              type="number"
              value={editedRequest.price}
              onChange={(e) => setEditedRequest({ ...editedRequest, price: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Payment Option</label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={editedRequest.paymentOption}
              onChange={(e) =>
                setEditedRequest({
                  ...editedRequest,
                  paymentOption: e.target.value as "cash payment" | "bank transfer" | "online payment",
                })
              }
            >
              <option value="cash payment">Cash Payment</option>
              <option value="bank transfer">Bank Transfer</option>
              <option value="online payment">Online Payment</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Handover Empty Cylinder</label>
            <Checkbox
              checked={editedRequest.handoverEmptyCylinder}
              onCheckedChange={(checked) =>
                setEditedRequest({ ...editedRequest, handoverEmptyCylinder: checked as boolean })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Delivery Date</label>
            <Input
              type="date"
              value={formatDateForInput(editedRequest.deliveryDate)}
              onChange={(e) => setEditedRequest({ ...editedRequest, deliveryDate: new Date(e.target.value) })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Message</label>
            <Input
              value={editedRequest.message}
              onChange={(e) => setEditedRequest({ ...editedRequest, message: e.target.value })}
            />
          </div>
        </div>

        {/* Button Section */}
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}