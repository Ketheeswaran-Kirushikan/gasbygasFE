'use client'

import { useApp } from '@/contexts/app-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, Package, Truck } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

export function DashboardOverview() {
  const { state } = useApp()
  const { t } = useTranslation()
  const pendingRequests = state.requests.filter(r => r.status === 'PENDING').length
  const deliveriesToday = state.requests.filter(r => r.status === 'DELIVERED').length
  const lowStockItems = state.stock.filter(s => s.quantity <= s.threshold).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('Pending Orders')}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRequests}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 inline-flex items-center">
              <ArrowDown className="h-4 w-4 mr-1" /> 3.2%
            </span>{' '}
            {t('from last month')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('Deliveries Today')}</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveriesToday}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> 12%
            </span>{' '}
            {t('from yesterday')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('Low Stock Alerts')}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 inline-flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> 1
            </span>{' '}
            {t('from last hour')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('Total Revenue')}</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 inline-flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" /> 5.4%
            </span>{' '}
            {t('from last month')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

