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
    request: StockRequest | null; // Use the StockRequest interface
    onClose: () => void;
    onDownload: (request: StockRequest) => void;
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
            <DialogTitle>View Stock Request</DialogTitle>
          </DialogHeader>
  
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Request ID</label>
                <Input value={request._id} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Outlet ID</label>
                <Input value={request.outletId?.outletName} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Dispatch ID</label>
                <Input value={request.dispatchId} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Input value={request.status} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Created At</label>
                <Input
                  value={new Date(request.createdAt).toLocaleDateString()}
                  disabled
                />
              </div>
            </div>
  
            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Delivery Date</label>
                <Input
                  value={
                    request.deliveryDate
                      ? new Date(request.deliveryDate).toLocaleDateString()
                      : "N/A"
                  }
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Gas Type</label>
                <Input
                  value={request.stockDetails
                    .map((detail) => detail.gasType)
                    .join(", ")}
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Weight (KG)</label>
                <Input
                  value={request.stockDetails
                    .map((detail) => `${detail.weight} KG`)
                    .join(", ")}
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  value={request.stockDetails
                    .map((detail) => detail.quantity)
                    .join(", ")}
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  value={request.stockDetails
                    .map((detail) => `Rs. ${detail.price.toFixed(2)}`)
                    .join(", ")}
                  disabled
                />
              </div>
            </div>
          </div>
  
          {/* Download Button */}
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => onDownload(request)} // Trigger download
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }