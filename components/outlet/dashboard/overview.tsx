"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/outlet/ui/card";
import { ArrowDown, ArrowUp, Package, Truck } from "lucide-react";
import { useTranslation } from "@/hooks/outlet/use-translation";

export function DashboardOverview({ gasRequests, gasStock }) {
  const { t } = useTranslation();


  // Calculate total revenue (sum of prices for completed payment requests)
  const totalRevenue = gasRequests
    ?.filter((request) => request.paymentStatus === "completed")
    .reduce((sum, request) => sum + request.price, 0) || 0;

  // Count gas requests with status "delivered"
  const deliveriesToday = gasRequests?.filter((request) => request.status === "delivered").length || 0;

  // Count gas requests with status "approved" (pending orders)
  const pendingOrders = gasRequests?.filter((request) => request.status === "approved").length || 0;

  // Calculate total stock count
  const totalGasStock = gasStock?.reduce((total, stockItem) => total + stockItem.quantity, 0) || 0;

  // Low Stock Alerts (Placeholder for future feature)
  const lowStockItems = gasStock?.filter((item) => item.quantity === 0 || item.quantity < 5).length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {/* Pending Orders Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("Pending Orders")}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
        </CardContent>
      </Card>

      {/* Deliveries Today Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("Deliveries Today")}</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{deliveriesToday}</div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("Low Stock Alerts")}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems}</div>
        </CardContent>
      </Card>

      {/* Total Gas Stock Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("Total Gas Stock")}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGasStock}</div>
        </CardContent>
      </Card>

      {/* Total Revenue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t("Total Revenue")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
