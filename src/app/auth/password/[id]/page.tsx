'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/Alert';
import { authApi } from '@/lib/services';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string>('');
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    const tokenFromUrl = params.id as string;
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setTokenValid(true); // For now, assume valid
    } else {
      setTokenValid(false);
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      setIsLoading(false);
      return;
    }

    try {
    
      await authApi.resetPassword({
        token: token,
        newPassword: formData.newPassword
      });
      
      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting to login...' });
      
      // Redirect to login after successful reset
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password. The link may have expired. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field: 'new' | 'confirm') => {
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

  if (tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Validating reset token...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Invalid Reset Link
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => router.push('/auth/forgotpassword')}
            >
              Request New Reset Link
            </Button>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <a
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          )}

          <div className="space-y-2">
            <Input
              label="New Password"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter your new password"
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.new ? '👁️' : '🙈'}
                </button>
              }
            />
            
            {formData.newPassword && (
              <div className="space-y-2 ml-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Password Strength:</span>
                  <span className={`text-sm font-medium ${
                    passwordStrength.strength >= 3 ? 'text-green-600 dark:text-green-400' : 
                    passwordStrength.strength >= 2 ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
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
            placeholder="Confirm your new password"
            error={formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? 'Passwords do not match' : ''}
            rightIcon={
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.confirm ? '👁️' : '🙈'}
              </button>
            }
          />

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={!formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword}
            >
              Reset Password
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{' '}
                <a
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}