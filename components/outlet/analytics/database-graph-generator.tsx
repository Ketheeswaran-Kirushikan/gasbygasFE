'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/outlet/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/outlet/ui/select'
import { Button } from '@/components/outlet/ui/button'
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

const MOCK_TABLES = ['Gas Requests', 'Stock', 'Sales']

export function DatabaseGraphGenerator({ onGenerateGraph }: DatabaseGraphGeneratorProps) {
  const [selectedTable, setSelectedTable] = useState('')
  const [graphType, setGraphType] = useState('bar')

  const handleGenerateGraph = () => {
    const mockData = [
      { name: 'Category 1', value: 400 },
      { name: 'Category 2', value: 300 },
      { name: 'Category 3', value: 200 },
      { name: 'Category 4', value: 100 }
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
    }
    onGenerateGraph(graph)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Gas Request Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedTable} onValueChange={setSelectedTable}>
          <SelectTrigger>
            <SelectValue placeholder="Select Data Type" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_TABLES.map((table) => (
              <SelectItem key={table} value={table}>{table}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerateGraph}>Generate Graph</Button>
      </CardContent>
    </Card>
  )
}
