import { apiClient } from '@/lib/api';

// Types
export interface Category {
  categoryId: string;
  name: string;
  createdDate: string;
  lastModifiedDate?: string;
}

export interface Event {
  eventId: string;
  name: string;
  price: number;
  date: string;
  artist: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  category?: Category;
  createdDate: string;
  lastModifiedDate?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderTotal: number;
  orderPlaced: string;
  orderPaid: boolean;
  createdDate: string;
  lastModifiedDate?: string;
}

// Category APIs
export const categoryApi = {
  getAll: () => apiClient.get<Category[]>('/category/all'),

  getWithEvents: (includeHistory: boolean = false) =>
    apiClient.get<any[]>(`/category?includeHistory=${includeHistory}`),

  create: (data: Omit<Category, 'categoryId' | 'createdDate'>) =>
    apiClient.post<any>('/category', data),

  update: (id: string, data: Partial<Category>) =>
    apiClient.put<any>(`/category/${id}`, data),

  delete: (id: string) => apiClient.delete(`/category/${id}`),
};

// Event APIs
export const eventApi = {
  getAll: () => apiClient.get<Event[]>('/event/all'),

  getById: (id: string) =>
    apiClient.get<Event>(`/event/${id}`),

  create: (data: Omit<Event, 'eventId' | 'createdDate'>) =>
    apiClient.post<string>('/event', data),

  update: (data: Event) =>
    apiClient.put<void>('/event', data),

  delete: (id: string) =>
    apiClient.delete(`/event/${id}`),
};

// Order APIs
export const orderApi = {
  getAll: () => apiClient.get<Order[]>('/order/all'),

  getById: (id: string) =>
    apiClient.get<Order>(`/order/${id}`),

  // Optional: fetch orders by category if backend supports it
  getByCategory: (categoryId: string) =>
    apiClient.get<Order[]>(`/order?categoryId=${categoryId}`),

  create: (data: Omit<Order, 'id' | 'createdDate'>) =>
    apiClient.post<string>('/order', data),

  update: (id: string, data: Partial<Order>) =>
    apiClient.put<void>(`/order/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/order/${id}`),
};
