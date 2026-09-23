import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [step, setStep] = useState('credentials'); // 'credentials' | 'otp' | 'change_password'
  const [email, setEmail] = useState('hello.aniheal@gmail.com');
  const [password, setPassword] = useState('password123');
  const [otp, setOtp] = useState('');
  
  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { login, verifyOtp, sendOtp, changePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Validate Email + Password credentials
  const handleCredentialsSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.trim()) {
      setErrorMsg('Please enter your administrative email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      setIsSubmitting(false);

      if (result.success) {
        if (result.requireOtp) {
          setStep('otp');
          setCooldown(60);
          setSuccessMsg(result.message || `Password verified. Verification code dispatched to ${email}`);
        } else if (result.mustChangePassword) {
          setStep('change_password');
          setSuccessMsg('Authentication successful. Please choose a new permanent password.');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setErrorMsg(result.message || 'Invalid email or password.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to process login. Please verify your connection.');
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.trim().length < 6) {
      setErrorMsg('Please enter the complete 6-digit security passcode.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const result = await verifyOtp(email, otp);
      setIsSubmitting(false);

      if (result.success) {
        if (result.mustChangePassword) {
          setStep('change_password');
          setSuccessMsg('Verification successful! Please establish your permanent password.');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setErrorMsg(result.message || 'Invalid or expired passcode. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Passcode verification failed. Please try again.');
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (cooldown > 0 || isSubmitting) return;
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await sendOtp(email);
    setIsSubmitting(false);

    if (result.success) {
      setCooldown(60);
      setSuccessMsg(`A new verification code has been dispatched to ${email}`);
    } else {
      setErrorMsg(result.message || 'Unable to resend code. Please try again.');
    }
  };

  // Step 3: Mandatory First-Time Password Change
  const handleChangePasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters in length.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Password confirmation does not match the new password.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const result = await changePassword(newPassword);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMsg('Your permanent password has been set successfully! Redirecting...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1200);
      } else {
        setErrorMsg(result.message || 'Failed to update password.');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Error updating password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-md font-bold transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[28px]">verified</span>
          </div>
          <div className="text-left">
            <span className="font-headline-lg text-headline-lg text-primary font-bold block leading-none">
              AniHeal
            </span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold block mt-1">
              Staff Clinical Portal
            </span>
          </div>
        </Link>
        <h2 className="mt-6 font-headline-xl text-headline-xl font-bold text-on-surface">
          {step === 'credentials' && 'Staff Portal Login'}
          {step === 'otp' && 'Two-Factor Authentication'}
          {step === 'change_password' && 'Set Permanent Password'}
        </h2>
        <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant">
          {step === 'credentials' && 'Enter your verified credentials to request a secure login code'}
          {step === 'otp' && 'Enter the 6-digit passcode sent to your authorized email address'}
          {step === 'change_password' && 'Configure a secure password before accessing the clinical CMS'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-clinical py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-border-hairline space-y-6">

          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'credentials' ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'
              }`}>
                1
              </span>
              <span className="text-xs font-semibold text-on-surface">Password</span>
            </div>
            <div className="w-6 h-px bg-border-hairline"></div>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'otp' ? 'bg-primary text-on-primary' : (step === 'change_password' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-subtle text-outline')
              }`}>
                2
              </span>
              <span className="text-xs font-semibold text-on-surface">Email OTP</span>
            </div>
            <div className="w-6 h-px bg-border-hairline"></div>
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 'change_password' ? 'bg-primary text-on-primary' : 'bg-surface-subtle text-outline'
              }`}>
                3
              </span>
              <span className="text-xs font-semibold text-on-surface">Security</span>
            </div>
          </div>

          {/* Alert notifications */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-error-container text-on-error-container text-body-sm font-semibold flex items-center gap-2 animate-fade-in border border-error/20">
              <span className="material-symbols-outlined text-[20px] text-error shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-surface-tinted text-primary text-body-sm font-semibold flex items-center gap-2 animate-fade-in border border-primary/20">
              <span className="material-symbols-outlined text-[20px] text-primary shrink-0">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: EMAIL + PASSWORD CREDENTIALS */}
          {step === 'credentials' && (
            <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1" htmlFor="email">
                  Administrative Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary transition-all font-semibold"
                    placeholder="hello.aniheal@gmail.com"
                  />
                  <span className="material-symbols-outlined text-outline absolute left-3 top-3 text-[20px]">
                    alternate_email
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1" htmlFor="password">
                  Account Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary transition-all"
                    placeholder="••••••••"
                  />
                  <span className="material-symbols-outlined text-outline absolute left-3 top-3 text-[20px]">
                    lock
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-outline hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <span className="text-[11px] text-outline mt-1.5 block">
                  Upon verifying your password, a 6-digit OTP will be dispatched to your email via Resend.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    <span>Verifying Credentials &amp; Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">lock_open</span>
                    <span>Verify &amp; Send OTP Passcode</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT EMAIL OTP ENTRY */}
          {step === 'otp' && (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-border-hairline flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-primary text-[20px]">mark_email_read</span>
                  <span className="text-xs font-semibold text-on-surface truncate">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setOtp('');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer shrink-0 ml-2"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-2 text-center" htmlFor="otp">
                  Enter 6-Digit Email Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-14 text-center tracking-[12px] font-mono text-2xl font-bold rounded-xl bg-surface-subtle border-2 border-primary text-primary focus:outline-none focus:bg-surface-clinical transition-all shadow-inner"
                  placeholder="••••••"
                />
                <div className="flex items-center justify-between text-[11px] text-outline mt-2 px-1">
                  <span>Passcode expires in 10 minutes</span>
                  {cooldown > 0 ? (
                    <span>Resend in {cooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isSubmitting}
                      className="font-bold text-primary hover:underline cursor-pointer"
                    >
                      Resend Passcode
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.length < 6}
                className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    <span>Verify Passcode &amp; Log In</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: MANDATORY FIRST-TIME PASSWORD CHANGE */}
          {step === 'change_password' && (
            <form className="space-y-4" onSubmit={handleChangePasswordSubmit}>
              <div className="p-3.5 rounded-xl bg-surface-subtle border border-primary/20 text-xs text-on-surface space-y-1">
                <div className="font-bold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  <span>Temporary Password Detected</span>
                </div>
                <p className="text-on-surface-variant text-[11px]">
                  Please create a permanent password (minimum 8 characters) for your staff account to continue.
                </p>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1" htmlFor="new-pass">
                  New Permanent Password
                </label>
                <input
                  id="new-pass"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary transition-all"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1" htmlFor="confirm-pass">
                  Confirm Permanent Password
                </label>
                <input
                  id="confirm-pass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary transition-all"
                  placeholder="Re-enter new password"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || newPassword.length < 8 || newPassword !== confirmPassword}
                className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    <span>Saving Permanent Password...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                    <span>Set Password &amp; Enter CMS</span>
                  </>
                )}
              </button>
            </form>
          )}

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
