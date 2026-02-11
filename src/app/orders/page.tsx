'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Alert } from '@/components/Alert';
import { Order as OrderType, orderApi, PaginatedResponse } from '@/lib/services';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';
import { Input } from '@/components/ui';
import { OrderFormModal } from '@/components/order/orderModal';
import {
  PAGE_SIZE,
  DEBOUNCE_DELAY,
  FilterStatus,
  OrderFormData,
  validateOrderForm,
  filterOrdersByStatus,
  calculateTotalRevenue,
  countPaidOrders,
  countPendingOrders,
  formatOrderId,
  formatPrice,
  formatOrderDate,
  toDatetimeLocalFormat,
  toISOString,
  buildUrlParams,
  calculatePaginationInfo,
  getInitialFormData,
} from '@/utils/order-utils';

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // URL parameters
  const searchQuery = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0;
  const filterParam = searchParams.get('status') || 'all';

  // Search and filter state
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [filterPaid, setFilterPaid] = useState<FilterStatus>(
    filterParam as FilterStatus
  );

  // Pagination state
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OrderFormData>(getInitialFormData());

  /**
   * Update URL with search query, page number, and filter status
   */
  const updateUrl = (query: string = '', page: number = 0, status: FilterStatus = 'all') => {
    const queryString = buildUrlParams(query, page, status);
    router.push(`/orders${queryString ? `?${queryString}` : ''}`);
  };

  /**
   * Fetch all orders
   */
  const fetchOrders = async (page: number = 0, search: string = '') => {
    try {
      setIsLoading(true);
      const offset = page * PAGE_SIZE;

      const data = await orderApi.getAll({
        limit: PAGE_SIZE,
        offset,
        search: search || undefined,
      });

      if ('items' in data) {
        let filteredItems = data.items || [];
        filteredItems = filterOrdersByStatus(filteredItems, filterPaid);

        setOrders(filteredItems);
        setTotalCount(data.totalCount);
        setHasNext(data.hasNext);
        setHasPrevious(data.hasPrevious);
      } else if (Array.isArray(data)) {
        let filteredItems = data || [];
        filteredItems = filterOrdersByStatus(filteredItems, filterPaid);

        setOrders(filteredItems);
        setTotalCount(filteredItems.length);
        setHasNext(false);
        setHasPrevious(false);
      }

      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Effects
   */
  useEffect(() => {
    fetchOrders(currentPage, searchQuery);
  }, [currentPage, searchQuery, filterPaid]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const newFilter = (searchParams.get('status') || 'all') as FilterStatus;
    if (newFilter !== filterPaid) {
      setFilterPaid(newFilter);
    }
  }, [searchParams]);

  /**
   * Handle search input with debouncing
   */
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      updateUrl(newValue, 0, filterPaid);
    }, DEBOUNCE_DELAY);
  };

  /**
   * Clear search input
   */
  const handleClearSearch = () => {
    setInputValue('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    updateUrl('', 0, filterPaid);
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilterPaid(newFilter);
    updateUrl(inputValue, 0, newFilter);
  };

  /**
   * Handle page navigation
   */
  const handlePageChange = (newPage: number) => {
    updateUrl(inputValue, newPage, filterPaid);
  };

  /**
   * Open create modal
   */
  const openCreate = () => {
    setEditingId(null);
    setFormData(getInitialFormData());
    setIsModalOpen(true);
  };

  /**
   * Open edit modal
   */
  const openEdit = (order: OrderType) => {
    setEditingId(order.id);
    setFormData({
      orderId: order.id,
      userId: order.userId,
      orderTotal: order.orderTotal,
      orderPlaced: toDatetimeLocalFormat(order.orderPlaced),
      orderPaid: order.orderPaid,
    });
    setIsModalOpen(true);
  };

  /**
   * Handle order deletion
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      setIsLoading(true);
      await orderApi.delete(id);
      setSuccess('Order deleted successfully');
      updateUrl(inputValue, 0, filterPaid);
      await fetchOrders(0, inputValue);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form submission (create or update)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateOrderForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        userId: formData.userId,
        orderTotal: Number(formData.orderTotal),
        orderPlaced: toISOString(formData.orderPlaced),
        orderPaid: formData.orderPaid,
      } as any;

      if (editingId) {
        await orderApi.update(editingId, { ...payload, id: editingId });
        setSuccess('Order updated successfully');
      } else {
        await orderApi.create(payload);
        setSuccess('Order created successfully');
      }

      setIsModalOpen(false);
      updateUrl(inputValue, 0, filterPaid);
      await fetchOrders(0, inputValue);
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle reset filters
   */
  const handleResetFilters = () => {
    setInputValue('');
    setFilterPaid('all');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    updateUrl('', 0, 'all');
  };

  // Calculate stats
  const totalRevenue = calculateTotalRevenue(orders);
  const paidOrders = countPaidOrders(orders);
  const pendingOrders = countPendingOrders(orders);

  // Pagination info
  const { pageStart, pageEnd, totalPages } = calculatePaginationInfo(
    currentPage,
    totalCount,
    PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-primary dark:text-white">
                Orders
              </h1>
              <p className="text-secondary mt-2">
                Manage and track all customer orders
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/50 w-fit"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Order</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* Total Orders */}
            <StatCard
              label="Total Orders"
              value={orders.length}
              icon={
                <FiDollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              }
              backgroundColor="bg-blue-100 dark:bg-blue-900/30"
            />

            {/* Total Revenue */}
            <StatCard
              label="Total Revenue"
              value={formatPrice(totalRevenue)}
              icon={
                <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              }
              backgroundColor="bg-green-100 dark:bg-green-900/30"
            />

            {/* Paid Orders */}
            <StatCard
              label="Paid Orders"
              value={paidOrders}
              icon={
                <FiCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              }
              backgroundColor="bg-emerald-100 dark:bg-emerald-900/30"
            />

            {/* Pending Orders */}
            <StatCard
              label="Pending"
              value={pendingOrders}
              icon={
                <FiClock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              }
              backgroundColor="bg-amber-100 dark:bg-amber-900/30"
            />
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        {/* Filters and Search */}
        <div className="bg-primary border border-border-default dark:border-white/10 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
                Search Orders
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-tertiary w-5 h-5" />
                <Input
                  type="number"
                  placeholder="Search amount"
                  value={inputValue}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {inputValue && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-3 text-tertiary hover:text-primary dark:hover:text-white transition"
                    title="Clear search"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-primary dark:text-white mb-2">
                Filter by Status
              </label>
              <select
                value={filterPaid}
                onChange={(e) => handleFilterChange(e.target.value as FilterStatus)}
                className="w-full px-4 py-2.5 bg-secondary border border-border-default dark:border-white/10 text-primary dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full px-4 py-2.5 border border-border-default dark:border-white/10 text-primary dark:text-white font-semibold rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="text-sm text-secondary">
              Showing{' '}
              <span className="font-semibold text-primary dark:text-white">
                {pageStart}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-primary dark:text-white">
                {pageEnd}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-primary dark:text-white">
                {totalCount}
              </span>{' '}
              orders
              {inputValue && <span className="ml-2">• Search: "{inputValue}"</span>}
              {filterPaid !== 'all' && (
                <span className="ml-2">• Status: {filterPaid}</span>
              )}
            </div>
          )}
        </div>

        {/* Orders Table */}
        {isLoading && !orders.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-border-default dark:border-gray-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
              <p className="text-secondary font-medium">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-primary border border-border-default dark:border-white/10 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-secondary mb-8">
              {totalCount === 0 && inputValue === '' && filterPaid === 'all'
                ? 'Get started by creating your first order.'
                : 'Try adjusting your filters.'}
            </p>
            {totalCount === 0 && inputValue === '' && filterPaid === 'all' && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5" />
                Create First Order
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default dark:border-white/10 bg-secondary">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary dark:text-white">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary dark:text-white">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary dark:text-white">
                    Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-primary dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-primary dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    onEdit={() => openEdit(order)}
                    onDelete={() => handleDelete(order.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalCount > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={!hasPrevious || isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-border-default dark:border-white/10 text-primary dark:text-white font-medium rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2 text-secondary">
              <span>Page</span>
              <span className="font-semibold text-primary dark:text-white">
                {currentPage + 1}
              </span>
              <span>of</span>
              <span className="font-semibold text-primary dark:text-white">
                {totalPages || 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext || isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-border-default dark:border-white/10 text-primary dark:text-white font-medium rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      <OrderFormModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        editingId={editingId}
        formData={formData}
        onClose={() => setIsModalOpen(false)}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/**
 * Stat Card Component
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor: string;
}

function StatCard({ label, value, icon, backgroundColor }: StatCardProps) {
  return (
    <div className="bg-primary border border-border-default dark:border-white/10 rounded-lg p-6 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-secondary dark:text-slate-400 uppercase tracking-wide mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-primary dark:text-white">
            {value}
          </p>
        </div>
        <div className={`p-3 ${backgroundColor} rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}

/**
 * Order Table Row Component
 */
interface OrderTableRowProps {
  order: OrderType;
  onEdit: () => void;
  onDelete: () => void;
}

function OrderTableRow({ order, onEdit, onDelete }: OrderTableRowProps) {
  return (
    <tr className="border-b border-border-default dark:border-white/10 hover:bg-secondary dark:hover:bg-gray-800/30 transition-colors">
      <td className="px-6 py-4 text-sm font-medium text-primary dark:text-white">
        {formatOrderId(order.id)}
      </td>
      <td className="px-6 py-4 text-sm font-semibold text-primary dark:text-white">
        {formatPrice(order.orderTotal)}
      </td>
      <td className="px-6 py-4 text-sm text-secondary dark:text-slate-400">
        {formatOrderDate(order.orderPlaced)}
      </td>
      <td className="px-6 py-4 text-center">
        {order.orderPaid ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
            <FiCheckCircle className="w-3 h-3" />
            Paid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <FiClock className="w-3 h-3" />
            Pending
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
            title="Edit"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
            title="Delete"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}