import { User, Request, Stock, Settings, UserRole, RequestStatus, RequestType, CylinderType } from '@/Types/outlet/index'

// In-memory data store
const data = {
  users: new Map<string, User>(),
  requests: new Map<string, Request>(),
  stock: new Map<string, Stock>(),
  settings: new Map<string, Settings>()
}

// Initialize with sample data
function initializeSampleData() {
  // Sample users
  data.users.set('1', {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.OUTLET_MANAGER,
    phone: '1234567890'
  })

  // Sample stock
  data.stock.set('1', {
    id: '1',
    outletId: '1',
    cylinderType: CylinderType.DOMESTIC_SMALL,
    quantity: 100,
    threshold: 20
  })

  // Sample requests
  data.requests.set('1', {
    id: '1',
    tokenId: 'TKN001',
    type: RequestType.DOMESTIC,
    quantity: 2,
    status: RequestStatus.PENDING,
    userId: '1',
    outletId: '1'
  })
}

// Initialize data
initializeSampleData()

export class Store {
  // User methods
  static async getUsers(): Promise<User[]> {
    return Array.from(data.users.values())
  }

  static async getUser(id: string): Promise<User | undefined> {
    return data.users.get(id)
  }

  static async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = Math.random().toString(36).substr(2, 9)
    const newUser = { ...user, id }
    data.users.set(id, newUser)
    return newUser
  }

  static async updateUser(id: string, user: Partial<User>): Promise<User | undefined> {
    const existingUser = data.users.get(id)
    if (!existingUser) return undefined

    const updatedUser = { ...existingUser, ...user }
    data.users.set(id, updatedUser)
    return updatedUser
  }

  static async deleteUser(id: string): Promise<boolean> {
    return data.users.delete(id)
  }

  // Request methods
  static async getRequests(): Promise<Request[]> {
    return Array.from(data.requests.values())
  }

  static async createRequest(request: Omit<Request, 'id'>): Promise<Request> {
    const id = Math.random().toString(36).substr(2, 9)
    const newRequest = { ...request, id }
    data.requests.set(id, newRequest)
    return newRequest
  }

  static async updateRequest(id: string, request: Partial<Request>): Promise<Request | undefined> {
    const existingRequest = data.requests.get(id)
    if (!existingRequest) return undefined

    const updatedRequest = { ...existingRequest, ...request }
    data.requests.set(id, updatedRequest)
    return updatedRequest
  }

  // Stock methods
  static async getStock(): Promise<Stock[]> {
    return Array.from(data.stock.values())
  }

  static async updateStock(id: string, stock: Partial<Stock>): Promise<Stock | undefined> {
    const existingStock = data.stock.get(id)
    if (!existingStock) return undefined

    const updatedStock = { ...existingStock, ...stock }
    data.stock.set(id, updatedStock)
    return updatedStock
  }

  // Settings methods
  static async getSettings(userId: string): Promise<Settings | undefined> {
    return data.settings.get(userId)
  }

  static async updateSettings(userId: string, settings: Partial<Settings>): Promise<Settings> {
    const existingSettings = data.settings.get(userId) || {
      timezone: 'UTC',
      darkMode: false,
      language: 'en',
      emailNotifications: true
    }

    const updatedSettings = { ...existingSettings, ...settings }
    data.settings.set(userId, updatedSettings)
    return updatedSettings
  }
}

