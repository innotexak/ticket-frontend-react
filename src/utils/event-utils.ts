// Utility functions and constants for Events

export type ViewMode = 'grid' | 'list';

export interface EventFormData {
  name: string;
  price: number;
  date: string;
  artist: string;
  description: string;
  categoryId: string;
  imageUrl: string;
}

export const getCategoryColor = (index: number): string => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-red-500 to-red-600',
  ];
  return colors[index % colors.length];
};

/**
 * Validate event form data
 */
export const validateEventForm = (formData: EventFormData): string | null => {
  if (!formData.name.trim()) {
    return 'Event name is required';
  }
  if (!formData.categoryId) {
    return 'Category is required';
  }
  if (!formData.date) {
    return 'Date and time are required';
  }
  return null;
};

/**
 * Filter events based on search query and category
 */
export const filterEvents = <T extends { name: string; artist: string; categoryId: string }>(
  events: T[],
  searchQuery: string,
  selectedCategory: string
): T[] => {
  return events.filter((event) => {
    const matchesCategory = !selectedCategory || event.categoryId === selectedCategory;
    const matchesSearch =
      event?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      event?.artist?.toLowerCase()?.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
};

/**
 * Format date to local date string
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

/**
 * Format date to local time string
 */
export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format price as currency
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
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
 * Get initial form data
 */
export const getInitialFormData = (categoryId?: string): EventFormData => ({
  name: '',
  price: 0,
  date: '',
  artist: '',
  description: '',
  categoryId: categoryId || '',
  imageUrl: '',
});