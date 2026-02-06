'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Alert } from '@/components/Alert';
import type { UpdateAccountCommand } from '@/types/auth';

export function ProfileManagement() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(formData as UpdateAccountCommand);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-primary dark:bg-gray-800 rounded-lg shadow-lg border border-border-default dark:border-white/10">
        <div className="p-6 border-b border-border-default dark:border-white/10">
          <h2 className="text-2xl font-bold text-primary dark:text-white">Profile Settings</h2>
          <p className="text-secondary dark:text-gray-400 mt-1">Manage your personal information</p>
        </div>

        <div className="p-6">
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <Avatar
                src={user?.userName ? `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random` : undefined}
                alt={`${user?.firstName} ${user?.lastName}`}
                fallback={`${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`}
                size="xl"
                className="ring-4 ring-border-default dark:ring-white/10"
              />
              <div>
                <h3 className="text-lg font-medium text-primary dark:text-white">Profile Picture</h3>
                <p className="text-sm text-secondary dark:text-gray-400 mt-1">
                  JPG, GIF or PNG. Max size of 2MB
                </p>
                <div className="mt-3 flex space-x-3">
                  <button 
                    type="button" 
                    className="px-4 py-2 border border-border-default dark:border-white/10 text-primary dark:text-white font-semibold rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition text-sm"
                  >
                    Change Avatar
                  </button>
                  <button 
                    type="button" 
                    className="px-4 py-2 hover:bg-hover dark:hover:bg-gray-700/50 text-primary dark:text-white font-semibold rounded-lg transition text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
                helperText="Email cannot be changed. Contact support if needed."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-border-default dark:border-white/10">
              <button 
                type="button" 
                className="px-4 py-2 border border-border-default dark:border-white/10 text-primary dark:text-white font-semibold rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 transform hover:scale-105 active:scale-95"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileManagement;