'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoryApi, eventApi, orderApi, Category, Event as EventType, Order } from '@/lib/services';
import Header from '@/components/Header';

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
        setCategories(c?.items || []);
        setEvents(e || []);
        setOrders(o?.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden transition-colors duration-300">
      {/* Animated background elements - dark mode only */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="dark:absolute dark:-top-40 dark:-right-40 dark:w-80 dark:h-80 dark:bg-blue-500 dark:rounded-full dark:mix-blend-multiply dark:filter dark:blur-3xl dark:opacity-20 dark:animate-blob"></div>
        <div className="dark:absolute dark:-bottom-40 dark:-left-40 dark:w-80 dark:h-80 dark:bg-purple-500 dark:rounded-full dark:mix-blend-multiply dark:filter dark:blur-3xl dark:opacity-20 dark:animate-blob dark:animation-delay-2000"></div>
        <div className="dark:absolute dark:top-1/2 dark:left-1/2 dark:w-80 dark:h-80 dark:bg-cyan-500 dark:rounded-full dark:mix-blend-multiply dark:filter dark:blur-3xl dark:opacity-20 dark:animate-blob dark:animation-delay-4000"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Manage Your
                <span className="gradient-text block"> Events</span>
                Effortlessly
              </h1>
              <p className="text-secondary text-lg leading-relaxed">
                A modern ticketing platform designed for seamless event management, category organization, and order tracking. Built with precision, powered by speed.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-center"
              >
                Explore Events →
              </Link>
              <Link
                href="/categories"
                className="px-8 py-4 border border-border-default hover:bg-hover font-semibold rounded-lg transition-all duration-300 text-center"
              >
                Manage Categories
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-cyan-500">{loading ? '—' : categories.length ?? 0}</div>
                <div className="text-sm text-tertiary">Categories</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-500">{loading ? '—' : events.length ?? 0}</div>
                <div className="text-sm text-tertiary">Events</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-500">{loading ? '—' : orders.length ?? 0}</div>
                <div className="text-sm text-tertiary">Orders</div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300 dark:block hidden"></div>
              <div className="relative bg-primary border border-border-default dark:border-white/10 hover:border-border-light dark:hover:border-white/30 rounded-2xl p-8 transition backdrop-blur">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p className="text-secondary">Create, organize, and manage events with detailed information and pricing.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300 dark:block hidden"></div>
              <div className="relative bg-primary border border-border-default dark:border-white/10 hover:border-border-light dark:hover:border-white/30 rounded-2xl p-8 transition backdrop-blur">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🏷️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Categories</h3>
                <p className="text-secondary">Organize events into intuitive categories for better discoverability.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-75 transition duration-300 dark:block hidden"></div>
              <div className="relative bg-primary border border-border-default dark:border-white/10 hover:border-border-light dark:hover:border-white/30 rounded-2xl p-8 transition backdrop-blur">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
                <p className="text-secondary">Monitor orders in real-time and manage payment statuses efficiently.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      {!loading && events.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-2">Featured Events</h2>
            <p className="text-secondary">Discover the latest events available</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.eventId}
                className="group relative overflow-hidden rounded-2xl border border-border-default dark:border-white/10 hover:border-border-light dark:hover:border-white/30 bg-primary dark:bg-slate-800/50 backdrop-blur transition"
              >
                <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-transparent dark:to-slate-900/80"></div>
                <div className="relative p-6 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-500 transition">
                      {event.name}
                    </h3>
                    <p className="text-sm text-secondary mb-4">{event.artist}</p>
                    <p className="text-sm text-primary line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-default dark:border-white/10">
                    <span className="text-2xl font-bold text-cyan-500">${event.price}</span>
                    <span className="text-xs text-tertiary">
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
        <div className="relative rounded-2xl overflow-hidden border border-border-default dark:border-white/10 bg-primary dark:bg-gradient-to-r dark:from-blue-500/10 dark:to-cyan-500/10 p-12 text-center">
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-blue-500 dark:to-cyan-500 dark:opacity-10"></div>
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold">Ready to Manage Your Ticketing?</h2>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              Get started today and streamline your event management process with TicketHub.
            </p>
            <Link
              href="/orders"
              className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Animations */}
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