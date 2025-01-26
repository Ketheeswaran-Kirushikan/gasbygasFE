'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DialogFooter } from '@/components/ui/dialog'

interface EditReportFormProps {
  report: {
    id: string
    type: 'stock' | 'deliveries' | 'users'
    startDate: string
    endDate: string
    generatedAt: string
  }
  onSave: (updatedReport: EditReportFormProps['report']) => void
  onCancel: () => void
}

export function EditReportForm({ report, onSave, onCancel }: EditReportFormProps) {
  const [editedReport, setEditedReport] = useState(report)

  const handleSave = () => {
    onSave(editedReport)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Report Type</label>
        <Select
          value={editedReport.type}
          onValueChange={(value) => setEditedReport({ ...editedReport, type: value as 'stock' | 'deliveries' | 'users' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stock">Stock Report</SelectItem>
            <SelectItem value="deliveries">Deliveries Report</SelectItem>
            <SelectItem value="users">Users Report</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Start Date</label>
        <Input
          type="date"
          value={editedReport.startDate}
          onChange={(e) => setEditedReport({ ...editedReport, startDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">End Date</label>
        <Input
          type="date"
          value={editedReport.endDate}
          onChange={(e) => setEditedReport({ ...editedReport, endDate: e.target.value })}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogFooter>
    </div>
  )
}

