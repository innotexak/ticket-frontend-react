'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/Card';
import { Input, Select } from '@/components/Form';
import { Modal } from '@/components/Modal';
import { Alert } from '@/components/Alert';
import { Order, orderApi, PaginatedResponse } from '@/lib/services';

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
        await orderApi.update(editingId, {...payload, orderId : editingId});
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Orders</h1>
              <p className="text-lg text-slate-600">Manage and track all customer orders</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Order
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-600 mb-2">Total Orders</div>
              <div className="text-3xl font-bold text-slate-900">{orders.length}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-600 mb-2">Total Revenue</div>
              <div className="text-3xl font-bold text-blue-600">${totalRevenue.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-600 mb-2">Paid Orders</div>
              <div className="text-3xl font-bold text-green-600">{paidOrders}</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-600 mb-2">Pending</div>
              <div className="text-3xl font-bold text-orange-600">{orders.length - paidOrders}</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Orders</label>
              <input
                type="text"
                placeholder="Search by order ID or user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Status</label>
              <select
                value={filterPaid}
                onChange={(e) => setFilterPaid(e.target.value as any)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterPaid('all');
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
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
              <div className="w-12 h-12 rounded-full border-4 border-slate-300 border-t-blue-600 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-600 mb-6">
              {orders.length === 0 ? 'Get started by creating your first order.' : 'Try adjusting your filters.'}
            </p>
            {orders.length === 0 && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create First Order
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {order.id.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Order {order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-slate-600">User: {order.userId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 md:w-auto">
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">Amount</p>
                      <p className="text-xl font-bold text-slate-900">${order.orderTotal.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">Date</p>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(order.orderPlaced).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600 mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.orderPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {order.orderPaid ? '✓ Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l md:pl-6 md:ml-6 border-slate-200">
                    <button
                      onClick={() => openEdit(order)}
                      className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition"
                    >
                      Delete
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
            <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              placeholder="Enter user ID"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Order Total</label>
            <input
              type="number"
              step="0.01"
              value={String(formData.orderTotal)}
              onChange={(e) => setFormData({ ...formData, orderTotal: Number(e.target.value) })}
              placeholder="0.00"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Order Placed</label>
            <input
              type="datetime-local"
              value={formData.orderPlaced}
              onChange={(e) => setFormData({ ...formData, orderPlaced: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg">
            <input
              id="paid"
              type="checkbox"
              checked={formData.orderPaid}
              onChange={(e) => setFormData({ ...formData, orderPaid: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="paid" className="text-sm font-medium text-slate-700 cursor-pointer">
              Mark as paid
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
             
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {editingId ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}