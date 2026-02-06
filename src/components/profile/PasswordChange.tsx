'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/Alert';

interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordChange() {
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement password change API call
      // await authApi.changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword
      // });
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please check your current password and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 0, text: 'Very Weak', color: 'bg-red-500' },
      { strength: 1, text: 'Weak', color: 'bg-red-400' },
      { strength: 2, text: 'Fair', color: 'bg-yellow-500' },
      { strength: 3, text: 'Good', color: 'bg-blue-500' },
      { strength: 4, text: 'Strong', color: 'bg-green-500' },
      { strength: 5, text: 'Very Strong', color: 'bg-green-600' },
    ];

    return levels[strength] || levels[0];
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-primary dark:bg-gray-800 rounded-lg shadow-lg border border-border-default dark:border-white/10">
        <div className="p-6 border-b border-border-default dark:border-white/10">
          <h2 className="text-2xl font-bold text-primary dark:text-white">Change Password</h2>
          <p className="text-secondary dark:text-gray-400 mt-1">Update your password to keep your account secure</p>
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
            <Input
              label="Current Password"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange}
              required
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="text-tertiary hover:text-primary dark:hover:text-white transition"
                >
                  {showPasswords.current ? '👁️' : '🙈'}
                </button>
              }
            />

            <div className="space-y-2">
              <Input
                label="New Password"
                name="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="text-tertiary hover:text-primary dark:hover:text-white transition"
                  >
                    {showPasswords.new ? '👁️' : '🙈'}
                  </button>
                }
              />
              
              {formData.newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary dark:text-gray-400">Password Strength:</span>
                    <span className={`text-sm font-medium ${
                      passwordStrength.strength >= 3 ? 'text-green-600 dark:text-green-400' : 
                      passwordStrength.strength >= 2 ? 'text-yellow-600 dark:text-yellow-400' : 
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full bg-border-default dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <ul className="text-xs text-secondary dark:text-gray-400 space-y-1">
                    <li className={formData.newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}>
                      ✓ At least 8 characters
                    </li>
                    <li className={/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                      ✓ Upper and lowercase letters
                    </li>
                    <li className={/\d/.test(formData.newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                      ✓ At least one number
                    </li>
                    <li className={/[^a-zA-Z\d]/.test(formData.newPassword) ? 'text-green-600 dark:text-green-400' : ''}>
                      ✓ At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? 'Passwords do not match' : ''}
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="text-tertiary hover:text-primary dark:hover:text-white transition"
                >
                  {showPasswords.confirm ? '👁️' : '🙈'}
                </button>
              }
            />

            <div className="flex justify-end space-x-3 pt-6 border-t border-border-default dark:border-white/10">
              <button 
                type="button" 
                className="px-4 py-2 border border-border-default dark:border-white/10 text-primary dark:text-white font-semibold rounded-lg hover:bg-hover dark:hover:bg-gray-700/50 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 transform hover:scale-105 active:scale-95"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordChange;