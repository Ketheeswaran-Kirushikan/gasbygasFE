export type GasRequest = {
  id: string;
  tokenId: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  type: 'Domestic' | 'Industrial';
  gasWeight: string;
  quantity: number;
  deliveryDate: string;
  createdAt: string;
  outletLocation: string;
  message?: string;
  poDocument?: string;
};

export const mockRequests: GasRequest[] = [
  {
    id: '1',
    tokenId: 'ABC1025',
    status: 'pending',
    type: 'Domestic',
    gasWeight: '12.5kg',
    quantity: 1,
    deliveryDate: '2025-02-01',
    createdAt: '2025-01-25T10:00:00Z',
    outletLocation: 'Main Street Branch'
  },
  {
    id: '2',
    tokenId: 'ABC1026',
    status: 'confirmed',
    type: 'Industrial',
    gasWeight: '37.5kg',
    quantity: 2,
    deliveryDate: '2025-02-04',
    createdAt: '2025-01-26T11:30:00Z',
    outletLocation: 'Industrial Park Branch'
  },
  {
    id: '3',
    tokenId: 'ABC1027',
    status: 'delivered',
    type: 'Domestic',
    gasWeight: '25kg',
    quantity: 5,
    deliveryDate: '2025-01-02',
    createdAt: '2024-12-28T09:15:00Z',
    outletLocation: 'Suburb Branch'
  },
  {
    id: '4',
    tokenId: 'ABC1028',
    status: 'cancelled',
    type: 'Industrial',
    gasWeight: '100kg',
    quantity: 10,
    deliveryDate: '2025-02-15',
    createdAt: '2025-02-01T14:00:00Z',
    outletLocation: 'Downtown Branch'
  },
  {
    id: '5',
    tokenId: 'ABC1029',
    status: 'pending',
    type: 'Domestic',
    gasWeight: '7.5kg',
    quantity: 3,
    deliveryDate: '2025-04-15',
    createdAt: '2025-04-10T16:45:00Z',
    outletLocation: 'Coastal Branch'
  },
];

