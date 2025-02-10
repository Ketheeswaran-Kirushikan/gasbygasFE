"use client";

import { Request, CustomerType, GasType, RequestStatus } from '@/Types/outlet/index';
import { useTranslation } from '@/hooks/outlet/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from "@/lib/outlet/utils";

interface DeliveryDetailsViewProps {
  request: {
    _id: string;
    referenceNumber: string;
    customerType: CustomerType;
    gasType: GasType;
    gasWeight: number;
    quantity: number;
    status: RequestStatus;
    poDocumentUrl?: string;
    createdAt: string;
    deliveryDate: string;
  };
}

export function DeliveryDetailsView({ request }: DeliveryDetailsViewProps) {
  const { t } = useTranslation();

  if (!request) {
    return <p className="text-center text-gray-500">{t("No request data available.")}</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("Delivery Details")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Token ID */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Token ID")}</p>
            <p>{request.referenceNumber}</p>
          </div>

          {/* Customer Type */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Customer Type")}</p>
            <p>{t(request.customerType)}</p>
          </div>

          {/* Gas Type */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Gas Type")}</p>
            <p>{t(request.gasType)}</p>
          </div>

          {/* Gas Weight */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Gas Weight")}</p>
            <p>{request.gasWeight} KG</p>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Quantity")}</p>
            <p>{request.quantity}</p>
          </div>

          {/* Request Status */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Status")}</p>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                {
                  "bg-yellow-100 text-yellow-800": request.status === "pending",
                  "bg-green-100 text-green-800": request.status === "delivered",
                  "bg-blue-100 text-blue-800": request.status === "approved",
                  "bg-red-100 text-red-800": request.status === "cancelled",
                }
              )}
            >
              {t(request.status)}
            </span>
          </div>

          {/* Request Created Date */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Request Date")}</p>
            <p>{new Date(request.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Expected Delivery Date */}
          <div>
            <p className="text-sm font-medium text-gray-500">{t("Delivery Date")}</p>
            <p>{new Date(request.deliveryDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* PO Document for Business Customers */}
        {request.customerType === "Business" && (
          <div>
            <p className="text-sm font-medium text-gray-500">{t("PO Document")}</p>
            {request.poDocumentUrl ? (
              <a
                href={request.poDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {t("View PO Document")}
              </a>
            ) : (
              <p>{t("No PO Document uploaded")}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
