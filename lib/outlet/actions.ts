'use server'

import { revalidatePath } from 'next/cache'
import { Store } from './store'
import { Request, RequestStatus, CustomerType, GasType, GasWeight } from '@/types'
import { UserRole } from '@/types'

export async function createRequest(requestData: Partial<Request>) {
  const request = await Store.createRequest({
    id: Math.random().toString(36).substr(2, 9),
    tokenId: `TKN${Date.now()}`,
    customerType: requestData.customerType as CustomerType,
    gasType: requestData.gasType as GasType,
    gasWeight: requestData.gasWeight as GasWeight,
    quantity: requestData.quantity as number,
    status: requestData.status as RequestStatus,
    userId: requestData.userId as string,
    outletId: requestData.outletId as string,
    createdAt: new Date().toISOString(),
    poDocumentUrl: requestData.poDocumentUrl,
  })

  revalidatePath('/deliveries')
  return request
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const updatedRequest = await Store.updateRequest(id, { status })
  if (updatedRequest) {
    revalidatePath('/requests')
  }
  return updatedRequest
}

export async function updateStock(id: string, quantity: number) {
  const updatedStock = await Store.updateStock(id, { quantity })
  if (updatedStock) {
    revalidatePath('/stock')
  }
  return updatedStock
}

export async function createUser(formData: FormData) {
  const role = formData.get('role') as UserRole
  const baseUser = {
    id: Math.random().toString(36).substr(2, 9),
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    role: role,
    profileUrl: formData.get('profileUrl') as string || '/placeholder.svg',
  }

  let userData
  switch (role) {
    case UserRole.CONSUMER:
      userData = {
        ...baseUser,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        nic: formData.get('nic') as string,
      }
      break
    case UserRole.BUSINESS:
      userData = {
        ...baseUser,
        businessName: formData.get('businessName') as string,
        registrationNumber: formData.get('registrationNumber') as string,
        businessCategory: formData.get('businessCategory') as string,
        certificationUrl: formData.get('certificationUrl') as string,
        contactPersonName: formData.get('contactPersonName') as string,
      }
      break
    default:
      userData = {
        ...baseUser,
        name: formData.get('name') as string,
      }
  }

  const user = await Store.createUser(userData)
  revalidatePath('/users')
  return user
}

export async function updateSettings(userId: string, settings: any) {
  const updatedSettings = await Store.updateSettings(userId, settings)
  revalidatePath('/settings')
  return updatedSettings
}

export async function getInitialData() {
  return {
    users: await Store.getUsers(),
    requests: await Store.getRequests(),
    stock: await Store.getStock()
  }
}

