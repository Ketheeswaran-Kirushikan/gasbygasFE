"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Layout } from "@/components/dispatch/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { AppDispatch, RootState } from "@/app/Redux/store/store";
import { getDispatchByIdThunk } from "@/app/Redux/features/dispatchSlice";
import { getStockRequestsByDispatch } from "@/app/Redux/features/stockSlice";
import { getAllGasRequestsByDispatchThunk } from "@/app/Redux/features/gasRequestSlice"; // New thunk

export default function AnalyticsPage() {
  const { id } = useParams(); // Get dispatch ID from URL
  const dispatch = useDispatch<AppDispatch>();

  // Fetch dispatch, stock requests, and gas requests
  useEffect(() => {
    if (id) {
      dispatch(getDispatchByIdThunk(id));
      dispatch(getStockRequestsByDispatch(id));
      dispatch(getAllGasRequestsByDispatchThunk(id)); // Fetch gas requests
    }
  }, [dispatch, id]);

  // Access data from Redux store
  const { dispatchDetails } = useSelector((state: RootState) => state.dispatch);
  const { stockRequests } = useSelector((state: RootState) => state.stockRequest);
  const { gasRequests } = useSelector((state: RootState) => state.gasRequests);

  console.log("Dispatch Details:", dispatchDetails); // Debugging
  console.log("Stock Requests:", stockRequests); // Debugging
  console.log("Gas Requests:", gasRequests); // Debugging

  // ✅ 1. Dispatch Stock Details (Available Stock)
  const dispatchStockData = dispatchDetails?.gasStock || [];

  // ✅ 2. Outlet Stock Requests for Dispatch (Requests per outlet)
  const outletStockRequests = useMemo(() => {
    const data = {};
    stockRequests.forEach(req => {
      const outletName = req.outletId?.outletName || "Unknown Outlet";
      if (!data[outletName]) {
        data[outletName] = { outlet: outletName, totalQuantity: 0 };
      }
      req.stockDetails.forEach(detail => {
        data[outletName].totalQuantity += detail.quantity;
      });
    });
    return Object.values(data);
  }, [stockRequests]);

  // ✅ 3. Total Deliveries for Stock Requests (Delivered stock per month)
  const totalDeliveries = useMemo(() => {
    const monthlyData = {};
    stockRequests.forEach(req => {
      const month = new Date(req.deliveryDate).toLocaleString("en-US", { month: "short" });
      if (!monthlyData[month]) {
        monthlyData[month] = { month, deliveredGas: 0 };
      }
      req.stockDetails.forEach(detail => {
        monthlyData[month].deliveredGas += detail.quantity;
      });
    });
    return Object.values(monthlyData);
  }, [stockRequests]);

  // ✅ 4. Gas Requests by Consumers & Businesses (Request count per type)
  const gasRequestsData = useMemo(() => {
    return [
      { category: "Consumers", count: gasRequests.filter(req => req.userDetails?.userType
        === "Consumer").length },
      { category: "businessIndustry", count: gasRequests.filter(req => req.userDetails?.userType
        === "businessIndustry").length }
    ];
  }, [gasRequests]);

  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2">
        {/* ✅ 1. Dispatch Gas Stock (Available Stock) */}
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Stock Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dispatchStockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gasType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
                <Bar dataKey="price" fill="#82ca9d" name="Price" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ✅ 2. Outlet Stock Requests for Dispatch */}
        <Card>
          <CardHeader>
            <CardTitle>Outlet Stock Requests for Dispatch</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={outletStockRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="outlet" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalQuantity" fill="#0088FE" name="Total Stock Requested" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ✅ 3. Total Deliveries for Stock Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Total Deliveries for Stock Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={totalDeliveries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="deliveredGas" stroke="#FF8042" name="Total Delivered" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ✅ 4. Gas Requests by Consumers & Businesses */}
        <Card>
          <CardHeader>
            <CardTitle>Gas Requests by Consumers & Business Industries</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gasRequestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#00C49F" name="Total Requests" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
