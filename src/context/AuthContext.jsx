import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of inactivity

export function AuthProvider({ children }) {
  // Purge any legacy localStorage tokens on initialize to ensure no persistent credentials remain on device
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('auth_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(false);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  // Logout helper
  const logout = async (reason) => {
    try {
      if (token) {
        await api.post('/auth/logout', {});
      }
    } catch {
      // Ignore network failure on logout
    } finally {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      if (reason === 'inactivity') {
        setSessionExpiredMessage('Your session timed out after 15 minutes of inactivity. Please re-authenticate with OTP.');
      }
    }
  };

  // Inactivity session timeout listener
  useEffect(() => {
    if (!token || !user) return;

    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout('inactivity');
      }, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    
    // Throttle event listeners so they don't trigger every millisecond
    let lastActivityTime = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > 3000) { // Check every 3 seconds of continuous motion
        lastActivityTime = now;
        resetTimer();
      }
    };

    resetTimer();
    activityEvents.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));

    // Global session expired event from API interceptor (e.g. 401 token expired)
    const handleSessionExpired = () => {
      setUser(null);
      setToken(null);
      setSessionExpiredMessage('Your 15-minute session token has expired. Please verify your identity with OTP.');
    };
    window.addEventListener('aniheal:session-expired', handleSessionExpired);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((event) => window.removeEventListener(event, handleActivity));
      window.removeEventListener('aniheal:session-expired', handleSessionExpired);
    };
  }, [token, user]);

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
    setSessionExpiredMessage('');
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
          sessionStorage.setItem('auth_token', authToken);
          sessionStorage.setItem('auth_user', JSON.stringify(userData));
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
    setSessionExpiredMessage('');
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      if (response.success && response.data) {
        const { token: authToken, user: userData, mustChangePassword } = response.data;
        setToken(authToken);
        setUser(userData);
        sessionStorage.setItem('auth_token', authToken);
        sessionStorage.setItem('auth_user', JSON.stringify(userData));
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
          sessionStorage.setItem('auth_user', JSON.stringify(response.data.user));
        } else if (user) {
          const updatedUser = { ...user, mustChangePassword: false };
          setUser(updatedUser);
          sessionStorage.setItem('auth_user', JSON.stringify(updatedUser));
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
        sessionExpiredMessage,
        setSessionExpiredMessage,
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
