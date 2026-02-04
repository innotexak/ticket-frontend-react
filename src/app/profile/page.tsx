'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Alert';
import type { UpdateAccountCommand } from '@/types/auth';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { user, updateProfile, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(false);
    setShowSuccess(false);

    try {
      const updateData: UpdateAccountCommand = {
        firstName: formData.firstName !== user?.firstName ? formData.firstName : undefined,
        lastName: formData.lastName !== user?.lastName ? formData.lastName : undefined,
        email: formData.email !== user?.email ? formData.email : undefined,
      };

      await updateProfile(updateData);
      setShowSuccess(true);
      setIsEditing(false);
    } catch (err) {
      setShowAlert(true);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
    setIsEditing(false);
    setShowAlert(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const hasChanges = 
    formData.firstName !== user?.firstName ||
    formData.lastName !== user?.lastName ||
    formData.email !== user?.email;

  if (isLoading) {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Logout
              </Button>
            </div>

            {showAlert && (
              <Alert 
                message="Failed to update profile. Please try again." 
                type="error" 
                onClose={handleAlertClose}
              />
            )}

            {showSuccess && (
              <Alert 
                message="Profile updated successfully!" 
                type="success"
              />
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        disabled={!isEditing}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                        } rounded-md shadow-sm text-gray-900 sm:text-sm`}
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        disabled={!isEditing}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                        } rounded-md shadow-sm text-gray-900 sm:text-sm`}
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      } rounded-md shadow-sm text-gray-900 sm:text-sm`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    {isEditing ? (
                      <>
                        <Button
                          type="button"
                          onClick={handleCancel}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={!hasChanges}
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">User ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user?.userId}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user?.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'N/A'}
                      </dd>
                    </div>
                    {user?.lastModifiedDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(user.lastModifiedDate).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
