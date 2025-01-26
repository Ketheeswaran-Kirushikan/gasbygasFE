'use client'

import { useState } from 'react'
import { Search, Pencil, Eye, RotateCcw, Plus, Trash2, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { StockRequest, StockType, RequestStatus } from '@/types/stock'
import { StockRequestForm } from './stock-request-form'
import { StockRequestView } from './stock-request-view'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useTranslation } from '@/hooks/use-translation'

const SAMPLE_REQUESTS: StockRequest[] = [
  {
    id: '1',
    itemId: 'ABC1055',
    type: StockType.DOMESTIC,
    quantityKG: 12.5,
    quantity: 100,
    totalQuantity: 100,
    quantitySold: 20,
    availableQuantity: 80,
    status: RequestStatus.PENDING,
    requestDate: new Date().toISOString(),
    requestedBy: 'John Doe'
  },
  {
    id: '2',
    itemId: 'ABC1039',
    type: StockType.INDUSTRIAL,
    quantityKG: 37.5,
    quantity: 200,
    totalQuantity: 200,
    quantitySold: 50,
    availableQuantity: 150,
    status: RequestStatus.APPROVED,
    requestDate: new Date().toISOString(),
    requestedBy: 'Jane Smith'
  },
  {
    id: '3',
    itemId: 'ABC1060',
    type: StockType.DOMESTIC,
    quantityKG: 5,
    quantity: 300,
    totalQuantity: 300,
    quantitySold: 100,
    availableQuantity: 200,
    status: RequestStatus.DELIVERED,
    requestDate: new Date().toISOString(),
    requestedBy: 'Alice Johnson'
  }
]

export function StockManagement() {
  const { t } = useTranslation()
  const [requests, setRequests] = useState<StockRequest[]>(SAMPLE_REQUESTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [editingRequest, setEditingRequest] = useState<StockRequest | null>(null)
  const [viewingRequest, setViewingRequest] = useState<StockRequest | null>(null)
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [selectedStockItems, setSelectedStockItems] = useState<Set<string>>(new Set())

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStockItems(new Set(filteredRequests.map(r => r.id)))
    } else {
      setSelectedStockItems(new Set())
    }
  }

  const handleSelectStockItem = (id: string, checked: boolean) => {
    setSelectedStockItems(prev => {
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
    setRequests(requests.filter(r => !selectedRequests.has(r.id)))
    setSelectedRequests(new Set())
    setShowDeleteAlert(true)
    setTimeout(() => setShowDeleteAlert(false), 3000)
  }

  const handleBulkDelete = () => {
    setRequests(requests.filter(r => !selectedStockItems.has(r.id)))
    setSelectedStockItems(new Set())
    setShowDeleteAlert(true)
    setTimeout(() => setShowDeleteAlert(false), 3000)
  }

  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter(r => r.id !== id))
    setDeleteRequestId(null)
    setShowDeleteDialog(false)
    setShowDeleteAlert(true)
    setTimeout(() => setShowDeleteAlert(false), 3000)
  }

  const handleAddRequest = (request: StockRequest) => {
    setRequests([...requests, request])
  }

  const handleEditRequest = (request: StockRequest) => {
    setRequests(requests.map(r => r.id === request.id ? request : r))
    setEditingRequest(null)
  }

  const handleReRequest = (request: StockRequest) => {
    const newRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: RequestStatus.PENDING,
      requestDate: new Date().toISOString()
    }
    setRequests([...requests, newRequest])
  }

  const handleDownload = (request: StockRequest) => {
    // In a real application, this would generate a PDF or CSV file
    console.log(`Downloading data for stock request: ${request.id}`)
  }

  const handleBulkDownload = () => {
    // In a real application, this would generate a PDF or CSV file with all selected requests
    console.log(`Downloading data for ${selectedStockItems.size} stock requests`)
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || request.type === selectedType
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.APPROVED:
        return 'bg-green-100 text-green-800'
      case RequestStatus.REJECTED:
        return 'bg-red-100 text-red-800'
      case RequestStatus.DELIVERED:
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6">
      {showDeleteAlert && (
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle>{t('Success')}</AlertTitle>
          <AlertDescription>
            {t('Selected request(s) have been deleted successfully.')}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{t('Stock Management')}</h1>
        <div className="flex gap-2">
          {selectedStockItems.size > 0 && (
            <>
              <Button
                variant="outline"
                onClick={handleBulkDownload}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('Download Selected')} ({selectedStockItems.size})
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('Delete Selected')} ({selectedStockItems.size})
              </Button>
            </>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#6366F1] hover:bg-[#5558E3]">
                <Plus className="h-4 w-4 mr-2" />
                {t('New Request')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{t('New Stock Request')}</DialogTitle>
              </DialogHeader>
              <StockRequestForm
                onSubmit={handleAddRequest}
                nextItemId={`ABC${Math.floor(1000 + Math.random() * 9000)}`}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t('Search by ID or type...')}
                className="pl-9 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('All Types')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All Types')}</SelectItem>
                {Object.values(StockType).map(type => (
                  <SelectItem key={type} value={type}>{t(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t('All Status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All Status')}</SelectItem>
                {Object.values(RequestStatus).map(status => (
                  <SelectItem key={status} value={status}>{t(status)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedStockItems.size === filteredRequests.length && filteredRequests.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{t('Item ID')}</TableHead>
                <TableHead>{t('Gas Type')}</TableHead>
                <TableHead>{t('Quantity (KG)')}</TableHead>
                <TableHead>{t('Total Quantity')}</TableHead>
                <TableHead>{t('Quantity Sold')}</TableHead>
                <TableHead>{t('Available Quantity')}</TableHead>
                <TableHead>{t('Status')}</TableHead>
                <TableHead>{t('Actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">{t('No requests found.')}</TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedStockItems.has(request.id)}
                        onCheckedChange={(checked) => handleSelectStockItem(request.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>{request.itemId}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.quantityKG}</TableCell>
                    <TableCell>{request.totalQuantity}</TableCell>
                    <TableCell>{request.quantitySold}</TableCell>
                    <TableCell>{request.availableQuantity}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingRequest(request)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>{t('Edit Stock Request')}</DialogTitle>
                            </DialogHeader>
                            <StockRequestForm
                              onSubmit={handleEditRequest}
                              initialData={request}
                              isEditing
                            />
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>{t('View Request Details')}</DialogTitle>
                            </DialogHeader>
                            <StockRequestView request={request} />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReRequest(request)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(request)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeleteRequestId(request.id)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Confirm Deletion')}</DialogTitle>
            <DialogDescription>
              {selectedStockItems.size > 0 ? 
                t('Are you sure you want to delete {{count}} selected request(s)?', { count: selectedStockItems.size }) :
                t('Are you sure you want to delete this request?')
              }
              {t('This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false)
                setDeleteRequestId(null)
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (selectedStockItems.size > 0) {
                  handleBulkDelete()
                } else if (deleteRequestId) {
                  handleDeleteRequest(deleteRequestId)
                }
                setShowDeleteDialog(false)
              }}
            >
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

