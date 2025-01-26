import { Request, CustomerType, GasType, RequestStatus } from '@/types'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from "@/lib/utils"

interface DeliveryDetailsViewProps {
  request: Request
}

export function DeliveryDetailsView({ request }: DeliveryDetailsViewProps) {
  const { t } = useTranslation()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('Delivery Details')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">{t('Token ID')}</p>
            <p>{request.tokenId}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('Customer Type')}</p>
            <p>{t(request.customerType)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('Gas Type')}</p>
            <p>{t(request.gasType)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('Gas Weight')}</p>
            <p>{request.gasWeight}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('Quantity')}</p>
            <p>{request.quantity}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{t('Status')}</p>
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              {
                "bg-yellow-100 text-yellow-800": request.status === RequestStatus.PENDING,
                "bg-green-100 text-green-800": request.status === RequestStatus.DELIVERED,
                "bg-blue-100 text-blue-800": request.status === RequestStatus.CONFIRMED,
                "bg-red-100 text-red-800": request.status === RequestStatus.CANCELLED,
              }
            )}>
              {t(request.status)}
            </span>
          </div>
        </div>
        {request.customerType === CustomerType.BUSINESS && (
          <div>
            <p className="text-sm font-medium text-gray-500">{t('PO Document')}</p>
            {request.poDocumentUrl ? (
              <a href={request.poDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {t('View PO Document')}
              </a>
            ) : (
              <p>{t('No PO Document uploaded')}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

