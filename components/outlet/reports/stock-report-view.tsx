'use client'

import { useApp } from '@/contexts/outlet/app-context'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CylinderType } from '@/Types/outlet/index'

interface StockReportViewProps {
  report: {
    id: string
    type: 'stock'
    startDate: string
    endDate: string
    generatedAt: string
  }
}

export function StockReportView({ report }: StockReportViewProps) {
  const { state } = useApp()

  // In a real app, you would filter the stock data based on the report's date range
  const stockData = state.stock.map(item => ({
    ...item,
    quantityKG: getQuantityKG(item.cylinderType),
    totalQuantity: item.quantity,
    quantitySold: Math.floor(Math.random() * item.quantity), // This is a placeholder. In a real app, you'd calculate this from sales data
    availableQuantity: item.quantity - Math.floor(Math.random() * item.quantity) // This is a placeholder. In a real app, you'd calculate this from actual data
  }))

  function getQuantityKG(cylinderType: CylinderType): number {
    switch (cylinderType) {
      case CylinderType.DOMESTIC_SMALL:
        return 5
      case CylinderType.DOMESTIC_LARGE:
        return 12.5
      case CylinderType.INDUSTRIAL:
        return 37.5
      case CylinderType.COMMERCIAL:
        return 45
      default:
        return 0
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p><strong>Report ID:</strong> {report.id}</p>
          <p><strong>Date Range:</strong> {report.startDate} to {report.endDate}</p>
          <p><strong>Generated At:</strong> {report.generatedAt}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gas Type</TableHead>
              <TableHead>Quantity (KG)</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Available Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.cylinderType}</TableCell>
                <TableCell>{item.quantityKG}</TableCell>
                <TableCell>{item.totalQuantity}</TableCell>
                <TableCell>{item.quantitySold}</TableCell>
                <TableCell>{item.availableQuantity}</TableCell>
                <TableCell>{item.availableQuantity <= item.threshold ? 'Low Stock' : 'In Stock'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

