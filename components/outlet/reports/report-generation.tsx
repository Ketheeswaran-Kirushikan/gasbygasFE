'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/app-context'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { StockReportView } from './stock-report-view'
import { Download, Edit, Trash, Eye } from 'lucide-react'
import { EditReportForm } from './edit-report-form'
import { useTranslation } from '@/hooks/use-translation'

type ReportType = 'stock' | 'deliveries' | 'users'

interface Report {
  id: string
  type: ReportType
  startDate: string
  endDate: string
  generatedAt: string
}

export function ReportGeneration() {
  const { state } = useApp()
  const { t } = useTranslation()
  const [reportType, setReportType] = useState<ReportType>('stock')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReports, setSelectedReports] = useState<Set<string>>(new Set())
  const [viewingReport, setViewingReport] = useState<Report | null>(null)
  const [editingReport, setEditingReport] = useState<Report | null>(null)

  useEffect(() => {
    // In a real app, this would fetch reports from the backend
    const mockReports: Report[] = [
      { id: '1', type: 'stock', startDate: '2023-01-01', endDate: '2023-01-31', generatedAt: '2023-02-01' },
      { id: '2', type: 'deliveries', startDate: '2023-02-01', endDate: '2023-02-28', generatedAt: '2023-03-01' },
      { id: '3', type: 'users', startDate: '2023-03-01', endDate: '2023-03-31', generatedAt: '2023-04-01' },
    ]
    setReports(mockReports)
  }, [])

  const generateReport = () => {
    // In a real application, this would generate a report based on the selected type and date range
    const newReport: Report = {
      id: Date.now().toString(),
      type: reportType,
      startDate,
      endDate,
      generatedAt: new Date().toISOString().split('T')[0],
    }
    setReports([newReport, ...reports])
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(new Set(reports.map(r => r.id)))
    } else {
      setSelectedReports(new Set())
    }
  }

  const handleSelectReport = (id: string, checked: boolean) => {
    setSelectedReports(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleDeleteSelected = () => {
    setReports(reports.filter(r => !selectedReports.has(r.id)))
    setSelectedReports(new Set())
  }

  const handleDeleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id))
    setSelectedReports(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleDownloadSelected = () => {
    // In a real app, this would download the selected reports
    console.log('Downloading selected reports:', Array.from(selectedReports))
  }

  const handleDownloadReport = (id: string) => {
    // In a real app, this would download the specific report
    console.log('Downloading report:', id)
  }

  const handleEditReport = (report: Report) => {
    setEditingReport(report)
  }

  const handleViewReport = (report: Report) => {
    setViewingReport(report)
  }

  const handleSaveEditedReport = (updatedReport: Report) => {
    setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r))
    setEditingReport(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('Generate New Report')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('Select report type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock">{t('Stock Report')}</SelectItem>
                <SelectItem value="deliveries">{t('Deliveries Report')}</SelectItem>
                <SelectItem value="users">{t('Users Report')}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder={t('Start Date')}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder={t('End Date')}
            />
            <Button onClick={generateReport}>{t('Generate Report')}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('Report History')}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedReports.size > 0 && (
            <div className="mb-4 flex space-x-2">
              <Button variant="outline" onClick={handleDownloadSelected}>
                <Download className="mr-2 h-4 w-4" />
                {t('Download Selected')} ({selectedReports.size})
              </Button>
              <Button variant="destructive" onClick={handleDeleteSelected}>
                <Trash className="mr-2 h-4 w-4" />
                {t('Delete Selected')} ({selectedReports.size})
              </Button>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedReports.size === reports.length && reports.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{t('Type')}</TableHead>
                <TableHead>{t('Start Date')}</TableHead>
                <TableHead>{t('End Date')}</TableHead>
                <TableHead>{t('Generated At')}</TableHead>
                <TableHead>{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.has(report.id)}
                      onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.startDate}</TableCell>
                  <TableCell>{report.endDate}</TableCell>
                  <TableCell>{report.generatedAt}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditReport(report)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewingReport} onOpenChange={(open) => !open && setViewingReport(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('Report View')}</DialogTitle>
          </DialogHeader>
          {viewingReport && viewingReport.type === 'stock' && (
            <StockReportView report={viewingReport} />
          )}
          {/* Add other report type views here */}
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingReport} onOpenChange={(open) => !open && setEditingReport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Edit Report')}</DialogTitle>
          </DialogHeader>
          {editingReport && (
            <EditReportForm
              report={editingReport}
              onSave={handleSaveEditedReport}
              onCancel={() => setEditingReport(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

