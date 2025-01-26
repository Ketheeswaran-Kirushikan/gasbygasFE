import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TranslatedText } from "@/components/ui/translated-text"
import { GasRequest } from '@/lib/mock-data'

interface RequestDetailsDialogProps {
  request: GasRequest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsDialog({ request, open, onOpenChange }: RequestDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <TranslatedText text="Request Details" />
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold"><TranslatedText text="Token ID:" /></span>
            <span className="col-span-3">{request.tokenId}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold"><TranslatedText text="Type:" /></span>
            <span className="col-span-3">
              <TranslatedText text={request.type} />
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold"><TranslatedText text="Quantity:" /></span>
            <span className="col-span-3">
              <TranslatedText text="{quantity} KG" params={{ quantity: request.quantity.toString() }} />
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold"><TranslatedText text="Delivery Date:" /></span>
            <span className="col-span-3">{new Date(request.deliveryDate).toLocaleDateString()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold"><TranslatedText text="Status:" /></span>
            <span className="col-span-3">
              <TranslatedText text={request.status} />
            </span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold"><TranslatedText text="Outlet Location:" /></span>
            <span className="col-span-3">{request.outletLocation}</span>
          </div>
          {request.message && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold"><TranslatedText text="Message:" /></span>
              <span className="col-span-3">{request.message}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

