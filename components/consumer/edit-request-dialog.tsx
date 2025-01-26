import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TranslatedText } from "@/components/ui/translated-text"
import { GasRequest } from '@/lib/mock-data'

// Predefined outlets
const outlets = [
  { id: 1, name: "Main Street Branch", position: [7.8731, 80.7718] },
  { id: 2, name: "Central Park Outlet", position: [6.9271, 79.8612] },
  { id: 3, name: "Harbor View Station", position: [6.0535, 80.2210] },
]

interface EditRequestDialogProps {
  request: GasRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedRequest: GasRequest) => void;
}

export function EditRequestDialog({ request, open, onOpenChange, onSave }: EditRequestDialogProps) {
  const [editingRequest, setEditingRequest] = useState<GasRequest | null>(request);

  useEffect(() => {
    setEditingRequest(request);
  }, [request]);

  const handleSave = () => {
    if (editingRequest) {
      onSave(editingRequest);
      onOpenChange(false);
    }
  };

  const translate = (text: string) => text; // Placeholder for translation function

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <TranslatedText text="Edit Request" />
          </DialogTitle>
        </DialogHeader>
        {editingRequest && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">
                <TranslatedText text="Quantity:" />
              </span>
              <Input
                type="number"
                value={editingRequest.quantity}
                onChange={(e) => setEditingRequest({...editingRequest, quantity: Number(e.target.value)})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">
                <TranslatedText text="Outlet:" />
              </span>
              <Select
                value={editingRequest.outletLocation}
                onValueChange={(value) => setEditingRequest({...editingRequest, outletLocation: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={translate("Select outlet")} />
                </SelectTrigger>
                <SelectContent>
                  {outlets.map((outlet) => (
                    <SelectItem key={outlet.id} value={outlet.name}>
                      {outlet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">
                <TranslatedText text="Delivery Date:" />
              </span>
              <Input
                type="date"
                value={editingRequest.deliveryDate}
                onChange={(e) => setEditingRequest({...editingRequest, deliveryDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">
                <TranslatedText text="Gas Weight:" />
              </span>
              <Select
                value={editingRequest.gasWeight}
                onValueChange={(value) => setEditingRequest({...editingRequest, gasWeight: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5kg">5 KG</SelectItem>
                  <SelectItem value="12.5kg">12.5 KG</SelectItem>
                  <SelectItem value="37.5kg">37.5 KG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">
                <TranslatedText text="Message:" />
              </span>
              <Input
                value={editingRequest.message || ''}
                onChange={(e) => setEditingRequest({...editingRequest, message: e.target.value})}
                className="col-span-3"
              />
            </div>
            <Button onClick={handleSave}>
              <TranslatedText text="Save Changes" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

