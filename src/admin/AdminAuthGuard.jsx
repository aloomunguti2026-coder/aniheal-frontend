import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminAuthGuard({ children, requireSuperAdmin = false }) {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-subtle flex items-center justify-center">
        <div className="flex items-center gap-3 p-6 rounded-2xl bg-surface-clinical shadow-sm border border-border-hairline">
          <span className="material-symbols-outlined text-primary text-[28px] animate-spin">
            progress_activity
          </span>
          <span className="font-label-lg text-label-lg text-on-surface font-semibold">
            Verifying Admin Credentials...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-surface-subtle p-8 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-surface-clinical shadow-md text-center border border-border-hairline">
          <div className="w-14 h-14 rounded-full bg-error-container text-error mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px]">shield_lock</span>
          </div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">
            Restricted Access
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            This module requires SuperAdmin privileges. Please contact the administrator.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}
