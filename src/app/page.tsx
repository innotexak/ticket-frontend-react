'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryApi, eventApi, orderApi, Category, Event as EventType, Order } from '@/lib/services';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
 <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-lg">
              ▲
            </div>
            <span className="text-xl font-semibold tracking-tight">TicketHub</span>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <Link href="/categories" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Categories</Link>
            <Link href="/events" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Events</Link>
            <Link href="/orders" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Orders</Link>
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
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"> Events</span>
                {' '}Effortlessly
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                A modern ticketing platform designed for seamless event management, category organization, and order tracking. Built with precision, powered by speed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center"
              >
                Explore Events →
              </Link>
              <Link
                href="/categories"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 text-center"
              >
                Manage Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-400">{loading ? '—' : categories.length}</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">{loading ? '—' : events.length}</div>
                <div className="text-sm text-gray-400">Events</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">{loading ? '—' : orders.length}</div>
                <div className="text-sm text-gray-400">Orders</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-slate-800/80 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-white/30 transition">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p className="text-gray-400">Create, organize, and manage events with detailed information and pricing.</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-slate-800/80 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-white/30 transition">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏷️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Categories</h3>
                <p className="text-gray-400">Organize events into intuitive categories for better discoverability.</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-slate-800/80 backdrop-blur border border-white/10 rounded-2xl p-8 hover:border-white/30 transition">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
                <p className="text-gray-400">Monitor orders in real-time and manage payment statuses efficiently.</p>
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
            <p className="text-gray-400">Discover the latest events available</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.eventId}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50 backdrop-blur hover:border-white/30 transition"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80"></div>
                <div className="relative p-6 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition">{event.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{event.artist}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                    <span className="text-2xl font-bold text-cyan-400">${event.price}</span>
                    <span className="text-xs text-gray-500">
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
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10"></div>
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold">Ready to Manage Your Ticketing?</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get started today and streamline your event management process with TicketHub.
            </p>
            <Link
              href="/orders"
              className="inline-block px-10 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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