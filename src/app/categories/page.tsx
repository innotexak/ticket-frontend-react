'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Alert } from '@/components/Alert';
import { Category, categoryApi, PaginatedResponse } from '@/lib/services';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from 'react-icons/fi';

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

export default function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', categoryId: '' });

  const searchQuery = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0;

  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const updateUrl = (query: string = '', page: number = 0) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (page > 0) params.append('page', (page + 1).toString());

    const queryString = params.toString();
    router.push(`/categories${queryString ? `?${queryString}` : ''}`);
  };

  const fetchCategories = async (page: number = 0, search: string = '') => {
    try {
      setIsLoading(true);
      const offset = page * PAGE_SIZE;

      const data = await categoryApi.getAll({
        limit: PAGE_SIZE,
        offset,
        search: search || undefined,
      });

      if ('items' in data) {
        setCategories(data.items || []);
        setTotalCount(data.totalCount);
        setHasNext(data.hasNext);
        setHasPrevious(data.hasPrevious);
      } else if (Array.isArray(data)) {
        setCategories(data || []);
        setTotalCount(data.length);
        setHasNext(false);
        setHasPrevious(false);
      }

      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (newValue.length > 0 && newValue.length < 3) {
      return;
    }

    debounceTimer.current = setTimeout(() => {
      updateUrl(newValue, 0);
    }, DEBOUNCE_DELAY);
  };

  const handleClearSearch = () => {
    setInputValue('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    updateUrl('', 0);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(inputValue, newPage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setIsLoading(true);

      if (editingId) {
        await categoryApi.update(editingId, { name: formData.name, categoryId: formData.categoryId } as any);
        setSuccess('Category updated successfully');
      } else {
        await categoryApi.create({ name: formData.name } as any);
        setSuccess('Category created successfully');
      }

      setFormData({ name: '', categoryId: '' });
      setEditingId(null);
      setIsModalOpen(false);
      updateUrl(inputValue, 0);
      await fetchCategories(0, inputValue);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setIsLoading(true);
      await categoryApi.delete(id);
      setSuccess('Category deleted successfully');
      updateUrl(inputValue, 0);
      await fetchCategories(0, inputValue);
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.categoryId);
    setFormData({ name: category.name, categoryId: category.categoryId });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', categoryId: '' });
  };

  const categoryColors = [
    { bg: 'bg-blue-600', icon: 'bg-blue-600', light: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' },
    { bg: 'bg-purple-600', icon: 'bg-purple-600', light: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400' },
    { bg: 'bg-green-600', icon: 'bg-green-600', light: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-400' },
    { bg: 'bg-orange-600', icon: 'bg-orange-600', light: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400' },
    { bg: 'bg-indigo-600', icon: 'bg-indigo-600', light: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400' },
    { bg: 'bg-pink-600', icon: 'bg-pink-600', light: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400' },
  ];

  const getColorClass = (index: number) => categoryColors[index % categoryColors.length];

  const pageStart = currentPage * PAGE_SIZE + 1;
  const pageEnd = Math.min((currentPage + 1) * PAGE_SIZE, totalCount);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold gradient-text">
                Event Categories
              </h1>
              <p className="text-lg text-secondary">Organize and manage your event categories effortlessly</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 self-start lg:self-auto"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
            <input
              type="text"
              placeholder="Search categories by name..."
              value={inputValue}
              onChange={handleSearchInputChange}
              className="w-full pl-12 pr-12 py-3 bg-primary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
            {inputValue && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary dark:hover:text-white transition p-1 hover:bg-hover dark:hover:bg-gray-700/50 rounded"
                title="Clear search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
          {inputValue && (
            <div className="mt-2 text-xs text-tertiary">
              Searching for: <span className="text-blue-600 dark:text-blue-400 font-semibold">"{inputValue}"</span>
            </div>
          )}
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <div className="mb-6 text-sm text-secondary">
            Showing <span className="font-semibold text-primary dark:text-white">{pageStart}</span>
            {' '}to <span className="font-semibold text-primary dark:text-white">{pageEnd}</span> of{' '}
            <span className="font-semibold text-primary dark:text-white">{totalCount}</span> categories
            {inputValue && <span className="ml-2">· URL: /categories?q={inputValue}{currentPage > 0 ? `&page=${currentPage + 1}` : ''}</span>}
          </div>
        )}

        {/* Categories Grid */}
        {isLoading && !categories.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-border-default dark:border-gray-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
              <p className="text-secondary font-medium">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-primary border border-border-default dark:border-white/10 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">No categories found</h3>
            <p className="text-secondary mb-8 text-lg">
              {totalCount === 0 && inputValue === ''
                ? 'Get started by creating your first category.'
                : 'Try adjusting your search.'}
            </p>
            {totalCount === 0 && inputValue === '' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5" />
                Create First Category
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const colors = getColorClass(index);
              return (
                <div
                  key={category.categoryId}
                  className="group relative overflow-hidden rounded-xl bg-primary border border-border-default dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{
                    animation: `slideUp 0.4s ease-out ${index * 50}ms backwards`,
                  }}
                >
                  <style>{`
                    @keyframes slideUp {
                      from {
                        opacity: 0;
                        transform: translateY(20px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}</style>

                  {/* Content */}
                  <div className="relative p-6">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-lg ${colors.bg} flex items-center justify-center mb-5 transform group-hover:scale-110 transition-transform duration-300`}>
                      <FiTag className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                      {category.name}
                    </h3>

                    {/* Badge */}
                    <div className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold mb-6 ${colors.light} border`}>
                      Category
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-border-default dark:bg-white/10 mb-6"></div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 ${colors.light} border rounded-lg text-sm font-semibold hover:opacity-80 transition-all duration-200 transform hover:scale-105 active:scale-95`}
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(category.categoryId)}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2.5 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95"
                      >
                        <FiTrash2 className="w-4 h-4 mx-auto sm:hidden" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalCount > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={!hasPrevious || isLoading}
              className="flex items-center gap-2 px-4 py-2.5 border border-border-default dark:border-white/10 text-primary dark:text-white font-medium rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2 text-secondary">
              <span>Page</span>
              <span className="font-semibold text-primary dark:text-white">{currentPage + 1}</span>
              <span>of</span>
              <span className="font-semibold text-primary dark:text-white">{totalPages || 1}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext || isLoading}
              className="flex items-center gap-2 px-4 py-2.5 border border-border-default dark:border-white/10 text-primary dark:text-white font-medium rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingId ? 'Edit Category' : 'Create New Category'}
        onClose={handleModalClose}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary dark:text-white mb-3">Category Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Music, Sports, Arts..."
              required
              className="w-full px-4 py-3 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
            />
            <p className="text-xs text-tertiary mt-2">Choose a clear, descriptive name for your category</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">💡 Tip:</span> Use specific category names to help organize your events better. For example: "Live Music", "Comedy Shows", "Sports Events".
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border-default dark:border-white/10">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-2.5 border border-border-default dark:border-white/10 text-primary dark:text-white font-semibold rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 transform hover:scale-105 active:scale-95"
            >
              {editingId ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}