// Utility functions and constants for Categories

export const PAGE_SIZE = 10;
export const DEBOUNCE_DELAY = 300;

export interface CategoryFormData {
  name: string;
  categoryId: string;
}

export interface CategoryColors {
  bg: string;
  icon: string;
  light: string;
}

export const categoryColors: CategoryColors[] = [
  { bg: 'bg-blue-600', icon: 'bg-blue-600', light: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' },
  { bg: 'bg-purple-600', icon: 'bg-purple-600', light: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400' },
  { bg: 'bg-green-600', icon: 'bg-green-600', light: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' },
  { bg: 'bg-orange-600', icon: 'bg-orange-600', light: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400' },
  { bg: 'bg-indigo-600', icon: 'bg-indigo-600', light: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400' },
  { bg: 'bg-pink-600', icon: 'bg-pink-600', light: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400' },
];

/**
 * Get color class for a category based on index
 */
export const getColorClass = (index: number): CategoryColors => {
  return categoryColors[index % categoryColors.length];
};

/**
 * Build URL query parameters for pagination and search
 */
export const buildUrlParams = (query: string = '', page: number = 0): string => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (page > 0) params.append('page', (page + 1).toString());
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
 * Validate category form data
 */
export const validateCategoryForm = (formData: CategoryFormData): string | null => {
  if (!formData.name.trim()) {
    return 'Category name is required';
  }
  return null;
};