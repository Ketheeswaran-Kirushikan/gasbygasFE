export interface StockItem {
  id: string
  itemId: string
  type: StockType
  quantityKG: number
  quantity: number
  threshold: number
  status: StockStatus
  lastUpdated: string
}

export interface StockRequest {
  id: string
  itemId: string
  type: StockType
  quantityKG: number
  quantity: number
  status: RequestStatus
  requestDate: string
  requestedBy: string
}

export enum StockType {
  DOMESTIC = 'Domestic',
  INDUSTRIAL = 'Industrial'
}

export enum StockStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock'
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  DELIVERED = 'Delivered'
}

