"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Define StockRequestView Props
interface StockRequestViewProps {
  request: {
    _id: string;
    status: string;
    createdAt: string;
    deliveryDate: string;
    stockDetails: {
      gasType: string;
      weight: number;
      quantity: number;
      price: number;
    }[];
  };
}

export function StockRequestView({ request }: StockRequestViewProps) {
  if (!request) return <p className="text-center">No request data available</p>;

  const handleDownload = () => {
    console.log("Downloading receipt for request:", request._id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Request ID */}
            <div>
              <p className="text-sm text-gray-500">Request ID</p>
              <p className="font-medium">{request._id}</p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">{request.status}</p>
            </div>

            {/* Request Date */}
            <div>
              <p className="text-sm text-gray-500">Request Date</p>
              <p className="font-medium">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Delivery Date */}
            <div>
              <p className="text-sm text-gray-500">Delivery Date</p>
              <p className="font-medium">
                {new Date(request.deliveryDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stock Details */}
          <div className="mt-4">
            <h3 className="text-md font-semibold">Stock Details</h3>
            <ul className="mt-2 space-y-2">
              {request.stockDetails.map((item, index) => (
                <li key={index} className="text-sm">
                  <strong>{item.gasType}</strong>: {item.weight}KG x{" "}
                  {item.quantity} units (LKR {item.price.toLocaleString()})
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <Button onClick={handleDownload} className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Download Receipt
      </Button>
    </div>
  );
}
