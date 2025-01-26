import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Jan', total: 3200 },
  { name: 'Feb', total: 2800 },
  { name: 'Mar', total: 3500 },
  { name: 'Apr', total: 3000 },
  { name: 'May', total: 2900 },
  { name: 'Jun', total: 3100 },
]

export function StockOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

