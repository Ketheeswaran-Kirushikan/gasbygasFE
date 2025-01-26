'use client'

import { StockRequest } from '@/types/stock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface StockRequestViewProps {
  request: StockRequest
}

export function StockRequestView({ request }: StockRequestViewProps) {
  const handleDownload = () => {
    // In a real app, this would generate and download a PDF receipt
    console.log('Downloading receipt for request:', request.id)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Request ID</p>
              <p className="font-medium">{request.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Item ID</p>
              <p className="font-medium">{request.itemId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{request.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity (KG)</p>
              <p className="font-medium">{request.quantityKG} KG</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Units</p>
              <p className="font-medium">{request.quantity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{request.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(request.requestDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Requested By</p>
              <p className="font-medium">{request.requestedBy}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button onClick={handleDownload} className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Download Receipt
      </Button>
    </div>
  )
}

