import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(false);

  /**
   * Request 6-digit Email OTP via Resend
   */
  const sendOtp = async (email) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/send-otp', { email });
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Passcode dispatched to your email address.',
          data: response.data,
        };
      }
      return {
        success: false,
        message: response.message || 'Unable to dispatch verification passcode.',
      };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Failed to send verification email.',
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 1: Validate Email + Password credentials; triggers Resend OTP email
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success) {
        if (response.data?.requireOtp) {
          return {
            success: true,
            requireOtp: true,
            email: response.data.email,
            message: response.message || 'Verification passcode dispatched to your email.',
          };
        }
        // Direct login fallback
        if (response.data?.token) {
          const { token: authToken, user: userData, mustChangePassword } = response.data;
          setToken(authToken);
          setUser(userData);
          localStorage.setItem('auth_token', authToken);
          localStorage.setItem('auth_user', JSON.stringify(userData));
          return {
            success: true,
            user: userData,
            mustChangePassword: !!mustChangePassword,
          };
        }
      }
      return { success: false, message: response.message || 'Authentication failed' };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Invalid email or password',
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Verify Email OTP and Sign In
   */
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      if (response.success && response.data) {
        const { token: authToken, user: userData, mustChangePassword } = response.data;
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('auth_token', authToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return {
          success: true,
          user: userData,
          mustChangePassword: !!mustChangePassword,
        };
      }
      return { success: false, message: response.message || 'Invalid passcode.' };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Passcode verification failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change Password (for forced first-time login change or profile update)
   */
  const changePassword = async (newPassword, currentPassword) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/change-password', {
        newPassword,
        ...(currentPassword && { currentPassword }),
      });
      if (response.success) {
        if (response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('auth_user', JSON.stringify(response.data.user));
        } else if (user) {
          const updatedUser = { ...user, mustChangePassword: false };
          setUser(updatedUser);
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
        return {
          success: true,
          message: response.message || 'Password updated successfully!',
        };
      }
      return { success: false, message: response.message || 'Failed to update password.' };
    } catch (error) {
      return {
        success: false,
        message: error.data?.message || error.message || 'Failed to update password.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout', {});
      }
    } catch {
      // Ignore network failure on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    return await fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isSuperAdmin: user?.role === 'superadmin' || user?.role === 'admin',
        loading,
        sendOtp,
        verifyOtp,
        login,
        changePassword,
        logout,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
