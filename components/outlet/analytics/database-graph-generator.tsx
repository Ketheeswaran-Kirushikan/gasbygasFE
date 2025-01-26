'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range'
import { 
  Bar, 
  BarChart, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts'

interface DatabaseGraphGeneratorProps {
  onGenerateGraph: (graph: JSX.Element) => void
}

const MOCK_TABLES = ['users', 'requests', 'stock', 'deliveries']

export function DatabaseGraphGenerator({ onGenerateGraph }: DatabaseGraphGeneratorProps) {
  const [selectedTable, setSelectedTable] = useState('')
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [graphType, setGraphType] = useState('bar')
  const [filter, setFilter] = useState('')

  const handleGenerateGraph = () => {
    // In a real application, you would fetch data from the database here
    // For this example, we'll use mock data
    const mockData = [
      { name: 'Item 1', value: 400 },
      { name: 'Item 2', value: 300 },
      { name: 'Item 3', value: 200 },
      { name: 'Item 4', value: 100 },
    ]

    let graph: JSX.Element
    switch (graphType) {
      case 'bar':
        graph = (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
        break
      case 'line':
        graph = (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )
        break
      case 'pie':
        graph = (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={mockData} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
        break
      default:
        return
    }
    onGenerateGraph(graph)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Database-Driven Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger>
              <SelectValue placeholder="Select table" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_TABLES.map((table) => (
                <SelectItem key={table} value={table}>{table}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePickerWithRange 
            date={dateRange}
            setDate={(newDateRange) => setDateRange(newDateRange)}
          />

          <Select value={graphType} onValueChange={setGraphType}>
            <SelectTrigger>
              <SelectValue placeholder="Select graph type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter (e.g. status='PENDING')"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <Button onClick={handleGenerateGraph}>Generate Graph</Button>
        </div>
      </CardContent>
    </Card>
  )
}

