import { ReportGeneration } from '@/components/outlet/reports/report-generation'

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <ReportGeneration />
    </div>
  )
}

