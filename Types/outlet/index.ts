export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone: string
  profileUrl?: string
}

export enum UserRole {
  CONSUMER = 'CONSUMER',
  BUSINESS = 'BUSINESS',
  STAFF = 'STAFF',
  OUTLET_MANAGER = 'OUTLET_MANAGER'
}

export interface Request {
  id: string
  tokenId: string
  type: RequestType
  quantity: number
  quantityKG: number
  status: RequestStatus
  userId: string
  outletId: string
  customerType: CustomerType
  address: string
}

export enum RequestType {
  DOMESTIC = 'DOMESTIC',
  INDUSTRIAL = 'INDUSTRIAL'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum CustomerType {
  CONSUMER = 'CONSUMER',
  BUSINESS = 'BUSINESS'
}

export interface Stock {
  id: string
  outletId: string
  cylinderType: CylinderType
  quantity: number
  threshold: number
}

export enum CylinderType {
  DOMESTIC_SMALL = 'DOMESTIC_SMALL',
  DOMESTIC_LARGE = 'DOMESTIC_LARGE',
  INDUSTRIAL = 'INDUSTRIAL',
  COMMERCIAL = 'COMMERCIAL'
}

export interface Settings {
  outletName?: string
  timezone: string
  darkMode: boolean
  language: string
  emailNotifications: boolean
  stockAlerts: boolean
  deliveryUpdates: boolean
}

export interface BaseUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  profileUrl?: string;
}

export interface ConsumerUser extends BaseUser {
  role: UserRole.CONSUMER;
  firstName: string;
  lastName: string;
  nic: string;
}

export interface BusinessUser extends BaseUser {
  role: UserRole.BUSINESS;
  businessName: string;
  registrationNumber: string;
  businessCategory: BusinessCategory;
  certificationUrl: string;
}

export interface StaffUser extends BaseUser {
  role: UserRole.STAFF | UserRole.OUTLET_MANAGER;
  name: string;
}

export type User = ConsumerUser | BusinessUser | StaffUser;

export enum BusinessCategory {
  HOTEL = 'Hotel',
  FACTORY = 'Factory',
  RESTAURANT = 'Restaurant',
  WAREHOUSE = 'Warehouse',
  OTHER = 'Other'
}

export enum GasType {
  DOMESTIC = 'Domestic',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial'
}

export enum GasWeight {
  FIVE_KG = '5kg',
  TWELVE_POINT_FIVE_KG = '12.5kg',
  THIRTY_SEVEN_POINT_FIVE_KG = '37.5kg',
  FORTY_FIVE_KG = '45kg'
}

export interface BaseRequest {
  id: string
  tokenId: string
  status: RequestStatus
  userId: string
  outletId: string
  customerType: CustomerType
  createdAt: string
}

export interface ConsumerRequest extends BaseRequest {
  customerType: CustomerType.CONSUMER
  gasType: GasType.DOMESTIC | GasType.COMMERCIAL
  gasWeight: GasWeight
  quantity: number
}

export interface BusinessRequest extends BaseRequest {
  customerType: CustomerType.BUSINESS
  gasType: GasType.INDUSTRIAL
  gasWeight: GasWeight
  quantity: number
  poDocumentUrl?: string
}

export type Request = ConsumerRequest | BusinessRequest

