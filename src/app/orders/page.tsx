'use client';

import { useEffect, useState } from 'react';
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
  FiUser,
  FiCalendar,
} from 'react-icons/fi';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaid, setFilterPaid] = useState<'all' | 'paid' | 'unpaid'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    orderId: '',
    userId: '',
    orderTotal: 0,
    orderPlaced: '',
    orderPaid: false,
  });

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getAll();
      setOrders(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      await fetchOrders();
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
        await orderApi.update(editingId, { ...payload, orderId: editingId });
        setSuccess('Order updated successfully');
      } else {
        await orderApi.create(payload);
        setSuccess('Order created successfully');
      }

      setIsModalOpen(false);
      await fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterPaid === 'all' ||
      (filterPaid === 'paid' && order.orderPaid) ||
      (filterPaid === 'unpaid' && !order.orderPaid);

    return matchesSearch && matchesFilter;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.orderTotal, 0);
  const paidOrders = orders.filter((o) => o.orderPaid).length;
  const pendingOrders = orders.length - paidOrders;

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-white">Orders</h1>
              <p className="text-lg text-slate-400">Manage and track all customer orders</p>
            </div>
            <button
              onClick={openCreate}
              className="group relative flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 self-start lg:self-auto bg-blue-600 hover:bg-blue-700"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Order</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {/* Total Orders */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Total Orders</span>
                <div className="p-2 bg-blue-900/30 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white">{orders.length}</div>
              <p className="text-xs text-slate-500 mt-2">All time</p>
            </div>

            {/* Total Revenue */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Total Revenue</span>
                <div className="p-2 bg-green-900/30 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-green-400" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-2">Generated revenue</p>
            </div>

            {/* Paid Orders */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Paid Orders</span>
                <div className="p-2 bg-emerald-900/30 rounded-lg">
                  <FiCheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white">{paidOrders}</div>
              <p className="text-xs text-slate-500 mt-2">Completed payments</p>
            </div>

            {/* Pending Orders */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Pending</span>
                <div className="p-2 bg-amber-900/30 rounded-lg">
                  <FiClock className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div className="text-4xl font-bold text-white">{pendingOrders}</div>
              <p className="text-xs text-slate-500 mt-2">Awaiting payment</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Filters and Search */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <FiSearch className="w-4 h-4" />
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by order ID or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <FiFilter className="w-4 h-4" />
                Filter by Status
              </label>
              <select
                value={filterPaid}
                onChange={(e) => setFilterPaid(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer"
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
                  setSearchQuery('');
                  setFilterPaid('all');
                }}
                className="w-full px-4 py-2.5 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-700/50 hover:border-slate-500 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Orders Display */}
        {isLoading && !orders.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-white mb-2">No orders found</h3>
            <p className="text-slate-400 mb-8 text-lg">
              {orders.length === 0 ? 'Get started by creating your first order.' : 'Try adjusting your filters.'}
            </p>
            {orders.length === 0 && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
              >
                <FiPlus className="w-5 h-5" />
                Create First Order
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, idx) => (
              <div
                key={order.id}
                className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 hover:bg-slate-800/80 transition-all duration-300"
                style={{
                  animation: `slideIn 0.3s ease-out ${idx * 50}ms backwards`,
                }}
              >
                <style>{`
                  @keyframes slideIn {
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

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300 border border-slate-600">
                        #
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Order {order.id.slice(0, 8).toUpperCase()}</h3>
                        <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                          <FiUser className="w-4 h-4" />
                          <span>{order.userId}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-3 gap-6 lg:w-auto">
                    {/* Amount */}
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Amount</p>
                      <p className="text-2xl font-bold text-white">${order.orderTotal.toFixed(2)}</p>
                    </div>

                    {/* Date */}
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Date</p>
                      <p className="text-sm font-medium text-slate-300">
                        {new Date(order.orderPlaced).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">Status</p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          order.orderPaid
                            ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                            : 'bg-amber-900/30 text-amber-400 border border-amber-700/50'
                        }`}
                      >
                        {order.orderPaid ? (
                          <>
                            <FiCheckCircle className="w-4 h-4" />
                            Paid
                          </>
                        ) : (
                          <>
                            <FiClock className="w-4 h-4" />
                            Pending
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-700 lg:pl-6 lg:ml-6">
                    <button
                      onClick={() => openEdit(order)}
                      className="flex-1 lg:flex-none px-4 py-2.5 bg-blue-900/30 text-blue-400 border border-blue-700/50 font-semibold rounded-lg hover:bg-blue-900/50 hover:border-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="flex-1 lg:flex-none px-4 py-2.5 bg-red-900/30 text-red-400 border border-red-700/50 font-semibold rounded-lg hover:bg-red-900/50 hover:border-red-600 transition flex items-center justify-center gap-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal isOpen={isModalOpen} title={editingId ? 'Edit Order' : 'Create Order'} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">User ID *</label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="Enter user ID"
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Order Total *</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={String(formData.orderTotal)}
                onChange={(e) => setFormData({ ...formData, orderTotal: Number(e.target.value) })}
                placeholder="0.00"
                required
                className="w-full pl-7 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Order Placed *</label>
            <input
              type="datetime-local"
              value={formData.orderPlaced}
              onChange={(e) => setFormData({ ...formData, orderPlaced: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-700/30 border border-slate-600 p-4 rounded-lg">
            <input
              id="paid"
              type="checkbox"
              checked={formData.orderPaid}
              onChange={(e) => setFormData({ ...formData, orderPaid: e.target.checked })}
              className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
            />
            <label htmlFor="paid" className="text-sm font-semibold text-slate-300 cursor-pointer flex-1">
              Mark as paid
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-700/50 hover:border-slate-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 transform hover:scale-105 active:scale-95"
            >
              {editingId ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}