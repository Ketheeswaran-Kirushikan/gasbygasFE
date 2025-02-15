import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

interface DeliveryRequestViewProps {
  request: DeliveryRequest | null;
  onClose: () => void;
  onDownload: (request: DeliveryRequest) => void;
}

export default function DeliveryRequestView({
  request,
  onClose,
  onDownload,
}: DeliveryRequestViewProps) {
  if (!request) return null;

  return (
    <Dialog open={!!request} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View Delivery Request</DialogTitle>
        </DialogHeader>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">ID</label>
              <Input value={request.id} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Input value={request.type} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Business</label>
              <Input value={request.outlet} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Input value={request.status} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Gas Weight</label>
              <Input value={request.gasWeight} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity (Units)</label>
              <Input value={request.quantityUnits} disabled />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input value={request.price} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Option</label>
              <Input value={request.paymentOption} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Payment Status</label>
              <Input value={request.paymentStatus} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">
                Handover Empty Cylinder
              </label>
              <Input
                value={request.handoverEmptyCylinder ? "Yes" : "No"}
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">Delivery Date</label>
              <Input
                value={new Date(request.deliveryDate).toDateString()}
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Input value={request.message} disabled />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => onDownload(request)} // ✅ Now correctly passed from parent
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
