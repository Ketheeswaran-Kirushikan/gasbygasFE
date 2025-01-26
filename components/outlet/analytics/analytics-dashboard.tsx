'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/app-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { DatabaseGraphGenerator } from './database-graph-generator'
import { useTranslation } from '@/hooks/use-translation'

const MOCK_SALES_DATA = [
  { month: 'Jan', domestic: 4000, industrial: 2400, commercial: 2400 },
  { month: 'Feb', domestic: 3000, industrial: 1398, commercial: 2210 },
  { month: 'Mar', domestic: 2000, industrial: 9800, commercial: 2290 },
  { month: 'Apr', domestic: 2780, industrial: 3908, commercial: 2000 },
  { month: 'May', domestic: 1890, industrial: 4800, commercial: 2181 },
  { month: 'Jun', domestic: 2390, industrial: 3800, commercial: 2500 },
  { month: 'Jul', domestic: 3490, industrial: 4300, commercial: 2100 },
]

export function AnalyticsDashboard() {
  const { state } = useApp()
  const { t } = useTranslation()
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M')
  const [selectedGraphType, setSelectedGraphType] = useState('bar')
  const [databaseGraphs, setDatabaseGraphs] = useState<JSX.Element[]>([])

  const stockData = state.stock.map(item => ({
    name: item.cylinderType,
    value: item.quantity
  }))

  const deliveryData = [
    { name: 'Pending', value: state.requests.filter(r => r.status === 'PENDING').length },
    { name: 'Confirmed', value: state.requests.filter(r => r.status === 'CONFIRMED').length },
    { name: 'Delivered', value: state.requests.filter(r => r.status === 'DELIVERED').length },
  ]

  const renderGraph = (type: string, data: any[], dataKey: string = 'value') => {
    switch (type) {
      case 'bar':
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
        )
      case 'line':
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
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey={dataKey} data={data} fill="#8884d8" label />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('Analytics Dashboard')}</h1>
        <div className="flex space-x-2">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={t('Time Range')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1W">{t('1 Week')}</SelectItem>
              <SelectItem value="1M">{t('1 Month')}</SelectItem>
              <SelectItem value="3M">{t('3 Months')}</SelectItem>
              <SelectItem value="1Y">{t('1 Year')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedGraphType} onValueChange={setSelectedGraphType}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={t('Graph Type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">{t('Bar')}</SelectItem>
              <SelectItem value="line">{t('Line')}</SelectItem>
              <SelectItem value="pie">{t('Pie')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('Stock Overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderGraph(selectedGraphType, stockData)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Delivery Status')}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderGraph(selectedGraphType, deliveryData)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('Sales by Gas Type')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MOCK_SALES_DATA}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="domestic" fill="#8884d8" />
                <Bar dataKey="industrial" fill="#82ca9d" />
                <Bar dataKey="commercial" fill="#ffc658" />
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
  )
}

