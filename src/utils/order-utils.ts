// Utility functions and constants for Orders

export const PAGE_SIZE = 10;
export const DEBOUNCE_DELAY = 300;

export type FilterStatus = 'all' | 'paid' | 'unpaid';

export interface OrderFormData {
  orderId: string;
  userId: string;
  orderTotal: number;
  orderPlaced: string;
  orderPaid: boolean;
}

export interface Order {
  id: string;
  userId: string;
  orderTotal: number;
  orderPlaced: string;
  orderPaid: boolean;
}

/**
 * Validate order form data
 */
export const validateOrderForm = (formData: OrderFormData): string | null => {
  if (formData.orderTotal <= 0) {
    return 'Order total must be greater than 0';
  }
  if (!formData.orderPlaced) {
    return 'Order date is required';
  }
  return null;
};

/**
 * Filter orders by paid status
 */
export const filterOrdersByStatus = (
  orders: Order[],
  status: FilterStatus
): Order[] => {
  if (status === 'paid') {
    return orders.filter((o) => o.orderPaid);
  } else if (status === 'unpaid') {
    return orders.filter((o) => !o.orderPaid);
  }
  return orders;
};

/**
 * Calculate total revenue from orders
 */
export const calculateTotalRevenue = (orders: Order[]): number => {
  return orders.reduce((sum, order) => sum + order.orderTotal, 0);
};

/**
 * Count paid orders
 */
export const countPaidOrders = (orders: Order[]): number => {
  return orders.filter((o) => o.orderPaid).length;
};

/**
 * Count pending orders
 */
export const countPendingOrders = (orders: Order[]): number => {
  return orders.length - countPaidOrders(orders);
};

/**
 * Format order ID for display
 */
export const formatOrderId = (id: string): string => {
  return id.slice(0, 8).toUpperCase();
};

/**
 * Format price as currency
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Format date for display
 */
export const formatOrderDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Convert ISO string to datetime-local format
 */
export const toDatetimeLocalFormat = (isoString: string): string => {
  return new Date(isoString).toISOString().slice(0, 16);
};

/**
 * Convert datetime-local format to ISO string
 */
export const toISOString = (dateString: string): string => {
  return new Date(dateString).toISOString();
};

/**
 * Build URL query parameters
 */
export const buildUrlParams = (
  query: string = '',
  page: number = 0,
  status: string = 'all'
): string => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (page > 0) params.append('page', (page + 1).toString());
  if (status !== 'all') params.append('status', status);

  return params.toString();
};

/**
 * Calculate pagination info
 */
export const calculatePaginationInfo = (
  currentPage: number,
  totalCount: number,
  pageSize: number
) => {
  const pageStart = currentPage * pageSize + 1;
  const pageEnd = Math.min((currentPage + 1) * pageSize, totalCount);
  const totalPages = Math.ceil(totalCount / pageSize);

  return { pageStart, pageEnd, totalPages };
};

/**
 * Get initial form data
 */
export const getInitialFormData = (): OrderFormData => ({
  orderId: '',
  userId: '',
  orderTotal: 0,
  orderPlaced: new Date().toISOString().slice(0, 16),
  orderPaid: false,
});