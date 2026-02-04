'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticatedHeader } from '@/components/AuthenticatedHeader';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { categoryApi, eventApi, orderApi, Category, Event as EventType, Order } from '@/lib/services';
import { FiRefreshCw, FiTag, FiCalendar, FiShoppingCart, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import Header from '@/components/Header';

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchAll = async () => {
    try {
      setIsRefreshing(true);
      const [c, e, o] = await Promise.all([categoryApi.getAll(), eventApi.getAll(), orderApi.getAll()]);
      setCategories(c.items || []);
      setEvents(e || []);
      setOrders(o.items || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAll();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Welcome back! Here's your ticketing overview.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-start sm:justify-end">
            <Button 
              onClick={fetchAll}
              disabled={isRefreshing}
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => router.push('/categories')}
              className="flex items-center gap-2"
            >
              <FiTag className="w-4 h-4" />
              <span className="hidden sm:inline">Categories</span>
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => router.push('/events')}
              className="flex items-center gap-2"
            >
              <FiCalendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {/* Categories Card */}
          <Card className="group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Categories
                </h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <FiTag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {loading ? '—' : categories.length}
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                  <FiTrendingUp className="w-4 h-4" />
                  Active
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total categories available</p>
            </CardBody>
          </Card>

          {/* Events Card */}
          <Card className="group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Events
                </h3>
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                  <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {loading ? '—' : events.length}
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                  <FiTrendingUp className="w-4 h-4" />
                  Upcoming
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total events listed</p>
            </CardBody>
          </Card>

          {/* Orders Card */}
          <Card className="group hover:shadow-lg dark:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Orders
                </h3>
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
                  <FiShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {loading ? '—' : orders.length}
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                  <FiTrendingUp className="w-4 h-4" />
                  Total
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total orders placed</p>
            </CardBody>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Events</h3>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardBody>
              {events.slice(0, 6).length === 0 ? (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No events yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 6).map((ev, idx) => (
                    <div
                      key={ev.eventId}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">
                          {ev.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {ev.artist} • {new Date(ev.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">
                          ${ev.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recent Orders */}
          <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <FiShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
              </div>
              <FiArrowRight className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardBody>
              {orders.slice(0, 6).length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 6).map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Order {o.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(o.orderPlaced).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">
                          ${o.orderTotal}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()} • 
            <button 
              onClick={fetchAll}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Refresh now
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}