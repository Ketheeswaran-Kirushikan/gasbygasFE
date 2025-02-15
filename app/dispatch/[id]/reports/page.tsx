"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Layout } from "@/components/dispatch/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppDispatch, RootState } from "@/app/Redux/store/store";
import { getDispatchByIdThunk } from "@/app/Redux/features/dispatchSlice";
import { getStockRequestsByDispatch } from "@/app/Redux/features/stockSlice";
import { getAllGasRequestsByDispatchThunk } from "@/app/Redux/features/gasRequestSlice";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

export default function StockReport() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id) {
      dispatch(getDispatchByIdThunk(id));
      dispatch(getStockRequestsByDispatch(id));
      dispatch(getAllGasRequestsByDispatchThunk(id));
    }
  }, [dispatch, id]);

  const { dispatchDetails } = useSelector((state: RootState) => state.dispatch);
  const { stockRequests } = useSelector((state: RootState) => state.stockRequest);
  const { gasRequests } = useSelector((state: RootState) => state.gasRequests);

  console.log("Dispatch Details:", dispatchDetails);
  console.log("Stock Requests:", stockRequests);
  console.log("Gas Requests:", gasRequests);

  // ✅ Prepare Data for Tables
  const dispatchStockData = dispatchDetails?.gasStock || [];

  const outletStockRequests = stockRequests.map(req => ({
    outlet: req.outletId?.outletName || "Unknown Outlet",
    totalQuantity: req.stockDetails.reduce((sum, item) => sum + item.quantity, 0),
  }));

  const totalDeliveries = stockRequests.map(req => ({
    month: new Date(req.deliveryDate).toLocaleString("en-US", { month: "short" }),
    deliveredGas: req.stockDetails.reduce((sum, item) => sum + item.quantity, 0),
  }));

  const gasRequestsData = [
    { category: "Consumers", count: gasRequests.filter(req => req.customerType === "Consumer").length },
    { category: "Business/Industry", count: gasRequests.filter(req => req.customerType === "Business/Industry").length },
  ];

  // ✅ Generate PDF Report with Table
  const generatePDF = useCallback((data, title, headers) => {
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("GAS MANAGEMENT REPORT", 14, 15);

    pdf.setFontSize(12);
    pdf.text(`Report Title: ${title}`, 14, 25);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 32);

    pdf.autoTable({
      startY: 40,
      head: [headers],
      body: data.map(item => Object.values(item)),
      theme: "striped",
    });

    pdf.setFontSize(10);
    pdf.text("This report is generated for internal business analysis.", 14, pdf.autoTable.previous.finalY + 10);
    pdf.text("© 2025 Gas Management System - All Rights Reserved", 14, pdf.autoTable.previous.finalY + 15);

    pdf.save(`${title.replace(/\s+/g, "_")}_Report.pdf`);
    toast.success(`${title} Report saved successfully!`);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Report Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* ✅ 1. Dispatch Gas Stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Dispatch Stock Details</CardTitle>
                  <Button
                    onClick={() => generatePDF(dispatchStockData, "Dispatch Stock Details", ["Gas Type", "Quantity"])}
                    className="mt-2"
                  >
                    Generate Report
                  </Button>
                </CardHeader>
                <CardContent>
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Gas Type</th>
                        <th className="border border-gray-300 p-2">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dispatchStockData.map((item, index) => (
                        <tr key={index} className="border border-gray-200">
                          <td className="p-2">{item.gasType}</td>
                          <td className="p-2">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* ✅ 2. Outlet Stock Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Outlet Stock Requests</CardTitle>
                  <Button
                    onClick={() => generatePDF(outletStockRequests, "Outlet Stock Requests", ["Outlet", "Total Quantity"])}
                    className="mt-2"
                  >
                    Generate Report
                  </Button>
                </CardHeader>
                <CardContent>
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Outlet</th>
                        <th className="border border-gray-300 p-2">Total Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outletStockRequests.map((item, index) => (
                        <tr key={index} className="border border-gray-200">
                          <td className="p-2">{item.outlet}</td>
                          <td className="p-2">{item.totalQuantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* ✅ 3. Total Deliveries */}
              <Card>
                <CardHeader>
                  <CardTitle>Total Deliveries</CardTitle>
                  <Button
                    onClick={() => generatePDF(totalDeliveries, "Total Deliveries", ["Month", "Delivered Gas"])}
                    className="mt-2"
                  >
                    Generate Report
                  </Button>
                </CardHeader>
                <CardContent>
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Month</th>
                        <th className="border border-gray-300 p-2">Delivered Gas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalDeliveries.map((item, index) => (
                        <tr key={index} className="border border-gray-200">
                          <td className="p-2">{item.month}</td>
                          <td className="p-2">{item.deliveredGas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* ✅ 4. Gas Requests Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Gas Requests Breakdown</CardTitle>
                  <Button
                    onClick={() => generatePDF(gasRequestsData, "Gas Requests Breakdown", ["Category", "Total Requests"])}
                    className="mt-2"
                  >
                    Generate Report
                  </Button>
                </CardHeader>
                <CardContent>
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Category</th>
                        <th className="border border-gray-300 p-2">Total Requests</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gasRequestsData.map((item, index) => (
                        <tr key={index} className="border border-gray-200">
                          <td className="p-2">{item.category}</td>
                          <td className="p-2">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
