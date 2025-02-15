"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStockRequests } from "@/app/Redux/features/stockSlice";
import { getAllOutletsThunk } from "@/app/Redux/features/outletSlice";
import { getAllUsersThunk } from "@/app/Redux/features/userSlice";
import Link from "next/link";
import { Layout } from "@/components/dispatch/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { stockRequests, loading: stockLoading, error: stockError } = useSelector(
    (state) => state.stockRequest
  );
  const { outlets, loading: outletLoading, error: outletError } = useSelector(
    (state) => state.outlets
  );
  const { users, loading: userLoading, error: userError } = useSelector(
    (state) => state.user
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(getAllStockRequests());
    dispatch(getAllOutletsThunk());
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  const todayDate = dayjs().format("YYYY-MM-DD");
  const todayRequests = stockRequests.filter(
    (req) => dayjs(req.createdAt).format("YYYY-MM-DD") === todayDate
  );
  const latestStockRequests = stockRequests.slice(-3).reverse();
  const deliveredStocks = stockRequests.filter((req) => req.status === "Delivered");
  const totalRevenue = deliveredStocks.reduce((total, request) => {
    return total + request.stockDetails.reduce((sum, stock) => sum + stock.price, 0);
  }, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Overview Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Overview Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Requests (Today)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {todayRequests.length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stockRequests.filter((req) => req.status === "pending")
                      .length || 0}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Deliveries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{deliveredStocks.length || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    Rs: {totalRevenue.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Recent Stock Requests */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <CardTitle>Latest Stock Requests</CardTitle>
            <Link href="/stock-requests">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STOCK ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Outlet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gas Weight</TableHead>
                    <TableHead>Total Quantity (Units)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : stockError ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-red-500"
                      >
                        {stockError}
                      </TableCell>
                    </TableRow>
                  ) : latestStockRequests.length > 0 ? (
                    latestStockRequests.map((request) => {
                      const totalQuantity = request.stockDetails.reduce(
                        (sum, stock) => sum + stock.quantity,
                        0
                      );
                      return (
                        <TableRow key={request._id}>
                          <TableCell className="font-medium">
                            {request._id}
                          </TableCell>
                          <TableCell>
                            {request.stockDetails.map((stock, index) => (
                              <div
                                key={index}
                                className={
                                  stock.gasType === "Domestic"
                                    ? "text-blue-500"
                                    : "text-green-500"
                                }
                              >
                                {stock.gasType}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>{request.outletId.outletName}</TableCell>
                          <TableCell>
                            {isClient && dayjs(request.createdAt).format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                request.status === "pending"
                                  ? "default"
                                  : request.status === "Delivered"
                                  ? "success"
                                  : "destructive"
                              }
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.stockDetails.map((stock, index) => (
                              <div key={index}>{stock.weight}kg</div>
                            ))}
                          </TableCell>
                          <TableCell>{totalQuantity}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        No stock requests available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Active Outlets & Users */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Outlets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Active outlets</span>
                <div className="text-xl sm:text-2xl font-bold">
                  {outletLoading ? "Loading..." : outlets.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Registered users</span>
                <div className="text-xl sm:text-2xl font-bold">
                  {userLoading ? "Loading..." : users?.allUsers?.length || 0}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}