"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk } from "@/app/Redux/features/userSlice";
import { getAllGasRequestsByOutletThunk } from "@/app/Redux/features/gasRequestSlice";
import { getOutletByIdThunk } from "@/app/Redux/features/outletSlice";
import { RootState, AppDispatch } from "@/app/Redux/store/store";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/outlet/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/outlet/ui/select";
import { Button } from "@/components/outlet/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { DatabaseGraphGenerator } from "./database-graph-generator";
import { useTranslation } from "@/hooks/outlet/use-translation";

export function AnalyticsDashboard() {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { id: outletId } = useParams();

  // Fetch data from Redux state
  const { users } = useSelector((state: RootState) => state.user);
  const { gasRequests } = useSelector((state: RootState) => state.gasRequests);
  const { outlet } = useSelector((state: RootState) => state.outlets);

  const [selectedGraphType, setSelectedGraphType] = useState("bar");
  const [databaseGraphs, setDatabaseGraphs] = useState<JSX.Element[]>([]);

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getAllGasRequestsByOutletThunk(outletId));
    dispatch(getOutletByIdThunk(outletId));
  }, [dispatch, outletId]);

  console.log("Gas Requests:", gasRequests);
  console.log("Outlet Data:", outlet);

  // ✅ Process Gas Request Status Data
  const gasRequestStatusData = gasRequests?.length
    ? [
        { name: "Pending", value: gasRequests.filter((req) => req.status === "pending").length },
        { name: "Approved", value: gasRequests.filter((req) => req.status === "approved").length },
        { name: "Process", value: gasRequests.filter((req) => req.status === "process").length },
        { name: "Delivered", value: gasRequests.filter((req) => req.status === "Delivered").length },
        { name: "Rejected", value: gasRequests.filter((req) => req.status === "Rejected").length },
      ]
    : [];

  // ✅ Process Stock Data from Outlet (Fix)
  const stockData =
    outlet?.outlet?.gasStock?.length > 0
      ? outlet?.outlet?.gasStock.map((stock) => ({
          name: `${stock.gasType} (${stock.weight}kg)`,
          value: stock.quantity?.$numberInt || stock.quantity?.$numberDouble || stock.quantity,
        }))
      : [];

  // ✅ Process Sales Data from Gas Requests
  const salesData = gasRequests?.length
    ? gasRequests.reduce((acc, request) => {
        const month = new Date(request.createdAt).toLocaleString("default", { month: "short" });
        const existingMonth = acc.find((entry) => entry.month === month);
        if (existingMonth) {
          existingMonth[request.gasType] = (existingMonth[request.gasType] || 0) + request.quantity;
        } else {
          acc.push({ month, [request.gasType]: request.quantity });
        }
        return acc;
      }, [])
    : [];

  const renderGraph = (type: string, data: any[], dataKey: string = "value") => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey={dataKey} data={data} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t("Analytics Dashboard")}</h1>
        <Select value={selectedGraphType} onValueChange={setSelectedGraphType}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("Graph Type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">{t("Bar")}</SelectItem>
            <SelectItem value="line">{t("Line")}</SelectItem>
            <SelectItem value="pie">{t("Pie")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("Stock Overview")}</CardTitle>
          </CardHeader>
          <CardContent>{renderGraph(selectedGraphType, stockData)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Gas Request Status")}</CardTitle>
          </CardHeader>
          <CardContent>{renderGraph(selectedGraphType, gasRequestStatusData)}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Sales by Gas Type")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(salesData[0] || {})
                  .filter((key) => key !== "month")
                  .map((gasType) => (
                    <Bar key={gasType} dataKey={gasType} fill={gasType === "Domestic" ? "#8884d8" : gasType === "Industrial" ? "#82ca9d" : "#ffc658"} />
                  ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <DatabaseGraphGenerator onGenerateGraph={(graph) => setDatabaseGraphs([...databaseGraphs, graph])} />

      {databaseGraphs.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {databaseGraphs.map((graph, index) => (
            <Card key={index}>
              <CardContent>{graph}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
