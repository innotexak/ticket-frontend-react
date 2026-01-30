import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-lg text-gray-900 hidden sm:inline">
                TeiTicket
              </span>
            </Link>
            <nav className="hidden md:flex gap-8">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Categories
              </Link>
              <Link
                href="/events"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Events
              </Link>
              <Link
                href="/orders"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Orders
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-white font-bold">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
