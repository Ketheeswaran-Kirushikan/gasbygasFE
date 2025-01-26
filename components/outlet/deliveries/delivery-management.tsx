'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/app-context'
import { createRequest, updateRequestStatus } from '@/lib/actions'
import { Request, RequestStatus, CustomerType, GasType } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { DeliveryRequestForm } from './delivery-request-form'
import { Pencil, Trash2, Plus, Search, Download, CheckSquare, Square, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslation } from '@/hooks/use-translation'
import { cn } from "@/lib/utils"
import { DeliveryDetailsView } from './delivery-details-view'
import { DownloadOptions } from './download-options'
import { useToast } from "@/components/ui/use-toast"

export function DeliveryManagement() {
  const { t } = useTranslation()
  const { state, dispatch } = useApp()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'ALL'>('ALL')
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType | 'ALL'>('ALL')
  const [selectedGasType, setSelectedGasType] = useState<GasType | 'ALL'>('ALL')
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set())
  const [viewingRequest, setViewingRequest] = useState<Request | null>(null)
  const [editingRequest, setEditingRequest] = useState<Request | null>(null)
  const [isDownloadOptionsOpen, setIsDownloadOptionsOpen] = useState(false)
  const [downloadingRequest, setDownloadingRequest] = useState<Request | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingRequest, setDeletingRequest] = useState<Request | null>(null)

  const handleUpdateStatus = async (id: string, status: RequestStatus) => {
    const updatedRequest = await updateRequestStatus(id, status)
    if (updatedRequest) {
      dispatch({ type: 'SET_REQUESTS', payload: state.requests.map(req => req.id === id ? updatedRequest : req) })
      toast({
        title: t('Status Updated'),
        description: t('The delivery request status has been updated successfully.'),
      })
    }
  }

  const handleDeleteRequest = (request: Request) => {
    setDeletingRequest(request)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingRequest) {
      dispatch({ type: 'SET_REQUESTS', payload: state.requests.filter(req => req.id !== deletingRequest.id) })
      setSelectedRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(deletingRequest.id)
        return newSet
      })
      toast({
        title: t('Request Deleted'),
        description: t('The delivery request has been deleted successfully.'),
      })
    }
    setIsDeleteDialogOpen(false)
    setDeletingRequest(null)
  }

  const handleAddRequest = async (request: Partial<Request>) => {
    const createdRequest = await createRequest(request)
    if (createdRequest) {
      dispatch({ type: 'SET_REQUESTS', payload: [...state.requests, createdRequest] })
      toast({
        title: t('Request Added'),
        description: t('A new delivery request has been added successfully.'),
      })
    }
  }

  const handleEditRequest = (request: Request) => {
    setEditingRequest(request)
  }

  const handleUpdateRequest = (updatedRequest: Request) => {
    dispatch({ type: 'SET_REQUESTS', payload: state.requests.map(req => req.id === updatedRequest.id ? updatedRequest : req) })
    setEditingRequest(null)
    toast({
      title: t('Request Updated'),
      description: t('The delivery request has been updated successfully.'),
    })
  }

  const handleDownload = (request: Request) => {
    setDownloadingRequest(request)
    setIsDownloadOptionsOpen(true)
  }

  const handleBulkDownload = () => {
    setDownloadingRequest(null)
    setIsDownloadOptionsOpen(true)
  }

  const performDownload = (fileType: string) => {
    // In a real application, this would trigger the actual download
    const requestsToDownload = downloadingRequest ? [downloadingRequest] : state.requests.filter(req => selectedRequests.has(req.id))
    console.log(`Downloading ${requestsToDownload.length} requests as ${fileType}`)
    toast({
      title: t('Download Started'),
      description: t(`Your download has started. File type: ${fileType.toUpperCase()}`),
    })
  }

  const isValidSearch = (input: string) => {
    const validSearchRegex = /^[a-zA-Z0-9\s-]*$/
    return validSearchRegex.test(input)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    if (isValidSearch(input)) {
      setSearchTerm(input)
    }
  }

  const filteredRequests = state.requests.filter(request => {
    const searchString = searchTerm.toLowerCase().trim()
    const matchesSearch = 
      (request.tokenId?.toLowerCase() || '').includes(searchString) ||
      (request.gasType?.toLowerCase() || '').includes(searchString) ||
      (request.status?.toLowerCase() || '').includes(searchString) ||
      (request.customerType?.toLowerCase() || '').includes(searchString) ||
      request.quantity?.toString().includes(searchString)
    const matchesStatus = selectedStatus === 'ALL' || request.status === selectedStatus
    const matchesCustomerType = selectedCustomerType === 'ALL' || request.customerType === selectedCustomerType
    const matchesGasType = selectedGasType === 'ALL' || request.gasType === selectedGasType
    return matchesSearch && matchesStatus && matchesCustomerType && matchesGasType
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(new Set(filteredRequests.map(r => r.id)))
    } else {
      setSelectedRequests(new Set())
    }
  }

  const handleSelectRequest = (id: string, checked: boolean) => {
    setSelectedRequests(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }

  const handleBulkDelete = () => {
    dispatch({ type: 'SET_REQUESTS', payload: state.requests.filter(req => !selectedRequests.has(req.id)) })
    setSelectedRequests(new Set())
    toast({
      title: t('Requests Deleted'),
      description: t('The selected delivery requests have been deleted successfully.'),
    })
  }

  const handleViewRequest = (request: Request) => {
    setViewingRequest(request)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">{t('Delivery Management')}</h1>
        <div className="flex gap-3">
          {selectedRequests.size > 0 && (
            <>
              <Button variant="outline" onClick={handleBulkDownload}>
                <Download className="h-4 w-4 mr-2" />
                {t('Download Selected')} ({selectedRequests.size})
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t('Delete Selected')} ({selectedRequests.size})
              </Button>
            </>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('New Request')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('New Delivery Request')}</DialogTitle>
              </DialogHeader>
              <DeliveryRequestForm onSubmit={handleAddRequest} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-500 -translate-y-1/2" />
              <Input
                placeholder={t('Search requests...')}
                className="pl-9 pr-4 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus} className="w-[200px]">
              <SelectTrigger>
                <SelectValue placeholder={t('Filter by Status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('All Statuses')}</SelectItem>
                {Object.values(RequestStatus).map(status => (
                  <SelectItem key={status} value={status}>{t(status)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCustomerType} onValueChange={setSelectedCustomerType} className="w-[200px]">
              <SelectTrigger>
                <SelectValue placeholder={t('Filter by Customer Type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('All Customer Types')}</SelectItem>
                {Object.values(CustomerType).map(type => (
                  <SelectItem key={type} value={type}>{t(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedRequests.size === filteredRequests.length && filteredRequests.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t('Token ID')}</TableHead>
                  <TableHead>{t('Customer Type')}</TableHead>
                  <TableHead>{t('Gas Type')}</TableHead>
                  <TableHead>{t('Gas Weight')}</TableHead>
                  <TableHead className="text-right">{t('Quantity')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                  <TableHead className="text-right">{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRequests.has(request.id)}
                        onCheckedChange={(checked) => handleSelectRequest(request.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{request.tokenId}</TableCell>
                    <TableCell>{t(request.customerType)}</TableCell>
                    <TableCell>{t(request.gasType)}</TableCell>
                    <TableCell>{request.gasWeight}</TableCell>
                    <TableCell className="text-right">{request.quantity}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        {
                          "bg-yellow-100 text-yellow-800": request.status === RequestStatus.PENDING,
                          "bg-green-100 text-green-800": request.status === RequestStatus.DELIVERED,
                          "bg-blue-100 text-blue-800": request.status === RequestStatus.CONFIRMED,
                          "bg-red-100 text-red-800": request.status === RequestStatus.CANCELLED,
                        }
                      )}>
                        {t(request.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditRequest(request)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(request)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRequest(request)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      {t('No delivery requests found matching your search criteria.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewingRequest} onOpenChange={(open) => !open && setViewingRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('Delivery Details')}</DialogTitle>
          </DialogHeader>
          {viewingRequest && <DeliveryDetailsView request={viewingRequest} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingRequest} onOpenChange={(open) => !open && setEditingRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('Edit Delivery Request')}</DialogTitle>
          </DialogHeader>
          {editingRequest && (
            <DeliveryRequestForm
              initialData={editingRequest}
              onSubmit={handleUpdateRequest}
              onCancel={() => setEditingRequest(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <DownloadOptions
        isOpen={isDownloadOptionsOpen}
        onClose={() => setIsDownloadOptionsOpen(false)}
        onDownload={performDownload}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Confirm Deletion')}</DialogTitle>
          </DialogHeader>
          <p>{t('Are you sure you want to delete this delivery request?')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>{t('Cancel')}</Button>
            <Button variant="destructive" onClick={confirmDelete}>{t('Delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

