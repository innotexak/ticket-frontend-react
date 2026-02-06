'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Modal } from '@/components/Modal';
import { Alert } from '@/components/Alert';
import { Order, orderApi, PaginatedResponse } from '@/lib/services';
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

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

export default function OrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    orderId: '',
    userId: '',
    orderTotal: 0,
    orderPlaced: '',
    orderPaid: false,
  });

  const searchQuery = searchParams.get('q') || '';
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0;

  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const filterParam = searchParams.get('status') || 'all';
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'unpaid'>(
    filterParam as 'all' | 'paid' | 'unpaid'
  );

  const updateUrl = (query: string = '', page: number = 0, status: string = 'all') => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (page > 0) params.append('page', (page + 1).toString());
    if (status !== 'all') params.append('status', status);

    const queryString = params.toString();
    router.push(`/orders${queryString ? `?${queryString}` : ''}`);
  };

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
        if (filterPaid === 'paid') {
          filteredItems = filteredItems.filter((o) => o.orderPaid);
        } else if (filterPaid === 'unpaid') {
          filteredItems = filteredItems.filter((o) => !o.orderPaid);
        }

        setOrders(filteredItems);
        setTotalCount(data.totalCount);
        setHasNext(data.hasNext);
        setHasPrevious(data.hasPrevious);
      } else if (Array.isArray(data)) {
        let filteredItems = data || [];
        if (filterPaid === 'paid') {
          filteredItems = filteredItems.filter((o) => o.orderPaid);
        } else if (filterPaid === 'unpaid') {
          filteredItems = filteredItems.filter((o) => !o.orderPaid);
        }

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

  useEffect(() => {
    fetchOrders(currentPage, searchQuery);
  }, [currentPage, searchQuery, filterPaid]);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const newFilter = (searchParams.get('status') || 'all') as 'all' | 'paid' | 'unpaid';
    if (newFilter !== filterPaid) {
      setFilterPaid(newFilter);
    }
  }, [searchParams]);

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

  const handleClearSearch = () => {
    setInputValue('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    updateUrl('', 0, filterPaid);
  };

  const handleFilterChange = (newFilter: 'all' | 'paid' | 'unpaid') => {
    setFilterPaid(newFilter);
    updateUrl(inputValue, 0, newFilter);
  };

  const handlePageChange = (newPage: number) => {
    updateUrl(inputValue, newPage, filterPaid);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      userId: '',
      orderId: '',
      orderTotal: 0,
      orderPlaced: new Date().toISOString().slice(0, 16),
      orderPaid: false,
    });
    setIsModalOpen(true);
  };

  const openEdit = (o: Order) => {
    setEditingId(o.id);
    setFormData({
      orderId: o.id,
      userId: o.userId,
      orderTotal: o.orderTotal,
      orderPlaced: new Date(o.orderPlaced).toISOString().slice(0, 16),
      orderPaid: o.orderPaid,
    });
    setIsModalOpen(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        userId: formData.userId,
        orderTotal: Number(formData.orderTotal),
        orderPlaced: new Date(formData.orderPlaced).toISOString(),
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

  const totalRevenue = orders.reduce((sum, order) => sum + order.orderTotal, 0);
  const paidOrders = orders.filter((o) => o.orderPaid).length;
  const pendingOrders = orders.length - paidOrders;

  const pageStart = currentPage * PAGE_SIZE + 1;
  const pageEnd = Math.min((currentPage + 1) * PAGE_SIZE, totalCount);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-primary">Orders</h1>
              <p className="text-secondary mt-2">Manage and track all customer orders</p>
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
            <div className="bg-primary border border-border-default rounded-lg p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Total Orders</p>
                  <p className="text-3xl font-bold text-primary">{orders.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-primary border border-border-default rounded-lg p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Paid Orders */}
            <div className="bg-primary border border-border-default rounded-lg p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Paid Orders</p>
                  <p className="text-3xl font-bold text-primary">{paidOrders}</p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <FiCheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-primary border border-border-default rounded-lg p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Pending</p>
                  <p className="text-3xl font-bold text-primary">{pendingOrders}</p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <FiClock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Filters and Search */}
        <div className="bg-primary border border-border-default rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Search Orders</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-tertiary w-5 h-5" />
                <Input
                  type="number"
                  placeholder="Search amount"
                  value={inputValue}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border-default dark:text-primary placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {inputValue && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-3 text-tertiary hover:text-primary transition"
                    title="Clear search"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Filter by Status</label>
              <select
                value={filterPaid}
                onChange={(e) => handleFilterChange(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-secondary border border-border-default text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none cursor-pointer"
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Clear Button */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setInputValue('');
                  setFilterPaid('all');
                  if (debounceTimer.current) {
                    clearTimeout(debounceTimer.current);
                  }
                  updateUrl('', 0, 'all');
                }}
                className="w-full px-4 py-2.5 border border-border-default text-primary font-semibold rounded-lg hover:bg-hover transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="text-sm text-secondary">
              Showing <span className="font-semibold text-primary">{pageStart}</span> to{' '}
              <span className="font-semibold text-primary">{pageEnd}</span> of{' '}
              <span className="font-semibold text-primary">{totalCount}</span> orders
              {inputValue && <span className="ml-2">• Search: "{inputValue}"</span>}
              {filterPaid !== 'all' && <span className="ml-2">• Status: {filterPaid}</span>}
            </div>
          )}
        </div>

        {/* Orders Table */}
        {isLoading && !orders.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-border-default border-t-blue-500 animate-spin mx-auto mb-4"></div>
              <p className="text-secondary font-medium">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-primary border border-border-default rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-primary mb-2">No orders found</h3>
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
                <tr className="border-b border-border-default bg-secondary">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-primary">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border-default hover:bg-secondary transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-primary">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">${order.orderTotal.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {new Date(order.orderPlaced).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
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
                          onClick={() => openEdit(order)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
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
              className="flex items-center gap-2 px-4 py-2 border border-border-default text-primary font-medium rounded-lg hover:bg-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2 text-secondary">
              <span>Page</span>
              <span className="font-semibold text-primary">{currentPage + 1}</span>
              <span>of</span>
              <span className="font-semibold text-primary">{totalPages || 1}</span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext || isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-border-default text-primary font-medium rounded-lg hover:bg-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        title={editingId ? 'Edit Order' : 'Create Order'}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Order Total *</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-tertiary font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={String(formData.orderTotal)}
                onChange={(e) => setFormData({ ...formData, orderTotal: Number(e.target.value) })}
                placeholder="0.00"
                required
                className="w-full pl-7 pr-4 py-2.5 bg-secondary border border-border-default text-primary placeholder-tertiary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-2">Order Placed *</label>
            <input
              type="datetime-local"
              value={formData.orderPlaced}
              onChange={(e) => setFormData({ ...formData, orderPlaced: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-secondary border border-border-default text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 bg-secondary border border-border-default p-4 rounded-lg">
            <input
              id="paid"
              type="checkbox"
              checked={formData.orderPaid}
              onChange={(e) => setFormData({ ...formData, orderPaid: e.target.checked })}
              className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
            />
            <label htmlFor="paid" className="text-sm font-semibold text-primary cursor-pointer flex-1">
              Mark as paid
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border-default">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 border border-border-default text-primary font-semibold rounded-lg hover:bg-hover transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 transform hover:scale-105 active:scale-95"
            >
              {editingId ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}