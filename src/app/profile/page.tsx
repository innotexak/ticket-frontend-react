'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import { ProfileManagement } from '@/components/profile/ProfileManagement';
import { PasswordChange } from '@/components/profile/PasswordChange';
import Header from '@/components/Header';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'security'>('profile');
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg text-secondary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: '👤' },
    { id: 'password', label: 'Password & Security', icon: '🔐' },
    { id: 'security', label: 'Account Security', icon: '🛡️' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  Account Settings
                </h1>
                <p className="mt-1 text-secondary">
                  Manage your profile and security settings
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-primary border border-border-default dark:border-white/10 shadow rounded-lg">
            <div className="border-b border-border-default dark:border-white/10">
              <nav className="flex -mb-px overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-secondary hover:text-primary dark:hover:text-white hover:border-border-default dark:hover:border-white/20'
                      }
                    `}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && <ProfileManagement />}
              {activeTab === 'password' && <PasswordChange />}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-primary dark:text-white mb-4">
                      Account Security
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <span className="text-yellow-400 text-xl">⚠️</span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              Security Recommendations
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                              <ul className="list-disc list-inside space-y-1">
                                <li>Use a strong, unique password</li>
                                <li>Enable two-factor authentication (coming soon)</li>
                                <li>Review your login activity regularly</li>
                                <li>Keep your email address up to date</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-secondary dark:bg-gray-800 rounded-lg p-4 border border-border-default dark:border-white/10">
                          <h4 className="font-medium text-primary dark:text-white mb-2">
                            Login Activity
                          </h4>
                          <p className="text-sm text-secondary mb-3">
                            Monitor your recent account activity
                          </p>
                          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700/50 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition text-sm">
                            View Activity
                          </button>
                        </div>

                        <div className="bg-secondary dark:bg-gray-800 rounded-lg p-4 border border-border-default dark:border-white/10">
                          <h4 className="font-medium text-primary dark:text-white mb-2">
                            Connected Devices
                          </h4>
                          <p className="text-sm text-secondary mb-3">
                            Manage devices that have access to your account
                          </p>
                          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700/50 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition text-sm">
                            Manage Devices
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}