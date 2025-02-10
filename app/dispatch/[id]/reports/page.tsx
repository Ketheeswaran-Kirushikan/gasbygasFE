"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, DownloadIcon } from 'lucide-react'
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Simulated data (you may want to fetch this from an API in a real application)
const generateStockData = () => [
  { date: '2023-01-01', name: 'Jan', predicted: 400, actual: 420 },
  { date: '2023-02-01', name: 'Feb', predicted: 350, actual: 380 },
  { date: '2023-03-01', name: 'Mar', predicted: 200, actual: 220 },
  { date: '2023-04-01', name: 'Apr', predicted: 280, actual: 270 },
  { date: '2023-05-01', name: 'May', predicted: 220, actual: 230 },
  { date: '2023-06-01', name: 'Jun', predicted: 250, actual: 240 },
]

const generatePerformanceData = () => [
  { date: '2023-06-05', day: 'Mon', onTime: 20, delayed: 5 },
  { date: '2023-06-06', day: 'Tue', onTime: 25, delayed: 3 },
  { date: '2023-06-07', day: 'Wed', onTime: 22, delayed: 7 },
  { date: '2023-06-08', day: 'Thu', onTime: 30, delayed: 2 },
  { date: '2023-06-09', day: 'Fri', onTime: 28, delayed: 4 },
  { date: '2023-06-10', day: 'Sat', onTime: 15, delayed: 1 },
  { date: '2023-06-11', day: 'Sun', onTime: 12, delayed: 1 },
]

const generateConsumptionData = () => [
  { date: '2023-06-01', name: '5kg', value: 400 },
  { date: '2023-06-01', name: '12.5kg', value: 300 },
  { date: '2023-06-01', name: '45kg', value: 200 },
]

const generateDriverPerformanceData = () => [
  { date: '2023-06-01', name: 'John', deliveries: 50, rating: 4.5 },
  { date: '2023-06-01', name: 'Sarah', deliveries: 45, rating: 4.8 },
  { date: '2023-06-01', name: 'Mike', deliveries: 55, rating: 4.2 },
  { date: '2023-06-01', name: 'Emma', deliveries: 40, rating: 4.7 },
  { date: '2023-06-01', name: 'David', deliveries: 60, rating: 4.0 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ReportsPage() {
  const [stockData, setStockData] = useState(generateStockData())
  const [performanceData, setPerformanceData] = useState(generatePerformanceData())
  const [consumptionData, setConsumptionData] = useState(generateConsumptionData())
  const [driverPerformanceData, setDriverPerformanceData] = useState(generateDriverPerformanceData())
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [graphType, setGraphType] = useState("line")
  const [viewMode, setViewMode] = useState("graph")
  const [selectedTable, setSelectedTable] = useState("stockData")
  const [filteredData, setFilteredData] = useState({
    stockData: [],
    performanceData: [],
    consumptionData: [],
    driverPerformanceData: []
  })
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [oldReports, setOldReports] = useState<any[]>([])

  const filterData = useCallback((data) => {
    return data.filter(item => {
      const itemDate = parseISO(item.date)
      return isWithinInterval(itemDate, { 
        start: startOfDay(dateRange.from), 
        end: endOfDay(dateRange.to) 
      })
    })
  }, [dateRange])

  const formatDate = (date: Date) => format(date, "PPP")

  const generateReport = useCallback(() => {
    const newFilteredData = {
      stockData: filterData(stockData),
      performanceData: filterData(performanceData),
      consumptionData: filterData(consumptionData),
      driverPerformanceData: filterData(driverPerformanceData)
    }
    setFilteredData(newFilteredData)

    // Save the generated report
    const newReport = {
      id: Date.now(),
      date: new Date().toISOString(),
      data: newFilteredData,
      dateRange,
      selectedTable,
      selectedColumns
    }
    setOldReports(prevReports => [...prevReports, newReport])
  }, [filterData, stockData, performanceData, consumptionData, driverPerformanceData, dateRange, selectedTable, selectedColumns])

  const regenerateOldReport = useCallback((reportId: number) => {
    const oldReport = oldReports.find(report => report.id === reportId)
    if (oldReport) {
      setDateRange(oldReport.dateRange)
      setSelectedTable(oldReport.selectedTable)
      setSelectedColumns(oldReport.selectedColumns)
      setFilteredData(oldReport.data)
    }
  }, [oldReports])

  const exportToExcel = useCallback(() => {
    let dataToExport = filteredData[selectedTable]
    if (selectedColumns.length > 0) {
      dataToExport = dataToExport.map(item => 
        Object.fromEntries(
          selectedColumns.map(col => [col, item[col]])
        )
      )
    }

    console.log("Exporting to Excel:", dataToExport)
    // Simulating a download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${selectedTable}_report.xlsx`
    link.click()
  }, [filteredData, selectedTable, selectedColumns])

  const tableColumns = useMemo(() => {
    switch (selectedTable) {
      case "stockData":
        return ["name", "predicted", "actual"]
      case "performanceData":
        return ["day", "onTime", "delayed"]
      case "consumptionData":
        return ["name", "value"]
      case "driverPerformanceData":
        return ["name", "deliveries", "rating"]
      default:
        return []
    }
  }, [selectedTable])

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Date Range</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? formatDate(dateRange.from) : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date || prev.from }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? formatDate(dateRange.to) : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date || prev.to }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={generateReport} className="mt-2">Generate Report</Button>
              </div>
              <div className="space-y-2">
                <Label>Table Selection</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stockData">Stock Levels</SelectItem>
                    <SelectItem value="performanceData">Delivery Performance</SelectItem>
                    <SelectItem value="consumptionData">Gas Consumption</SelectItem>
                    <SelectItem value="driverPerformanceData">Driver Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Column Selection</Label>
                <div className="flex flex-wrap gap-2">
                  {tableColumns.map(column => (
                    <Button
                      key={column}
                      variant={selectedColumns.includes(column) ? "default" : "outline"}
                      onClick={() => setSelectedColumns(prev => 
                        prev.includes(column) 
                          ? prev.filter(col => col !== column)
                          : [...prev, column]
                      )}
                    >
                      {column}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>View Mode</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={viewMode === "graph" ? "default" : "outline"}
                    onClick={() => setViewMode("graph")}
                  >
                    Graph
                  </Button>
                  <Button 
                    variant={viewMode === "table" ? "default" : "outline"}
                    onClick={() => setViewMode("table")}
                  >
                    Table
                  </Button>
                </div>
              </div>
              <div className="pt-4">
                {viewMode === "graph" ? (
                  <ResponsiveContainer width="100%" height={300}>
                    {selectedTable === "stockData" && graphType === "line" && (
                      <LineChart data={filteredData.stockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="predicted" stroke="#8884d8" name="Predicted" />
                        <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual" />
                      </LineChart>
                    )}
                    {selectedTable === "performanceData" && graphType === "bar" && (
                      <BarChart data={filteredData.performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="onTime" fill="#82ca9d" name="On Time" />
                        <Bar dataKey="delayed" fill="#ff8042" name="Delayed" />
                      </BarChart>
                    )}
                    {selectedTable === "consumptionData" && graphType === "pie" && (
                      <PieChart>
                        <Pie
                          data={filteredData.consumptionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {filteredData.consumptionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}
                    {selectedTable === "driverPerformanceData" && graphType === "bar" && (
                      <BarChart data={filteredData.driverPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="deliveries" fill="#8884d8" name="Deliveries" />
                        <Bar yAxisId="right" dataKey="rating" fill="#82ca9d" name="Rating" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {selectedColumns.map(column => (
                          <TableHead key={column}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData[selectedTable]?.map((item, index) => (
                        <TableRow key={index}>
                          {selectedColumns.map(column => (
                            <TableCell key={column}>{item[column]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <Button onClick={exportToExcel} className="w-full">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download Report (.xlsx)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Old Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {oldReports.map(report => (
                <div key={report.id} className="flex items-center justify-between">
                  <span>{format(new Date(report.date), "PPP")}</span>
                  <Button onClick={() => regenerateOldReport(report.id)}>
                    Regenerate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

