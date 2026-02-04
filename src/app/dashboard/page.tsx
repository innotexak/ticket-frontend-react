'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { categoryApi, eventApi, orderApi, Category, Event as EventType, Order } from '@/lib/services';

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [c, e, o] = await Promise.all([categoryApi.getAll(), eventApi.getAll(), orderApi.getAll()]);
      setCategories(c.items || []);
      setEvents(e || []);
      setOrders(o.items || []);
    } catch (err) {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthenticatedHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Overview of your ticketing data</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchAll}>Refresh</Button>
            <Button variant="secondary" onClick={() => (location.href = '/categories')}>Manage Categories</Button>
            <Button variant="secondary" onClick={() => (location.href = '/events')}>Manage Events</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : categories.length}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total categories</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Events</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : events.length}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total events</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Orders</h3>
            </CardHeader>
            <CardBody>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{loading ? '—' : orders.length}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total orders</p>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Events</h3>
            </CardHeader>
            <CardBody>
              {events.slice(0, 6).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No events yet.</p>
              ) : (
                <ul className="space-y-3">
                  {events.slice(0, 6).map((ev) => (
                    <li key={ev.eventId} className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{ev.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{ev.artist} • {new Date(ev.date).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">${ev.price}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h3>
            </CardHeader>
            <CardBody>
              {orders.slice(0, 6).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet.</p>
              ) : (
                <ul className="space-y-3">
                  {orders.slice(0, 6).map((o) => (
                    <li key={o.id} className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Order {o.id.slice(0, 8)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(o.orderPlaced).toLocaleString()}</div>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">${o.orderTotal}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}
