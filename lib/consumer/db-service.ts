import { GasRequest } from './mock-data';
import { User, AuthResponse } from './types';
import { translate } from './translations';

interface LocalizedGasRequest extends GasRequest {
  type: 'Domestic' | 'Industrial';
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  outletLocation: string;
  message?: string;
}

interface GasRequest {
  id: string;
  userId: string;
  tokenId: string;
  createdAt: string;
  type: string;
  quantity: number;
  status: string;
  outletLocation: string;
  message?: string;
  poDocument?: string;
}

export interface Notification {
  id: string;
  messageKey: string;
  messageParams?: Record<string, string>;
  createdAt: string;
  read: boolean;
  toastShown?: boolean;
}

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  language: string;
  theme: string;
  businessRegistrationNumber?: string;
  businessCategory?: string;
}

export class DBService {
  private storage: GasRequest[] = [];
  private notifications: Notification[] = [];
  private users: User[] = [];

  constructor() {
    // Initialize with mock data if available
    const storedData = localStorage.getItem('gasRequests');
    if (storedData) {
      this.storage = JSON.parse(storedData);
    }
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      this.notifications = JSON.parse(storedNotifications);
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  getAllRequests(): GasRequest[] {
    return this.storage;
  }

  addRequest(request: GasRequest): void {
    this.storage.push({
      ...request,
      type: request.type.toUpperCase() as 'DOMESTIC' | 'INDUSTRIAL',
      status: request.status.toLowerCase() as 'pending' | 'confirmed' | 'delivered' | 'cancelled'
    });
    this.saveToLocalStorage();
    this.addNotification('Gas request #{tokenId} has been submitted', { tokenId: request.tokenId });
  }

  updateRequest(id: string, updatedRequest: Partial<GasRequest>): void {
    const index = this.storage.findIndex(req => req.id === id);
    if (index !== -1) {
      this.storage[index] = { ...this.storage[index], ...updatedRequest };
      this.saveToLocalStorage();
      
      if (updatedRequest.status === 'confirmed') {
        this.addNotification('Gas request #{tokenId} has been confirmed', { tokenId: this.storage[index].tokenId });
      } else if (updatedRequest.status === 'cancelled') {
        this.addNotification('Gas request #{tokenId} has been cancelled', { tokenId: this.storage[index].tokenId });
      }
    }
  }

  deleteRequest(id: string): void {
    this.storage = this.storage.filter(req => req.id !== id);
    this.saveToLocalStorage();
  }

  getAllNotifications(): Notification[] {
    return this.notifications;
  }

  addNotification(messageKey: string, messageParams?: Record<string, string>): void {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      messageKey,
      messageParams,
      createdAt: new Date().toISOString(),
      read: false,
      toastShown: false,
    };
    this.notifications.unshift(notification); // Add to beginning of array
    this.saveNotificationsToLocalStorage();
  }

  markNotificationAsRead(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].read = true;
      this.saveNotificationsToLocalStorage();
    }
  }

  markNotificationToastShown(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      this.notifications[index].toastShown = true;
      this.saveNotificationsToLocalStorage();
    }
  }

  registerUser(userData: Omit<User, 'id' | 'language' | 'theme'>): AuthResponse {
    const existingUser = this.users.find(user => user.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      language: 'en',
      theme: 'light'
    };

    this.users.push(newUser);
    this.saveUsersToLocalStorage();
    return { success: true, message: 'Registration successful', user: newUser };
  }

  loginUser(email: string, password: string): AuthResponse {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    return { success: true, message: 'Login successful', user };
  }

  updateUser(userId: string, updates: Partial<User>): AuthResponse {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) {
      return { success: false, message: 'User not found' };
    }

    if (updates.password) {
      if (updates.currentPassword !== this.users[index].password) {
        return { success: false, message: 'Current password is incorrect' };
      }
      delete updates.currentPassword;
      this.addNotification('Password has been updated successfully');
    }

    this.users[index] = { ...this.users[index], ...updates };
    this.saveUsersToLocalStorage();
    return { success: true, message: 'User updated successfully', user: this.users[index] };
  }

  getUser(userId: string): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('gasRequests', JSON.stringify(this.storage));
  }

  private saveNotificationsToLocalStorage(): void {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  private saveUsersToLocalStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  generateReceipt(requestId: string): string {
    const request = this.storage.find(r => r.id === requestId);
    if (!request) return '';

    const user = this.users.find(u => u.id === request.userId);
    if (!user) return '';

    return `
      Receipt for Gas Request #${request.tokenId}
      Company: ${user.companyName}
      Date: ${new Date(request.createdAt).toLocaleDateString()}
      Type: ${request.type}
      Quantity: ${request.quantity} KG
      Status: ${request.status}
      Outlet: ${request.outletLocation}
      Total Amount: $${request.quantity * 50} // Example price calculation
    `;
  }

  getLocalizedRequest(request: GasRequest, language: string): LocalizedGasRequest {
    return {
      ...request,
      type: this.translate(request.type, language) as 'Domestic' | 'Industrial',
      status: this.translate(request.status, language),
      outletLocation: this.translate(request.outletLocation, language),
      message: request.message ? this.translate(request.message, language) : undefined
    };
  }

  private translate(key: string, language: string): string {
    // Use the translation function from translations.ts
    return translate(key.toLowerCase(), language as 'en' | 'ta' | 'si' | 'zh');
  }
}

export const dbService = new DBService();

