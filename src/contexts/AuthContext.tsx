'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/services';
import type { 
  AuthState, 
  AuthContextType, 
  LoginCommand, 
  RegisterUserCommand, 
  UpdateAccountCommand,
  UserProfile, 
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ResetPasswordCommand
} from '@/types/auth';
import { AuthAction } from './types';

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};


// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.  accessToken ,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'REGISTER_SUCCESS':
      return { ...state, isLoading: false, error: null };
    
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        user: action.payload,
      };
    case "CHANGE_PASSWORD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
      };

    case 'FORGOT_PASSWORD_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
      
      case 'RESET_PASSWORD_SUCCESS':
        return {
          ...state,
          isLoading: false,
          error: null,
        };

    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');

        if (token && refreshToken && userStr) {
          try {
            const user = JSON.parse(userStr);
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user, accessToken:token, refreshToken }
            });
          } catch (error) {
            console.error('Failed to parse user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCommand) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const responseRaw = await authApi.login(credentials);
      const response = responseRaw.data;
      if (!response) {
        throw new Error('Login response is empty');
      }

      const user: UserProfile = {
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        createdDate: new Date().toISOString(),
      };

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, accessToken: response.accessToken, refreshToken: response.refreshToken }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterUserCommand) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      await authApi.register(userData);
      dispatch({ type: 'REGISTER_SUCCESS' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    dispatch({ type: 'LOGOUT' });
  };

  // Refresh token function
  const refreshToken = async () => {
    if (!state.refreshToken) {
      logout();
      return;
    }

    try {
      const response = await authApi.refreshToken({
        accessToken: state.accessToken || '',
        refreshToken: state.refreshToken,
      });

      if (!response) {
        throw new Error('Token refresh response is empty');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      dispatch({
        type: 'REFRESH_TOKEN_SUCCESS',
        payload: { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken }
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  // Update profile function
  const updateProfile = async (data: UpdateAccountCommand) => {
    if (!state.user) return;

    try {
      const response = await authApi.updateProfile(data);
      if (response && response.success && state.user) {
        const updatedUser: UserProfile = {
          ...state.user,
          ...data,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

// change password function
const changePassword = async (data: ChangePasswordCommand) => {
  try {
    const response = await authApi.changePassword(data);
    if (response && response.success) {
      dispatch({ type: 'CHANGE_PASSWORD_SUCCESS' });
    }
  } catch (error) {
    console.error('Change password failed:', error);
    throw error;
  }
};

// forgot password function
const forgotPassword = async (data: ForgotPasswordCommand) => {
  try {
    const response = await authApi.forgotPassword(data);
    if (response && response.success) {
      dispatch({ type: 'FORGOT_PASSWORD_SUCCESS' });
    }
  } catch (error) {
    console.error('Forgot password failed:', error);
    throw error;
  }
};

// reset password function
const resetPassword = async (data: ResetPasswordCommand) => {
  try {
    const response = await authApi.resetPassword(data);
    if (response && response.success) {
      dispatch({ type: 'RESET_PASSWORD_SUCCESS' });
    }
  } catch (error) {
    console.error('Reset password failed:', error);
    throw error;
  }
};

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshTokenFn: refreshToken,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
