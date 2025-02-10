"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Layout } from "@/components/distpach/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/distpach/ui/card"
import { Button } from "@/components/distpach/ui/button"
import { Input } from "@/components/distpach/ui/input"
import { Label } from "@/components/distpach/ui/label"
import { Switch } from "@/components/distpach/ui/switch"
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
import { cn } from "@/lib/distpach/utils"


// Simulated data
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

export default function AnalyticsPage() {
  const [stockData, setStockData] = useState(generateStockData())
  const [performanceData, setPerformanceData] = useState(generatePerformanceData())
  const [consumptionData, setConsumptionData] = useState(generateConsumptionData())
  const [driverPerformanceData, setDriverPerformanceData] = useState(generateDriverPerformanceData())
  const [timeRange, setTimeRange] = useState("week")
  const [gasType, setGasType] = useState("all")
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [graphType, setGraphType] = useState("line")
  const [viewMode, setViewMode] = useState("graph")
  const [selectedTable, setSelectedTable] = useState("stockLevels")
  const [filteredData, setFilteredData] = useState({
    stockData: [],
    performanceData: [],
    consumptionData: [],
    driverPerformanceData: []
  })

  // Simulate real-time updates
  useEffect(() => {
    const newStockData = generateStockData()
    const newPerformanceData = generatePerformanceData()
    const newConsumptionData = generateConsumptionData()
    const newDriverPerformanceData = generateDriverPerformanceData()

    setStockData(newStockData)
    setPerformanceData(newPerformanceData)
    setConsumptionData(newConsumptionData)
    setDriverPerformanceData(newDriverPerformanceData)

    setFilteredData({
      stockData: newStockData,
      performanceData: newPerformanceData,
      consumptionData: newConsumptionData,
      driverPerformanceData: newDriverPerformanceData
    })

    const interval = setInterval(() => {
      const newStockData = generateStockData()
      const newPerformanceData = generatePerformanceData()
      const newConsumptionData = generateConsumptionData()
      const newDriverPerformanceData = generateDriverPerformanceData()

      setStockData(newStockData)
      setPerformanceData(newPerformanceData)
      setConsumptionData(newConsumptionData)
      setDriverPerformanceData(newDriverPerformanceData)

      setFilteredData({
        stockData: filterData(newStockData),
        performanceData: filterData(newPerformanceData),
        consumptionData: filterData(newConsumptionData),
        driverPerformanceData: filterData(newDriverPerformanceData)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filterData = useCallback((data) => {
    return data.filter(item => {
      const itemDate = new Date(item.date || item.name || item.day)
      return itemDate >= dateRange.from && itemDate <= dateRange.to
    })
  }, [dateRange])


  const generateReport = useCallback(() => {
    const newFilteredData = {
      stockData: filterData(stockData),
      performanceData: filterData(performanceData),
      consumptionData: filterData(consumptionData),
      driverPerformanceData: filterData(driverPerformanceData)
    }
    setFilteredData(newFilteredData)

  }, [filterData, stockData, performanceData, consumptionData, driverPerformanceData])

  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={gasType} onValueChange={setGasType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select gas type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="5kg">5kg</SelectItem>
                  <SelectItem value="12.5kg">12.5kg</SelectItem>
                  <SelectItem value="45kg">45kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filterData(stockData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="#8884d8" name="Predicted" />
                <Line type="monotone" dataKey="actual" stroke="#82ca9d" name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filterData(performanceData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="onTime" fill="#82ca9d" name="On Time" />
                <Bar dataKey="delayed" fill="#ff8042" name="Delayed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gas Consumption by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filterData(consumptionData)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {consumptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Driver Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filterData(driverPerformanceData)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="deliveries" fill="#8884d8" name="Deliveries" />
                <Bar yAxisId="right" dataKey="rating" fill="#82ca9d" name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Forecast Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select forecast period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">1 Week</SelectItem>
                    <SelectItem value="2weeks">2 Weeks</SelectItem>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gas Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gas type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5kg">5kg</SelectItem>
                    <SelectItem value="12.5kg">12.5kg</SelectItem>
                    <SelectItem value="45kg">45kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Generate Forecast</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Scheduler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock Levels</SelectItem>
                    <SelectItem value="performance">Delivery Performance</SelectItem>
                    <SelectItem value="consumption">Gas Consumption</SelectItem>
                    <SelectItem value="driver">Driver Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Recipients (comma-separated emails)</Label>
                <Input placeholder="john@example.com, jane@example.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch />
              </div>
              <Button className="w-full">Schedule Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

