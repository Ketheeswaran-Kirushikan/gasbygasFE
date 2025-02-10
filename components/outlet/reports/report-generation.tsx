"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk } from "@/app/Redux/features/userSlice";
import { getAllGasRequestsByOutletThunk } from "@/app/Redux/features/gasRequestSlice";
import { getOutletByIdThunk } from "@/app/Redux/features/outletSlice";
import { RootState, AppDispatch } from "@/app/Redux/store/store";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "react-toastify/dist/ReactToastify.css";
import { Download, Trash, Eye } from "lucide-react";
import { useTranslation } from "@/hooks/outlet/use-translation";

type ReportType = "stock" | "Gas Request" | "users";

interface Report {
  id: string;
  type: ReportType;
  startDate: string;
  endDate: string;
  generatedAt: string;
}

export function ReportGeneration() {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const { id: outletId } = useParams(); // Get Outlet ID from URL

  // Fetch data from Redux state
  const { users } = useSelector((state: RootState) => state.user);
  const { gasRequests } = useSelector((state: RootState) => state.gasRequests);
  const { outlet } = useSelector((state: RootState) => state.outlets);

  // State variables
  const [reportType, setReportType] = useState<ReportType>("stock");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;

  useEffect(() => {
    dispatch(getAllUsersThunk());
    dispatch(getAllGasRequestsByOutletThunk(outletId));
    dispatch(getOutletByIdThunk(outletId));
  }, [dispatch, outletId]);

  // Format date function (YYYY-MM-DD)
  const formatDate = (date: string) =>
    new Date(date).toISOString().split("T")[0];

  // Filter data based on createdAt field
  const filterDataByDate = (data: any[], start: string, end: string) => {
    return data.filter((item) => {
      const createdAt = formatDate(item.createdAt);
      return createdAt >= start && createdAt <= end;
    });
  };

  const generateReport = () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    let generatedData: any[] = [];

    switch (reportType) {
      case "users":
        if (users?.allUsers) {
          console.log("All Users:", users.allUsers); // Debugging Log

          // ✅ Only select users with `userType` as "consumer" (Exclude "businessIndustry")
          generatedData = filterDataByDate(
            users.allUsers.filter((user) => {
              const userType = user?.userType?.trim().toLowerCase();
              console.log("Checking userType:", userType); // Debugging Log
              return userType === "consumer"; // ✅ Exclude "businessIndustry"
            }),
            startDate,
            endDate
          );

          console.log("Filtered Consumers:", generatedData); // Debugging Log
        }
        break;

      case "Gas Request":
        generatedData = filterDataByDate(gasRequests || [], startDate, endDate);
        break;

      case "stock":
        generatedData = filterDataByDate(
          outlet?.gasStock || [],
          startDate,
          endDate
        );
        break;

      default:
        break;
    }

    if (generatedData.length === 0) {
      toast.error("No data available for the selected report type!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType,
      startDate,
      endDate,
      generatedAt: new Date().toISOString().split("T")[0],
    };

    setReports([newReport, ...reports]);
    toast.success("Report generated successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
    toast.success("Report deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDownloadReport = (report: Report) => {
    let data: any[] = [];
    let columns: string[] = [];

    switch (report.type) {
      case "users":
        // ✅ Filter only "consumer" users
        data = filterDataByDate(
          (users?.allUsers || []).filter(
            (user) => user?.userType?.trim().toLowerCase() === "consumer"
          ),
          report.startDate,
          report.endDate
        ).map((user) => [
          user.firstName || "-",
          user.lastName || "-",
          user.email?.replace(/\s+/g, " ").trim() || "-", // Clean email formatting
          user.phoneNumber || "-",
          formatDate(user.createdAt),
        ]);

        columns = [
          "First Name",
          "Last Name",
          "Email",
          "Phone Number",
          "Created At",
        ];
        break;

      case "Gas Request":
        data = filterDataByDate(
          gasRequests || [],
          report.startDate,
          report.endDate
        ).map((request) => [
          request.referenceNumber || "-",
          request.gasType || "-",
          request.quantity || "-",
          request.price || "-",
          request.status || "-",
          formatDate(request.createdAt),
        ]);

        columns = [
          "Reference Number",
          "Gas Type",
          "Quantity",
          "Price",
          "Status",
          "Created At",
        ];
        break;

      case "stock":
        data = filterDataByDate(
          outlet?.gasStock || [],
          report.startDate,
          report.endDate
        ).map((stock) => [
          stock.id || "-",
          stock.gasType || "-",
          stock.quantity || "-",
          formatDate(stock.updatedAt),
        ]);

        columns = [
          "Stock ID",
          "Gas Type",
          "Available Quantity",
          "Last Updated",
        ];
        break;

      default:
        toast.error("Invalid report type!");
        return;
    }

    if (data.length === 0) {
      toast.error("No data available for this report!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // ✅ Create PDF document
    const doc = new jsPDF();
    doc.text(`Report: ${report.type}`, 14, 10);

    // ✅ Generate table in PDF with smaller font size
    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: data,
      styles: { fontSize: 8 }, // 🔥 Reduce font size
      columnStyles: {
        2: { cellWidth: 60 }, // Set wider column for email
      },
    });

    doc.save(`${report.type}_Report_${report.generatedAt}.pdf`);
    toast.success("PDF Report Downloaded Successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
};


  // Pagination Logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Generate New Report")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value as ReportType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("Select report type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">{t("Stock Report")}</SelectItem>
                <SelectItem value="Gas Request">
                  {t("Gas Request Report")}
                </SelectItem>
                <SelectItem value="users">{t("Users Report")}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button onClick={generateReport}>{t("Generate Report")}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("Report History")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Type")}</TableHead>
                <TableHead>{t("Start Date")}</TableHead>
                <TableHead>{t("End Date")}</TableHead>
                <TableHead>{t("Generated At")}</TableHead>
                <TableHead>{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.startDate}</TableCell>
                  <TableCell>{report.endDate}</TableCell>
                  <TableCell>{report.generatedAt}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadReport(report)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
