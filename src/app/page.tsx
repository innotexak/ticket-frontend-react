'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryApi, eventApi, orderApi, Category, Event as EventType, Order } from '@/lib/services';
import { useTheme } from '@/contexts/ThemeContext';


export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, e, o] = await Promise.all([
          categoryApi.getAll(),
          eventApi.getAll(),
          orderApi.getAll(),
        ]);
        setCategories(c || []);
        setEvents(e || []);
        setOrders(o || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
 <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 text-slate-900'} overflow-hidden transition-colors duration-300`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-10 border-b ${resolvedTheme === 'dark' ? 'border-white/10 backdrop-blur-sm bg-slate-900/50' : 'border-slate-200/50 backdrop-blur-sm bg-white/50'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${resolvedTheme === 'dark' ? 'from-blue-400 to-cyan-500' : 'from-blue-500 to-cyan-600'} rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-lg`}>
              🎫
            </div>
            <span className="text-xl font-semibold tracking-tight">TicketHub</span>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <Link href="/categories" className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Categories</Link>
            <Link href="/events" className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Events</Link>
            <Link href="/orders" className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} transition-colors`}>Orders</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Manage Your
                <span className={`bg-gradient-to-r ${resolvedTheme === 'dark' ? 'from-blue-400 via-cyan-400 to-blue-500' : 'from-blue-600 via-cyan-600 to-blue-700'} bg-clip-text text-transparent`}> Events</span>
                {' '}Effortlessly
              </h1>
              <p className={`text-lg ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-slate-600'} leading-relaxed`}>
                A modern ticketing platform designed for seamless event management, category organization, and order tracking. Built with precision, powered by speed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className={`px-8 py-4 bg-gradient-to-r ${resolvedTheme === 'dark' ? 'from-blue-500 to-cyan-500 hover:shadow-blue-500/50' : 'from-blue-600 to-cyan-600 hover:shadow-blue-600/50'} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center`}
              >
                Explore Events →
              </Link>
              <Link
                href="/categories"
                className={`px-8 py-4 border ${resolvedTheme === 'dark' ? 'border-white/20 hover:bg-white/10' : 'border-slate-300 hover:bg-slate-100'} font-semibold rounded-lg transition-all duration-300 text-center`}
              >
                Manage Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${resolvedTheme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{loading ? '—' : categories.length}</div>
                <div className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Categories</div>
              </div>
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{loading ? '—' : events.length}</div>
                <div className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Events</div>
              </div>
              <div className="space-y-2">
                <div className={`text-3xl font-bold ${resolvedTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{loading ? '—' : orders.length}</div>
                <div className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`}>Orders</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${resolvedTheme === 'dark' ? 'from-blue-500 to-cyan-500' : 'from-blue-400 to-cyan-400'} rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300`}></div>
              <div className={`relative ${resolvedTheme === 'dark' ? 'bg-slate-800/80 border-white/10 hover:border-white/30' : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'} backdrop-blur rounded-2xl p-8 transition`}>
                <div className={`w-12 h-12 ${resolvedTheme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>Create, organize, and manage events with detailed information and pricing.</p>
              </div>
            </div>

            <div className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${resolvedTheme === 'dark' ? 'from-purple-500 to-pink-500' : 'from-purple-400 to-pink-400'} rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300`}></div>
              <div className={`relative ${resolvedTheme === 'dark' ? 'bg-slate-800/80 border-white/10 hover:border-white/30' : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'} backdrop-blur rounded-2xl p-8 transition`}>
                <div className={`w-12 h-12 ${resolvedTheme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl">🏷️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Categories</h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>Organize events into intuitive categories for better discoverability.</p>
              </div>
            </div>

            <div className="group relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${resolvedTheme === 'dark' ? 'from-cyan-500 to-blue-500' : 'from-cyan-400 to-blue-400'} rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300`}></div>
              <div className={`relative ${resolvedTheme === 'dark' ? 'bg-slate-800/80 border-white/10 hover:border-white/30' : 'bg-white/80 border-slate-200/50 hover:border-slate-300/50'} backdrop-blur rounded-2xl p-8 transition`}>
                <div className={`w-12 h-12 ${resolvedTheme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>Monitor orders in real-time and manage payment statuses efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Preview */}
      {!loading && events.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2">Featured Events</h2>
            <p className={resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-600'}>Discover the latest events available</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.eventId}
                className={`group relative overflow-hidden rounded-2xl border ${resolvedTheme === 'dark' ? 'border-white/10 bg-slate-800/50 hover:border-white/30' : 'border-slate-200/50 bg-white/50 hover:border-slate-300/50'} backdrop-blur transition`}
              >
                <div className={`absolute inset-0 ${resolvedTheme === 'dark' ? 'bg-gradient-to-b from-transparent to-slate-900/80' : 'bg-gradient-to-b from-transparent to-white/80'}`}></div>
                <div className="relative p-6 flex flex-col h-full justify-between">
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${resolvedTheme === 'dark' ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600'} transition`}>{event.name}</h3>
                    <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-slate-600'} mb-4`}>{event.artist}</p>
                    <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-slate-700'} line-clamp-2`}>{event.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                    <span className={`text-2xl font-bold ${resolvedTheme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>${event.price}</span>
                    <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-slate-500'}`}>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className={`relative rounded-2xl overflow-hidden border ${resolvedTheme === 'dark' ? 'border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'border-slate-200/50 bg-gradient-to-r from-blue-100/50 to-cyan-100/50'} p-12 text-center`}>
          <div className={`absolute inset-0 ${resolvedTheme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10' : 'bg-gradient-to-r from-blue-200 to-cyan-200 opacity-30'}`}></div>
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold">Ready to Manage Your Ticketing?</h2>
            <p className={`text-lg ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-slate-700'} max-w-2xl mx-auto`}>
              Get started today and streamline your event management process with TicketHub.
            </p>
            <Link
              href="/orders"
              className={`inline-block px-10 py-4 ${resolvedTheme === 'dark' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'} font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}