import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@aniheal.co.ke');
  const [password, setPassword] = useState('AniHeal2025!');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-md font-bold">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <div className="text-left">
            <span className="font-headline-lg text-headline-lg text-primary font-bold block leading-none">
              AniHeal
            </span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold block mt-1">
              CMS Portal
            </span>
          </div>
        </Link>
        <h2 className="mt-6 font-headline-xl text-headline-xl font-bold text-on-surface">
          Admin Dashboard Login
        </h2>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
          Authorized clinical managers &amp; administrators only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface-clinical py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-border-hairline space-y-6">
          {/* Quick Demo Credentials Callout */}
          <div className="p-4 rounded-xl bg-surface-tinted border border-border-accent flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm font-bold uppercase">
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Default SuperAdmin Credentials</span>
            </div>
            <div className="text-xs text-on-surface font-mono bg-surface-clinical p-2 rounded border border-border-hairline flex flex-col gap-0.5">
              <span><strong>Email:</strong> admin@aniheal.co.ke</span>
              <span><strong>Password:</strong> AniHeal2025!</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-error-container text-on-error-container text-body-sm font-semibold flex items-center gap-2 animate-fade-in border border-error/20">
              <span className="material-symbols-outlined text-[20px] text-error">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary transition-all"
                placeholder="admin@aniheal.co.ke"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">lock_open</span>
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-border-hairline text-center">
            <Link to="/" className="text-body-sm text-primary hover:underline font-semibold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
